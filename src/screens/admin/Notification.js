import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apis from '../../api/apis';
import List from '../../components/list';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function Notification({route, navigation}) {
  //Store original order list
  const [categoryList, setCategoryList] = useState([]);
  //Store token
  const [token, setToken] = useState('');
  //Get the first resource
  const [refresh, setRefresh] = useState( 0);
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    apis.CategoryList().then(response => {
      //get

      const list_temp = response;

      const array_temp = [];

      for (var i = 0; i < list_temp.length; i++) {
        array_temp.push(
          Array(
            list_temp[i]['category_id'],

            <Image
              style={{height: 200}}
              source={{
                uri: `https://api.uniproject.xyz/eshopmb/images/${list_temp[i]['category_image']}`,
              }}
            />,
            list_temp[i]['category_name'],
            'Category',
          ),
        );
      }

      setCategoryList(array_temp);
    });
    setToken(token_temp);
  }

  useEffect(() => {
    // const intervalCall = setInterval(() => {
    //   fetchData();
    // }, 5000);
    // return () => {
    //   // clean up
    //   clearInterval(intervalCall);
    // };

     
      console.log('Category fetch');
      navigation.addListener(
        'focus',
        payload => {
          fetchData();
        }
    );
   
  },[]);
  //Definite order table data to pass to Table
  const orderTable = {
    head: ['ID', 'Banner', 'Name', 'Action'],
    data: categoryList,
    width: [50, 150, 150, 150],
  };

  const element = (data, index) => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
      }}>
      {/* <Button title="Detail"size={24} onPress={() => navigation.navigate('ProductDetail',{"product_id":data[0]})} /> */}
      <Button
        title="Edit"
        size={24}
        onPress={() =>
          navigation.navigate('EditCategory', {data: JSON.stringify(data)})

        }
      />
    </View>
  );

  return (
    <>
      <View style={[styles.head]}>
        <Text style={styles.title}>List of Categories</Text>
        <Icon
          name="plus"
          size={30}
          color="black"
          onPress={() => {
            navigation.navigate('AddCategory');
          }}
        />
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
