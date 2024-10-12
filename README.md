초기 세팅을 위해 다음의 명령어를 순서대로 진행합니다.

1. `npx create-expo-app@latest unisolve --example with-router`
2. Delete `babel.config.js`
3. `npm install expo-image-picker`

이후 실행할 때는, 다음의 명령어를 사용합니다.

1. `cd unisolve`
2. `npx expo start`

## Project Setup

### Git Clone

```bash
git clone https://github.com/MobileSWProject/UniSolve-Frontend
```

### 프로젝트 폴더에 React Native 작업 영역으로 이동

```bash
cd UniSolve-Frontend/unisolve/
```

### 패키지 설치

```bash
npm i
```

### 환경 변수 세팅

- unisolve/`.env` 파일 생성
- .env 파일에 필요한 환경 변수 세팅

```
EXPO_PUBLIC_SERVER_BASE_URL=http://[서버아이피]:[서버포트]
```

ex)

```
EXPO_PUBLIC_SERVER_BASE_URL=http://127.0.0.1:5555
```

### 프로젝트 실행

```bash
npm run start
```

### Git Pull 이후 오작동 날 경우

- unisolve/node_modules 삭제
- unisolve/.expo 삭제
- `UniSolve-Frontend/unisolve` 경로에서 `npm i` 실행하여 다시 패키지 설치
