import axios from 'axios'
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
    })
}