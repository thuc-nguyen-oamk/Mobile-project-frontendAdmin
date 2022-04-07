import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const instance = axios.create({
//     baseURL: 'https://api.uniproject.xyz/eshopmb/',
//     headers: {
//         'content-type':'application/json',
//     },
// });
const URL = 'http://87.100.200.90:3000/';

const instance = axios.create({
  baseURL: URL,
  headers: {
    'content-type': 'application/json',
  },
});
const authorized = axios.create({
  baseURL: URL,
});

export default {
  Login: (email, password) =>
    instance({
      method: 'POST',
      url: '/admin/login',
      auth: {
        username: email,
        password: password,
      },
    })
      .then(function (response) {
        // handle success

        AsyncStorage.setItem('token', response.data['token']);
        AsyncStorage.setItem(
          'adminInfo',
          JSON.stringify(response.data['payload']),
        );

        return 'Authorized';
      })
      .catch(function (error) {
        // handle error
        return error.message;
        // alert(error.message);
      }),
  BasicInformation: TOKEN =>
    authorized({
      method: 'GET',
      url: '/order/statics',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then(function (response) {
        // handle success  getTokenFromStorage()
        return response.data;
      })
      .catch(function (error) {
        // handle error
        return error.message;
        // alert(error.message);
      }),
  ProductList: TOKEN =>
    authorized({
      method: 'get',
      url: '/products/all',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then(function (response) {
        // handle success

        return response.data['list'];
      })
      .catch(function (error) {
        // handle error

        return error.message;
        // alert(error.message);
      }),
  OrderUpdate: (TOKEN, payload) =>
    authorized({
      method: 'POST',
      url: 'order/update',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      data: payload,
    })
      .then(function (response) {
        // handle success

        return response.data;
      })
      .catch(function (error) {
        // handle error

        return error.message;
        // alert(error.message);
      }),
      GetProductByID: (TOKEN, payload) =>
      authorized({
        method: 'GET',
        url: `products/${payload}`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
       
      })
        .then(function (response) {
          // handle success
  
          return response.data;
        })
        .catch(function (error) {
          // handle error
  
          return error.message;
          // alert(error.message);
        }),
};
