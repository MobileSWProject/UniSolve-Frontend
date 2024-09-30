from flask import Flask, request, jsonify, redirect
from flask_mysqldb import MySQL
from flask_cors import CORS
import bcrypt
import random
import smtplib
import jwt
import datetime
import pytz
import requests
import mysql.connector
import pymysql
from mysql.connector import Error

# Flask 애플리케이션 초기화
app = Flask(__name__)
CORS(app)

# MySQL 데이터베이스 설정
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'unisolve'
}

try:
    # 데이터베이스 연결
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='1234',
        database='unisolve'
    )

    if connection.is_connected():
        print("Successfully connected to the database")

except mysql.connector.Error as err:
    print(f"Error: {err}")

mysql = MySQL(app)

# 로그인 처리 엔드포인트
@app.route('/login', methods=['POST'])
def login():
    try:
        # 클라이언트에서 전달받은 JSON 데이터
        data = request.json
        user_id = data.get('user_id')          # 사용자 ID
        password = data.get('password')        # 비밀번호

        # 입력값 유효성 검사
        if not user_id or not password:
            return jsonify({"status": "error", "message": "User ID and password are required!"})

        # 데이터베이스 커서 생성
        cursor = db_config.cursor(pymysql.cursors.DictCursor)

        # 사용자가 입력한 ID로 DB에서 비밀번호 조회
        sql = "SELECT user_pw FROM users WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        result = cursor.fetchone()

        # 해당 ID가 존재하지 않는 경우
        if not result:
            return jsonify({"status": "error", "message": "User ID not found!"})

        # 데이터베이스에서 가져온 해시된 비밀번호와 입력된 비밀번호 비교
        hashed_pw = result['user_pw']
        if bcrypt.checkpw(password.encode('utf-8'), hashed_pw.encode('utf-8')):
            return jsonify({"status": "success", "message": "Login successful!"})
        else:
            return jsonify({"status": "error", "message": "Incorrect password!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 회원가입 처리 엔드포인트 (선택 사항)
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        user_id = data.get('user_id')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        user_nickname = data.get('user_nickname', None)

        if not user_id or not username or not email or not password:
            return jsonify({"status": "error", "message": "All fields are required!"})

        # 비밀번호 해싱
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # 데이터베이스 커서 생성
        cursor = db_config.cursor()
        sql = """
        INSERT INTO users (user_id, username, email, user_pw, user_nickname, role)
        VALUES (%s, %s, %s, %s, %s, 'student')
        """
        cursor.execute(sql, (user_id, username, email, hashed_pw.decode('utf-8'), user_nickname))
        db_config.commit()

        return jsonify({"status": "success", "message": "User registered successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 데이터 조회 (SELECT)
@app.route('/users', methods=['GET'])
def get_users():
    conn = connection
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")  # `users` 테이블을 조회
    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

# 질문 데이터 조회 (전체 또는 특정 사용자)
@app.route('/questions', methods=['GET'])
def get_questions():
    user = request.args.get('user')
    conn = connection
    cursor = conn.cursor(dictionary=True)

    # 특정 사용자의 질문 조회 (쿼리 파라미터로 전달된 경우)
    if user:
        cursor.execute("SELECT * FROM problem WHERE created_by = %s", (user,))
    else:
        cursor.execute("SELECT * FROM problem")

    result = cursor.fetchall()
    cursor.close()
    return jsonify(result)

# 질문 데이터 삽입
@app.route('/questions', methods=['POST'])
def add_question():
    new_question = request.json
    is_public = new_question.get('is_public')
    user = new_question.get('user')
    title = new_question.get('title')
    content = new_question.get('content')
    created_time = datetime.now()
    answer_count = 0

    conn = connection
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO problem (is_public, created_by, title, description, created_at, answer_count) "
        "VALUES (%s, %s, %s, %s, %s, %s)",
        (is_public, user, title, content, created_time, answer_count)
    )
    conn.commit()
    cursor.close()

    return jsonify({'message': 'Question added successfully!'}), 201

# 특정 질문 수정 (공개 여부, 제목, 내용 수정)
@app.route('/questions/<int:id>', methods=['PUT'])
def update_question(id):
    update_data = request.json
    is_public = update_data.get('is_public')
    title = update_data.get('title')
    content = update_data.get('content')

    conn = connection
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE questions SET is_public = %s, title = %s, description = %s WHERE problem_id = %s",
        (is_public, title, content, id)
    )
    conn.commit()
    cursor.close()

    return jsonify({'message': 'Question updated successfully!'})

# 특정 질문 삭제
@app.route('/questions/<int:id>', methods=['DELETE'])
def delete_question(id):
    conn = connection
    cursor = conn.cursor()
    cursor.execute("DELETE FROM problem WHERE problem_id = %s", (id,))
    conn.commit()
    cursor.close()

    return jsonify({'message': 'Question deleted successfully!'})

# 질문 기록을 데이터베이스에 추가하는 라우트
@app.route('/add_history', methods=['POST'])
def add_history():
    # 요청으로부터 데이터 수신
    histories = request.json  # `histories`는 배열 형태의 데이터가 들어온다고 가정

    conn = connection
    cursor = conn.cursor()
    
    # 각 데이터를 `problem_history` 테이블에 삽입
    for history in histories:
        id = history.get('id')
        is_private = history.get('private')
        user = history.get('user')
        title = history.get('title')
        description = history.get('description')
        timestamp = datetime.strptime(history.get('timestamp'), '%Y.%m.%d %H:%M') if 'timestamp' in history else datetime.now()
        reply_count = history.get('reply', 0)

        cursor.execute(
            """
            INSERT INTO problem_history (history_id, is_private, user_id, title, description, solved_at, reply_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (id, is_private, user, title, description, timestamp, reply_count)
        )

    conn.commit()
    cursor.close()

    return jsonify({'message': 'Histories added successfully!'}), 201

# 게시글 목록을 가져오는 API 엔드포인트
@app.route('/community', methods=['GET'])
def get_community():
    try:
        cursor = db_config.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM post")
        rows = cursor.fetchall()

        # 데이터 형식 맞추기
        response = []
        for row in rows:
            response.append({
                "id": row["post_id"],
                "questioner": row["author_id"],
                "title": row["title"],
                "description": row["content"],
                "timestamp": row["created_at"].strftime('%Y.%m.%d %H:%M'),
                "reply": 0  # 현재 답글은 기본값 0으로 설정
            })

        return jsonify(response)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    
# 게시글 작성 API 엔드포인트
@app.route('/add_post', methods=['POST'])
def add_post():
    try:
        data = request.json
        title = data.get('title')
        content = data.get('content')
        is_private = data.get('isPrivate')
        image = data.get('image')
        author_id = "닉네임"  # 예시로 작성자를 고정값으로 설정. 실제 작성자 ID를 받아올 수 있도록 수정 가능

        # 데이터베이스 커서 생성
        cursor = db_config.cursor()

        # 게시글 삽입 쿼리
        sql = """
        INSERT INTO post (title, content, is_private, image, author_id)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (title, content, is_private, image, author_id))
        db_config.commit()

        return jsonify({"status": "success", "message": "Post added successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 알림 추가 API 엔드포인트
@app.route('/add_notification', methods=['POST'])
def add_notification():
    try:
        # 클라이언트에서 전달받은 JSON 데이터
        data = request.json
        user_id = data.get('user_id')  # 사용자 ID
        title = data.get('title')      # 알림 제목
        is_private = data.get('isPrivate', False)  # 공개 여부 (기본값: False)
        description = data.get('description')      # 알림 설명
        is_read = data.get('isRead', False)        # 읽음 여부 (기본값: False)

        # 데이터베이스 커서 생성
        cursor = db_config.cursor()

        # 알림 삽입 쿼리
        sql = """
        INSERT INTO notification (user_id, title, is_private, description, is_read)
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (user_id, title, is_private, description, is_read))
        db_config.commit()

        return jsonify({"status": "success", "message": "Notification added successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 게시글 리스트 가져오기 엔드포인트 (type='community')
@app.route('/community', methods=['GET'])
def get_community():
    try:
        cursor = db_config.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT post_id AS id, title, content AS description, author_id AS questioner, created_at AS timestamp, reply_count AS reply FROM post")
        rows = cursor.fetchall()
        for row in rows:
            row['timestamp'] = row['timestamp'].strftime('%Y.%m.%d %H:%M')  # 날짜 형식 변환
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 알림 리스트 가져오기 엔드포인트 (type='notification')
@app.route('/notification', methods=['GET'])
def get_notifications():
    try:
        cursor = db_config.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT notification_id AS id, user_id, title, description, created_at AS timestamp, is_read AS check, is_private, TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS timebefore FROM notification")
        rows = cursor.fetchall()
        for row in rows:
            row['timebefore'] = f"{row['timebefore']}분 전"  # 시간차이를 표시
            row['timestamp'] = row['timestamp'].strftime('%Y.%m.%d %H:%M')
            row['type'] = 1 if row['is_private'] else 0  # type 변환
        return jsonify(rows)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 특정 게시글 보기 엔드포인트
@app.route('/post/<int:post_id>', methods=['GET'])
def get_post(post_id):
    try:
        cursor = db_config.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT post_id AS id, title, content AS description, author_id, created_at AS timestamp, reply_count FROM post WHERE post_id = %s", (post_id,))
        row = cursor.fetchone()
        if row:
            row['timestamp'] = row['timestamp'].strftime('%Y.%m.%d %H:%M')
            return jsonify(row)
        else:
            return jsonify({"status": "error", "message": "Post not found"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# 인증 및 리다이렉트 처리
@app.route('/auth/<path:url>', methods=['GET'])
def auth_redirect(url):
    # 로그인 여부를 체크하는 로직 (예시로 고정값 사용)
    is_authenticated = False  # 실제로는 세션, JWT 등을 이용하여 인증 체크
    if is_authenticated:
        return redirect(f"/{url}")
    else:
        return redirect("/login")  # 인증되지 않은 경우 로그인 페이지로 리다이렉트

mysql = MySQL(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5001)