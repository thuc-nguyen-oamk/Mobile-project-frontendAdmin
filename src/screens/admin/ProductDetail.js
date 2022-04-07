import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, View, Text, Image, SafeAreaView,Button,
    ScrollView,} from 'react-native';
import apis from '../../api/apis';
import List from '../../components/list';
export default function ProductDetail({route}) {
  const [productList, setProductList] = useState([]);
  const [producDetailtList, setProductDetailList] = useState([]);
  const productTable = {
    head: [
      'ID',
      'Image',
      'Product',
      'Brand',
      'Category',
      'Description',
      'Rating',
      'Stock',

      'Action',
    ],
    data: productList,
    width: [50, 200, 150, 100, 150, 150, 150, 150, 150],
  };
  const productDetailTable = {
    head: [
      'ID',
      'Image',
      'Color',
      'Price',
      'Promotion',
      'Stock',

      'Action',
    ],
    data: producDetailtList,
    width: [50, 200, 150, 100, 150, 150, 150],
  };
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    apis.GetProductByID(token_temp, route.params?.product_id).then(response => {
      const list_temp = response;
      const list_detail = list_temp[0]['details'];
      const array_temp = [];
      const detail_product_array_temp = [];

    

      for (var i = 0; i < list_detail.length; i++) {
        detail_product_array_temp.push(
          Array(
            list_detail[i]['product_detail_id'],
            <Image
              style={{height: 200}}
              source={{
                uri: `https://api.uniproject.xyz/eshopmb/images/${list_detail[i]['product_images']}`,
              }}
            />,
            list_detail[i]['product_color'],
            list_detail[i]['product_price'],
            list_detail[i]['product_price_discounted'],
            list_detail[i]['product_stock'],
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
          list_temp[0]['category_name'],
          list_temp[0]['product_description'],
          list_temp[0]['product_rating'],
          list_temp[0]['product_stock_total'],
          "Product"
        ),
      );

      setProductList(array_temp);
    });
  }
  useEffect(() => {
    let isMounted = true;

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [route.params?.product_id]);
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
             <Text>Product Parent</Text>
      <List title="" data={productTable} element={element}></List>
      <Text>Product Children</Text>
      <List title="" data={productDetailTable} element={element}></List>
      </ScrollView>
    </SafeAreaView>
  );
}