import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const instance = axios.create({
//     baseURL: 'https://api.uniproject.xyz/eshopmb/',
//     headers: {
//         'content-type':'application/json',
//     },
// });

const instance = axios.create({
  baseURL: 'https://api.uniproject.xyz/eshopmb/',
  headers: {
    'content-type': 'application/json',
  },
});
const authorized = axios.create({
  baseURL: 'https://api.uniproject.xyz/eshopmb/',
});

// const instance = axios.create({
//   baseURL: 'http://87.100.200.90:3000/',
//   headers: {
//     'content-type': 'application/json',
//   },
// });
// const authorized = axios.create({
//   baseURL: 'http://87.100.200.90:3000/',
// });
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

        AsyncStorage.setItem('token', JSON.stringify(response.data['token']));
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
        // handle success

        return response.data;
      })
      .catch(function (error) {
        // handle error
        return error.message;
        // alert(error.message);
      }),
  GetCustomerWithLastMessageList: TOKEN =>
    authorized({
      method: 'GET',
      url: '/messages/customerWithLastMessageList',
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
  GetACustomer: (TOKEN, customerId) =>
    authorized({
      method: 'GET',
      url: `/customers/${customerId}`,
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
