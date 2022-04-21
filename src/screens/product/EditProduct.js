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

const EditProduct = ({route,navigation}) => {
  const data = JSON.parse(route.params?.data);
  const [images, setImages] = useState({});
  const [token, setToken] = useState('');
  const [categoryList, setCategoryList] = useState({});
  data[1] = data[1]['props']['source']['uri'];
  //For category chosen
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState([]);
  //For product name, brand, price and discount price
  const [productID, setProductID] = useState('');
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [productDescription, setProductDescription] = useState('');
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    setToken(token_temp);

    var category_list = await apis.GetCategory(token_temp);
    var items1 = [];

    for (var i in category_list) {
      items1.push({
        label: category_list[i]['category_name'],
        value: category_list[i]['category_id'],
      });
    }

    setItems(items1);
    setCategoryList(category_list);
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchData();
    return () => controller.abort();
  }, [route.params?.data]);
  useEffect(() => {
    const controller = new AbortController();
    console.log(data[1])
    setImages({uri: data[1], name: 'SomeImageName.jpg', type: 'image/jpg'});
    setProductID(data[0]);
    setProductName(data[2]);
    setProductBrand(data[3]);
    setProductPrice(data[4]);
    setProductDiscount(data[5]);
    setProductDescription(data[7]);

    setValue(data[11]);
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
        setImages({
          uri: ImageInformation.uri,
          name: ImageInformation.fileName,
          type: ImageInformation.type,
        });
      }

      // console.log('uri -> ', ImageInformation.uri);
      // console.log('width -> ', ImageInformation.width);
      // console.log('height -> ', ImageInformation.height);
      // console.log('fileSize -> ', ImageInformation.fileSize);
      // console.log('type -> ', ImageInformation.type);
      // console.log('fileName -> ', ImageInformation.fileName);
     
    });
  };
  const Update = async () => {
    //console.log("Upload image:" ,images)
    console.log("update: ",images)
    console.log('save');
    const formData = new FormData();
    formData.append('myImage', images);
    formData.append('product_id', productID);
    formData.append('product_name', productName);
    formData.append('product_description', productDescription);
    formData.append('category_id', value);
    formData.append('product_brand', productBrand);
    formData.append('display_price', productPrice);
    formData.append('display_price_discounted', productDiscount);

    console.log(formData);
    await apis.UpdateProduct(formData, token);
    navigation.navigate('ProductDetail',{"product_id":productID})

    setImages({uri: data[1], name: 'SomeImageName.jpg', type: 'image/jpg'});
    setProductID('')
    setProductName('');
    setProductBrand('');
    setProductPrice(0);
    setProductDiscount(0);
    setProductDescription('');



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
          <View>
            <Text>Product </Text>
            <TextInput
              style={styles.TextInput}
              placeholderTextColor="#BDBDBD"
              // value={data[2]}
              value={productName}
              onChangeText={e => setProductName(e)}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              <View width="50%">
                <Text>Category</Text>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  listMode="SCROLLVIEW"
                />
              </View>
              <View width="50%">
                <Text>Brand</Text>
                <TextInput
                  style={styles.TextInput}
                  width="98%"
                  placeholderTextColor="#BDBDBD"
                  value={productBrand}
                  onChangeText={e => setProductBrand(e)}
                />
              </View>
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
                value={productPrice? productPrice.toString() : ""}
                onChangeText={e => setProductPrice(e)}
              />
            </View>
            <View width="50%">
              <Text>Discount Price</Text>
              <TextInput
                style={styles.TextInput}
                width="98%"
                placeholderTextColor="#BDBDBD"
                value={productDiscount ? productDiscount.toString() : ""}
                onChangeText={e => setProductDiscount(e)}
              />
            </View>
          </View>
          <View>
            <Text>Description</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Type something"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                value={productDescription}
                onChangeText={e => setProductDescription(e)}
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

export default EditProduct;

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
