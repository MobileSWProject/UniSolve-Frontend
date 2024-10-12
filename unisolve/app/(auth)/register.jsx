import { useFocusEffect, useRouter } from "expo-router";
import { useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { mainColor } from '../../constants/Colors';
import _axios from "../../api";

export default function Register() {
  const router = useRouter();
  const [id, setID] = useState("");
  const [idCheck, setIDCheck] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailCheck, setEmailCheck] = useState(false);
  const [emailChecks, setEmailChecks] = useState(false);
  const [password, setPassword] = useState("");
  const [subPassword, setSubPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [school, setSchool] = useState("");
  const [schoolData, SetSchoolData] = useState([]);
  const [search, setSearch] = useState("");

  const IDCheckProcess = async () => {
    await _axios.post('/existuser', {user_id: id}).then(response => {
      setIDCheck(response.data.isNotExist || false);
    })
    .catch(() => {
      setIDCheck(false);
    })    
  };

  const EmailCheckProcess = async () => {
    await _axios.post('/send-code', {email}).then(response => {
      setEmailCheck(response.data.isSent || false);
    })
    .catch(() => {
      setEmailCheck(false);
    })
  };

  const EmailChecksProcess = async () => {
    await _axios.post('/verify-code', {email, code: emailConfirm }).then(response => {
      setEmailChecks(response.data.isVerified || false);
    })
    .catch(() => {
      setEmailChecks(false);
    })
  };

  const RegisterProcess = async () => {
    if (id.length <= 0 || !idCheck || name.length <= 0 ||  email.length <= 0 || !emailCheck || !emailChecks || password !== subPassword || nickname.length <= 0) return;
    await _axios.post('/register', {user_id: id, username: name, email: email, password: password, user_nickname: nickname, school: school }).then(response => {
      if (response.data.status === "success") {
        router.push('/registerOk');
      }
    })
  };

  useFocusEffect(
    useCallback(() => {
      _axios.get('/universities').then(response => {
        SetSchoolData(response.data.universities);
      })
    }, [])
  );

  const searchSchool = () => {
    return schoolData && search ? schoolData.filter(item =>
      item.univ_name.includes(search)
    ) : []
  }

  const handleSelect = (item) => {
    setSearch(item.univ_name);
    setSchool(item.univ_name);
  };

  return (
    <View style={styles.container}>
      {/* 회원가입 제목 */}
      <Text style={styles.title}>회원가입</Text>

      {/* 아이디 입력 필드와 버튼 */}
      <Text style={styles.label}>아이디 ({idCheck ? '확인 완료' : '중복 확인 필요'})</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="사용할 아이디를 입력하세요."
          value={id}
          onChangeText={setID}
          disabled={idCheck}
        />
        { /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{4,}$/.test(id) ?
          <TouchableOpacity disabled={idCheck} style={[styles.buttonSmall, {backgroundColor: idCheck ? 'gray' : mainColor}]} onPress={() => IDCheckProcess()}>
            <Text style={styles.buttonTextSmall}>중복확인</Text>
          </TouchableOpacity> :
          <></>
        }
      </View>

      {/* 이름 입력 필드 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="한글, 본명을 입력하세요"
        value={name}
        onChangeText={setName} 
      />

      {/* 이메일 입력 필드 */}
      <Text style={styles.label}>이메일 ({emailChecks ? '인증 완료' : '인증 필요'})</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="이메일 @형식으로 입력하세요"
          value={email}
          onChangeText={setEmail} 
          disabled={emailCheck}
        />
        {!emailCheck && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ?
          <TouchableOpacity style={[styles.buttonSmall, {backgroundColor: emailCheck ? 'gray' : mainColor}]} onPress={() => EmailCheckProcess()}>
            <Text style={styles.buttonTextSmall}>이메일 인증</Text>
          </TouchableOpacity> :
          <></>
        }
        {emailCheck ? 
        <>
        {/* 이메일 입력 필드 */}
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="이메일로 발송된 인증번호를 입력하세요."
          value={emailConfirm}
          onChangeText={setEmailConfirm} 
          disabled={emailChecks}
        />
        <TouchableOpacity disabled={emailChecks} style={[styles.buttonSmall, {backgroundColor: emailChecks ? 'gray' : mainColor}]} onPress={() => EmailChecksProcess()}>
          <Text style={styles.buttonTextSmall}>인증</Text>
        </TouchableOpacity>
        </> : 
        <></>
        }
      </View>

      <View style={styles.row}>
        {/* 비밀번호 입력 필드 */}
        <View style={styles.flexItem}>
          <Text style={styles.label}>비밀번호 ({!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(password) ? '규칙이 잘못됨' : password === subPassword ? '일치함' : '일치하지 않음'})</Text>
          <TextInput
            style={styles.input}
            placeholder="사용할 비밀번호를 입력하세요."
            value={password}
            onChangeText={setPassword} 
            secureTextEntry={true}
          />
        </View>

        {/* 비밀번호 확인 입력 필드 */}
        <View style={styles.flexItem}>
          <Text style={styles.label}>비밀번호 확인 ({!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W])[a-zA-Z0-9\W]{8,}$/.test(password) ? '규칙이 잘못됨' : password === subPassword ? '일치함' : '일치하지 않음'})</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 입력하세요."
            value={subPassword}
            onChangeText={setSubPassword} 
            secureTextEntry={true}
          />
        </View>
      </View>

      {/* 닉네임 입력 필드 */}
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        placeholder="앱 사용시 사용할 닉네임을 입력하세요"
        value={nickname}
        onChangeText={setNickname} 
      />

      {/* 소속 입력 필드 */}
      <Text style={styles.label}>소속</Text>
      <TextInput
        style={styles.input}
        placeholder="본인의 소속을 입력 후 선택하세요."
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        style={styles.list}
        data={searchSchool()}
        keyExtractor={item => item.univ_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item)}>
            <Text style={styles.item}>
              {item.univ_name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}></Text>}
      />

      {/* 하단 로그인 링크 */}
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: mainColor }]} 
        onPress={() => RegisterProcess()}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  flexInput: {
    flex: 1,
    marginRight: 8,
    height: 50,
  },
  flexItem: {
    flex: 1,
    marginRight: 8,
  },
  list: {
    flex: 1,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginBottom: 8,
    height: 50,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonTextSmall: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: mainColor,
    fontWeight: 'bold',
  },
});
