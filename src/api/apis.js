import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
    baseURL: 'https://api.uniproject.xyz/eshopmb/',
    headers: {
        'content-type':'application/json',
    },
});
export default {
    Login: (email,password) =>
    instance({
        'method': 'POST',
        'url':'/admin/login',
        auth:{
            username: email,
            password: password
        }
    }) .then(function (response) {
        // handle success
       
        AsyncStorage.setItem('token',JSON.stringify(response.data['token']));  
        return "Authorized";
        
      })
      .catch(function (error) {
          
        // handle error
        return error.message
       // alert(error.message);
      })
}