import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import List from '../../components/list';
import Pannel from '../../components/panel';
import Icon from 'react-native-vector-icons/FontAwesome';
import apis from '../../api/apis';
var numeral = require('numeral');
export default function AdminPage({navigation}) {
  const [adminInfo, setAdminInfo] = useState({});
  const [pannelInfor, setPannelInfor] = useState({});
  const [productDataSet,setProductDataSet] = useState([]);
  const [orderDataSet,setOrderDataSet] = useState([]);
  const [token, setToken] = useState('');
  const Logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('adminInfo');
    console.log('Log out');
    navigation.navigate('Login');
  };

  const productTable = {
    head: ['ID', 'Product', 'Category', 'Sold'],
    data: productDataSet,
    width: [50, 150, 150, 100],
  };

  const orderTable = {
    head: ['ID', 'ID Customer', 'Address', 'Total', 'Created at'],
    data:orderDataSet,
    width: [50, 100, 150, 100, 100],
  };

  async function fetchData() {
    const temp = await AsyncStorage.getItem('adminInfo');
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
   // token_temp= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6NzI1MjY0MywiYWRtaW5fZW1haWwiOiJkZGtob2FAZ21haWwuY29tIiwiYWRtaW5fbmFtZSI6IkRJTkggREFORyBLSE9BIiwiYWRtaW5fYWRkcmVzcyI6IkthbGVydm9udGllIiwiYWRtaW5fcGhvbmUiOiIxMjM0NTY3ODkiLCJpYXQiOjE2NDkzMTY3MzR9.Oqu47WdLEwdbK90i4_RYHd_iP--rDmVVp7NjenwCux4"
     apis.BasicInformation(token_temp).then(response => {
     
      setPannelInfor(response);
      const list_temp = response['listOrder2']
    
      const array_temp =[]
      for( var i = 0 ;i < (list_temp.length > 5 ? 5 : list_temp.length) ; i++)
      {
        array_temp.push(Array(list_temp[i]['order_id'],
        list_temp[i]['customer_id'],
        list_temp[i]['order_address'],
       numeral(list_temp[i]['order_total']).format('0,0') ,
       (new Date(list_temp[i]['order_created_at'])).toLocaleString('YYYY-MM-dd'),
        ))
      }
      setOrderDataSet(array_temp)
    });
    apis.ProductList(token_temp).then(response => {
      const list_temp = response
      const array_temp =[]
      for( var i = 0 ;i < (list_temp.length > 5 ? 5 : list_temp.length) ; i++)
      {
        array_temp.push(Array(list_temp[i]['product_id'],
        list_temp[i]['product_name'],
        list_temp[i]['category_name'],
      10,
        ))
      }
      
     setProductDataSet(array_temp)
      //setProductList(response)
   
    });
    setToken(token_temp);
    setAdminInfo(JSON.parse(temp));
  }
  useEffect(() => {
    const intervalCall = setInterval(() => {
      fetchData();
     
    }, 500000);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);



  
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          <Icon name="user" size={150} color="black" />

          <View style={styles.rightHeader}>
            <Text style={styles.title}>Welcome {adminInfo['admin_name']}</Text>
            <View style={styles.buttongroup}>
              <Button
                title="Change password"
                onPress={() => navigation.navigate('Profile')}
              />
              <Button
                title="Log out"
                onPress={() => {
                  Logout();
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.pannel}>
            <Pannel
              title="Profit"
              number={numeral(pannelInfor['money']).format('0,0')}></Pannel>
            <Pannel title="Orders" number={pannelInfor['listOrder']}></Pannel>
            <Pannel
              title="Customers"
              number={pannelInfor['listCustomer']}></Pannel>
            <Pannel title="Pannel Name" number="1234556"></Pannel>
          </View>
          <View>
            <List
              title="List to show the most popular products"
              data={productTable}></List>
            <List title="List of the recent orders" data={orderTable}></List>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#F9ABF9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 150,
  },
  buttongroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  rightHeader: {
    width: '60%',
    display: 'flex',
    justifyContent: 'center',

    height: '100%',
  },
  content: {
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  pannel: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
