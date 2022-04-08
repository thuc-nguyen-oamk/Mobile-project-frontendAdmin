import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import apis from '../../api/apis';
import List from '../../components/list';

var numeral = require('numeral');
export default function Order({navigation}) {
  //Store original order list
  const [orderList, setOrderList] = useState([]);
  //Store token
  const [token, setToken] = useState('');
  //Get the first resource
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    apis.BasicInformation(token_temp).then(response => {
      //get
      const list_temp = response['listOrder2'];

      const array_temp = [];

      for (var i = 0; i < list_temp.length; i++) {
        array_temp.push(
          Array(
            list_temp[i]['order_id'],
            list_temp[i]['customer_name'],
            list_temp[i]['order_address'],
            list_temp[i]['customer_phone'],
            list_temp[i]['voucher_code'],
            list_temp[i]['order_total'],
            list_temp[i]['order_status'],
            new Date(list_temp[i]['order_created_at']).toLocaleString(
              'YYYY-MM-dd',
            ),
            'Order',
          ),
        );
      }

      setOrderList(array_temp);
    });
    setToken(token_temp);
  }

  useEffect(() => {
    const intervalCall = setInterval(() => {
      fetchData();
      console.log("run")
    }, 1000000);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
    
  }, []);
  //Definite order table data to pass to Table
  const orderTable = {
    head: [
      'ID',
      'Customer',
      'Address',
      'Phone',
      'Voucher',
      'Total',
      'Status',
      'Created at',
      'Action',
    ],
    data: orderList,
    width: [50, 150, 150, 150, 150, 150, 150, 150, 200],
  };
  //Function to update order status
  function updateStatus(data, status, index) {
    data[6] = status;

    let newArr = [...orderList];
    newArr[index] = data;
    setOrderList(newArr);

    const payload = {
      order_id: data[0],
      order_status: status,
    };

    apis.OrderUpdate(token, payload).then(response => Alert.alert(response));
  }
  // Create button for order
  function getOrderDetail(data, index) {
    console.log(data);
  }
  const element = (data, index) => (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: 10,
        }}>
        <Button
          title="Received"
          disabled={data[6] === 'Received' ? true : false}
          size={24}
          onPress={() => updateStatus(data, 'Received', index)}
        />
        <Button
          title="Preparing"
          disabled={data[6] === 'Preparing' ? true : false}
          size={24}
          onPress={() => updateStatus(data, 'Preparing', index)}
        />
        <Button
          title="Delivering"
          disabled={data[6] === 'Delivering' ? true : false}
          size={24}
          onPress={() => updateStatus(data, 'Delivering', index)}
        />
        <Button
          title="Closed"
          disabled={data[6] === 'Closed' ? true : false}
          size={24}
          onPress={() => updateStatus(data, 'Closed', index)}
        />
      </View>
      <Button
        title="Order detail"
        onPress={() => navigation.navigate('OrderDetail', {order_id: data[0]})}
      />
    </View>
  );

  return (
    <>
      <View style={[styles.head]}>
        <Text style={styles.title}>List of Orders</Text>
      </View>

      <List title="" data={orderTable} element={element}></List>
    </>
  );
}
const styles = StyleSheet.create({
  title: {fontWeight: 'bold', color: 'black', fontSize: 20},
  head: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
});
