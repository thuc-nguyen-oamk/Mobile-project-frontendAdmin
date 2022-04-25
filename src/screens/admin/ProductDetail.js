import React, {useState, useEffect, useCallback} from 'react';
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
export default function ProductDetail({route, navigation}) {
  const [productList, setProductList] = useState([]);
  const [producDetailtList, setProductDetailList] = useState([]);
  const [response,setResponse]= useState([])
  const productTable = {
    head: [
      'ID',
      'Image',
      'Product',
      'Brand',
      'Price',
      'Promotion',
      'Category',
      'Description',
      'Rating',
      'Stock',
      'Action',
    ],
    data: productList,
    width: [50, 200, 150, 100, 150, 150, 150, 150, 150, 150, 150, 1],
  };
  const productDetailTable = {
    head: ['ID', 'Image', 'Color', 'Price', 'Promotion', 'Stock', 'Action'],
    data: producDetailtList,
    width: [50, 200, 150, 100, 150, 150, 150],
  };
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
   await apis.GetProductByID(token_temp, route.params?.product_id).then(response => {


      const list_temp = response;
      var list_detail =list_temp[0]['details'];
  
      
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
            list_detail[i]['product_price'],
            list_detail[i]['product_price_discounted'],
            list_detail[i]['product_stock'],
            "ProductDetail"
          ),
        );
        setProductDetailList(detail_product_array_temp);
      }
      array_temp.push(
        Array(
          list_temp[0]['product_id'],
          <Image
            style={{height: 200}}
            source={{
              uri: `https://api.uniproject.xyz/eshopmb/images/${list_temp[0]['product_image']}`,
            }}
          />,
          list_temp[0]['product_name'],
          list_temp[0]['product_brand'],
          list_temp[0]['display_price'],
          list_temp[0]['display_price_discounted'],
          list_temp[0]['category_name'],
          list_temp[0]['product_description'],
          list_temp[0]['product_rating'],
          list_temp[0]['product_stock_total'],
          'Product',
          list_temp[0]['category_id'],
        ),
      );

      setProductList(array_temp);
    });
  }
  useEffect(() => {
   
      let isMounted = true;

      fetchData();
      
      return () => {
        setProductList([]);
        setProductDetailList([]);
      
    }
   
  },[route.params?.product_id]);
  const element = (data, index) => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
      }}>
      <Button
        title="Edit"
        size={24}
        onPress={() =>
          navigation.navigate('EditProduct', {data: JSON.stringify(data)})
        }
      />

      <Button
        title="Add more product child"
        size={24}
        onPress={() =>navigation.navigate('AddChildProduct', {data: JSON.stringify(data[0])})}
      />
    </View>
  );
  const element1 = (data, index) => (
  
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
      }}>
      <Button
        title="Edit"
        size={24}
        onPress={() =>
          navigation.navigate('EditChildProduct', {data: JSON.stringify(data)})
        }
      />

    
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Product Parent</Text>
        <List title="" data={productTable} element={element}></List>
        <Text>Product Children</Text>
        <List title="" data={productDetailTable} element={element1}></List>
      </ScrollView>
    </SafeAreaView>
  );
}
