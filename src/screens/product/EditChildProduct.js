// Example of Image Picker in React Native
// https://aboutreact.com/example-of-image-picker-in-react-native/

// Import React

import React, {useState, useEffect, useCal} from 'react';
var FormData = require('form-data');
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

// Import Image Picker
// import ImagePicker from 'react-native-image-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import apis from '../../api/apis';

const EditChildProduct = ({route,navigation}) => {
  const data = JSON.parse(route.params?.data);
  const [images, setImages] = useState({uri: "123", name: 'SomeImageName.jpg', type: 'image/jpg'});
  const [token, setToken] = useState('');
 
  data[1] = data[1]['props']['source']['uri'];
  console.log(data[1])
  //For product name, brand, price and discount price
  const [productID, setProductID] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [productStock, setProductStock] = useState(0);
  const [productColor, setProductColor] = useState(0);
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    setToken(token_temp);
  }
  useEffect(() => {
    const controller = new AbortController();
    fetchData()
    
    setImages({uri: data[1], name: 'SomeImageName.jpg', type: 'image/jpg'});
    setProductID(data[0]);
    setProductPrice(data[3]);
    setProductDiscount(data[4]);
    setProductStock(data[5]);
    setProductColor(data[2]);

    return () => controller.abort();
  }, [route.params?.data]);

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      let ImageInformation = [];
      if (response.didCancel) {
        alert('User cancelled image picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      } else {
        ImageInformation = response['assets'][0];
      }

      // console.log('uri -> ', ImageInformation.uri);
      // console.log('width -> ', ImageInformation.width);
      // console.log('height -> ', ImageInformation.height);
      // console.log('fileSize -> ', ImageInformation.fileSize);
      // console.log('type -> ', ImageInformation.type);
      // console.log('fileName -> ', ImageInformation.fileName);
      setImages({
        uri: ImageInformation.uri,
        name: ImageInformation.fileName,
        type: ImageInformation.type,
      });
    });
  };
  const Update = async () => {
    //console.log("Upload image:" ,images)
    console.log('save');
    console.log("update: ",images)
    const formData = new FormData();
    formData.append('product_images', images);
    formData.append('product_detail_id', productID);
    formData.append('product_stock', productStock);
    formData.append('product_color', productColor);
    formData.append('product_price', productPrice);
    formData.append('product_price_discounted', productDiscount);
    console.log(formData)
    await apis.UpdateChildProduct(formData, token);
    navigation.navigate('ProductDetail',{"product_id":productID})
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          <View
            style={{
              display: 'flex',
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={{uri: images.uri}} style={styles.imageStyle} />
            {/* <Image source={{uri: images}} style={styles.imageStyle} /> */}

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={() => chooseFile('photo')}>
              <Text style={styles.textStyle}>Choose Image</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <View width="50%">
              <Text>Color</Text>
              <TextInput
                style={styles.TextInput}
                width="98%"
                placeholderTextColor="#BDBDBD"
                value={productColor}
                onChangeText={e => setProductColor(e)}
              />
            </View>
            <View width="50%">
              <Text>Stock</Text>
              <TextInput
                style={styles.TextInput}
                width="98%"
                placeholderTextColor="#BDBDBD"
                value={productStock.toString()}
                onChangeText={e => setProductStock(e)}
              />
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <View width="50%">
              <Text>Price</Text>
              <TextInput
                style={styles.TextInput}
                width="98%"
                placeholderTextColor="#BDBDBD"
                value={productPrice.toString()}
                onChangeText={e => setProductPrice(e)}
              />
            </View>
            <View width="50%">
              <Text>Discount Price</Text>
              <TextInput
                style={styles.TextInput}
                width="98%"
                placeholderTextColor="#BDBDBD"
                value={productDiscount.toString()}
                onChangeText={e => setProductDiscount(e)}
              />
            </View>
          </View>

          <View>
            <Button title="Save" size={50} onPress={() => Update()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditChildProduct;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: '50%',
    height: 200,
    margin: 5,
  },
  TextInput: {
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    width: '100%',
  },
  textAreaContainer: {
    borderColor: '#E8E8E8',
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
});
