import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useState, useEffect} from 'react';
import api from '../api/apis';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisibility] = React.useState(false);
  const [error,setError]= useState("")


  const icon = !visible ? 'SHOW' : 'HIDE';
  const LoginFunc =(email,password)=>{
    if(email == 0 || password == 0 )
    {
     setError("Email and password required")
    }
    else if (!email.includes("@")){
        setError("Please enter right email format")
    }
    else{
        setError("")
       api.Login(email,password).then((response) => 
       { 
         if(response == "Authorized")
        {
         navigation.navigate('AdminHome')
        }
        else{
          setError("Usename or password is wrong !!!");
        }
        console.log('response xxx', response)
      }
      )
        // .finally(function () {
        //   // always executed
        //   alert('Finally called');
        // });
    }
    
  

}

  return (
    <View style={styles.container}>
      <Text style={styles.title} backgroundColor="black">
        Login
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#BDBDBD"
          onChangeText={email => setEmail(email)}
        />
      </View>

      <View style={[styles.inputView, {display:"flex", flexDirection:"row", alignItems:"center",justifyContent:"center"}]} >
        <TextInput
          style={[styles.TextInput]}
          placeholder="Password."
          placeholderTextColor="#BDBDBD"
          secureTextEntry={!visible}
          onChangeText={password => setPassword(password)}
          
        />
        <Button  onPress={() => setVisibility(!visible)} title={icon}/>
      

      </View>
        <Text style={{color:"red"}}>{error}</Text>
      <TouchableOpacity style={styles.loginBtn} onPress ={()=>LoginFunc(email,password)}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop:40
  },
  title: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputView: {
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    width: '90%',
    height: 45,
    marginBottom: 20,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: 'black',
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    width: '90%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#F9ABF9',
  },
  icons: {
    backgroundColor: '#e3e3e3',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
