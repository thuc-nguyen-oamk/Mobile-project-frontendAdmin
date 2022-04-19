import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const URL = 'https://api.uniproject.xyz/eshopmb/';
// const URL = 'http://87.100.200.90:3000';

// const instance = axios.create({
//   baseURL: URL,
//   headers: {
//     'content-type': 'application/json',
//   },
// });


const instance = axios.create({
  baseURL: URL,
  headers: {
    Accept: 'application/json',
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
  GetOrderByID: (TOKEN, payload) =>
    authorized({
      method: 'GET',
      url: `order/${payload}`,
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
  UpdateProduct: (payload, TOKEN) =>
    fetch(`${URL}/products/`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: payload,
    })
      .then(response => response.json())
      .then(message => Alert.alert(message.message))
      .catch(error => console.error(error)),
  GetCategory: TOKEN =>
    authorized({
      method: 'GET',
      url: `/categories`,
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
  UpdateChildProduct: (payload, TOKEN) =>
    fetch(`${URL}/products/detail`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: payload,
    })
      .then(response => response.json())
      .then(message => Alert.alert(message.message))
      .catch(error => console.error(error)),
  AddChildProduct: (payload, TOKEN) =>
    fetch(`${URL}/products/addDetail`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: payload,
    })
      .then(response => response.json())
      .then(message => Alert.alert(message.message))
      .catch(error => console.error(error)),
  AddProduct: (payload, TOKEN) =>
    authorized({
      method: 'POST',
      url: `products/add`,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      data:payload
    })
      .then( (response) =>{
        // handle success
        //console.log(response.data.message)
        Alert.alert(response.data.message)
       
      })
      .catch(function (error) {
        // handle error
        console.log(error.message)
        return error.message;
        // alert(error.message);
      }),
};
