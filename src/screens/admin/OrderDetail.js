import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  Button,
  ScrollView,
} from 'react-native';
import apis from '../../api/apis';
import List from '../../components/list';
var numeral = require('numeral');
export default function OrderDetail({route}) {
  //Store original order list
  const [orderList, setOrderList] = useState([]);
  const [orderDetailList, setOrderDetailList] = useState([]);
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
   
    ],
    data: orderList,
    width: [50, 150, 150, 150, 150, 150, 150, 150],
  };
  const orderDetailTable = {
    head: ['ID', 'Image', 'Product', 'Price', 'Quantity', 'Total'],
    data: orderDetailList,
    width: [50, 200, 150, 100, 150, 150],
  };
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    apis.GetOrderByID(token_temp, route.params?.order_id).then(response => {
        
      const list_temp = response['orderList'][0];
      const list_detail = list_temp['order_detail'];
      const array_temp = [];
      const detail_product_array_temp = [];

      for (var i = 0; i < list_detail.length; i++) {
        const gallery = list_detail[i]['product_images'].split(',');
        detail_product_array_temp.push(
          Array(
            list_detail[i]['product_detail_id'],
            <Image
              style={{height: 200}}
              source={{
                uri: `https://api.uniproject.xyz/eshopmb/images/${gallery[0]}`,
              }}
            />,
            list_detail[i]['product_color'],
            list_detail[i]['product_price_discounted'],
            list_detail[i]['product_amount'],
            list_detail[i]['product_price_discounted'] *
              list_detail[i]['product_amount'],
          ),
        );
        setOrderDetailList(detail_product_array_temp);
      }
      array_temp.push(
        Array(
          list_temp['order_id'],
          list_temp['customer_name'],
          list_temp['order_address'],
          list_temp['customer_phone'],
          list_temp['voucher_code'],
          list_temp['order_total'],
          list_temp['order_status'],
          new Date(list_temp['order_created_at']).toLocaleString('YYYY-MM-dd'),
        ),
      );

      setOrderList(array_temp);
    });
  }
  useEffect(() => {
    let isMounted = true;

    fetchData();
    return () => {
      setOrderList([]);
      setOrderDetailList([]);
    };
  }, [route.params?.order_id]);

  const element = (data, index) => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
      }}>
      <Button title="Detail" size={24} onPress={() => console.log(data[0])} />
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Order Parent</Text>
        <List title="" data={orderTable} element={element}></List>
        <Text>Order Children</Text>
        <List title="" data={orderDetailTable} element={element}></List>
      </ScrollView>
    </SafeAreaView>
  );
}
