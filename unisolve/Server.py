from flask import Flask, request, jsonify
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
from mysql.connector import Error

# Flask 애플리케이션 초기화
app = Flask(__name__)

# MySQL 데이터베이스 설정
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'database': 'unisolve'
}

# 데이터베이스 연결 함수
def get_db_connection():
    connection = mysql.connector.connect(
        host=db_config['host'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database']
    )
    return connection

# 기본 라우트 (테스트 용도)
@app.route('/')
def home():
    return "Welcome to the Flask MySQL server!"

# 데이터 조회 (SELECT)
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")  # `users` 테이블을 조회
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(result)

# 질문 데이터 조회 (전체 또는 특정 사용자)
@app.route('/questions', methods=['GET'])
def get_questions():
    user = request.args.get('user')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 특정 사용자의 질문 조회 (쿼리 파라미터로 전달된 경우)
    if user:
        cursor.execute("SELECT * FROM problem WHERE created_by = %s", (user,))
    else:
        cursor.execute("SELECT * FROM problem")

    result = cursor.fetchall()
    cursor.close()
    conn.close()
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

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO problem (is_public, created_by, title, description, created_at, answer_count) "
        "VALUES (%s, %s, %s, %s, %s, %s)",
        (is_public, user, title, content, created_time, answer_count)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Question added successfully!'}), 201

# 특정 질문 수정 (공개 여부, 제목, 내용 수정)
@app.route('/questions/<int:id>', methods=['PUT'])
def update_question(id):
    update_data = request.json
    is_public = update_data.get('is_public')
    title = update_data.get('title')
    content = update_data.get('content')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE questions SET is_public = %s, title = %s, description = %s WHERE problem_id = %s",
        (is_public, title, content, id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Question updated successfully!'})

# 특정 질문 삭제
@app.route('/questions/<int:id>', methods=['DELETE'])
def delete_question(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM problem WHERE problem_id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Question deleted successfully!'})

# 질문 기록을 데이터베이스에 추가하는 라우트
@app.route('/add_history', methods=['POST'])
def add_history():
    # 요청으로부터 데이터 수신
    histories = request.json  # `histories`는 배열 형태의 데이터가 들어온다고 가정

    conn = get_db_connection()
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
    conn.close()

    return jsonify({'message': 'Histories added successfully!'}), 201

mysql = MySQL(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5001)