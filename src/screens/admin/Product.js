import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import List from '../../components/list';
import Icon from 'react-native-vector-icons/FontAwesome';
import apis from '../../api/apis';

var numeral = require('numeral');
export default function Product({ navigation }) {
  const [productList, setProductList] = useState([]);

  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    apis.ProductList(token_temp).then(response => {
      const list_temp = response;
      
      const array_temp = [];
      for (var i = 0; i < list_temp.length; i++) {
        const gallery =list_temp[i]['display_image'].split(",")
        
      
        array_temp.push(
          Array(
            list_temp[i]['product_id'],
            <Image
              style={{height: 200}}
              source={{
                uri: `https://api.uniproject.xyz/eshopmb/images/${gallery[0]}`,
              }}
            />,
            list_temp[i]['product_name'],
            list_temp[i]['product_brand'],
            list_temp[i]['category_name'],
            list_temp[i]['product_description'],
            list_temp[i]['product_rating'],
            list_temp[i]['product_stock_total'],
            list_temp[i]['display_price'],
            list_temp[i]['display_price_discounted'],
            "Product"
          ),
        );
      }

      setProductList(array_temp);
    });
  }
  useEffect(() => {
    const intervalCall = setInterval(() => {
      fetchData();
     
    }, 1000000);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);

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
      'Price',
      'Promotion',
      'Action',
    ],
    data: productList,
    width: [50, 200, 150, 100, 150, 150, 150, 150, 150,150],
  };
  // Create button for order
  const element = (data, index) => (
      <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding:10
      }}>
      
      <Button title="Detail"size={24} onPress={() => navigation.navigate('ProductDetail',{"product_id":data[0]})} />
 
    </View>
  );

  return (
    <>
      <View style={[styles.head]}>
        <Text style={styles.title}>List of Products</Text>
        <Icon name="plus" size={30} color="black" />
      </View>

      <List title="" data={productTable} element={element}></List>
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
