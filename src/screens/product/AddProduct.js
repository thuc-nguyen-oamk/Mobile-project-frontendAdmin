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

const AddProduct = ({navigation}) => {

  const [token, setToken] = useState('');
  const [categoryList, setCategoryList] = useState({});

  //For category chosen
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const [items, setItems] = useState([]);
  //For product name, brand, price and discount price
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productDescription, setProductDescription] = useState('');

  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    setToken(token_temp);
    var items1 = [];
   
    var category_list = await apis.GetCategory(token_temp);

    for (var i in category_list) {
      items1.push({
        label: category_list[i]['category_name'],
        value: category_list[i]['category_id'],
      });
    }
    setItems(items1);
    setCategoryList(category_list);
    console.log("Run")
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchData();


    return () => controller.abort();
  }, []);
  // useEffect(() => {
  //   const controller = new AbortController();

   

    
   
  //   return () => controller.abort();
  // }, []);

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
    // const formData = new FormData();
    // formData.append('product_name', productName);
    // formData.append('category_id', value);
    // formData.append('product_description', productDescription);
    
    // formData.append('product_brand', productBrand);
    // console.log(formData)
    const payload ={
      category_id: value,
      product_name:productName,
      product_description: productDescription,
      product_brand: productBrand
    }
    await apis.AddProduct(payload, token);
    navigation.navigate("Product")
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.container}>
          {/* <View
            style={{
              display: 'flex',
              margin: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={{uri: images.uri}} style={styles.imageStyle} />

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.buttonStyle}
              onPress={() => chooseFile('photo')}>
              <Text style={styles.textStyle}>Choose Image</Text>
            </TouchableOpacity>
          </View> */}
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
          {/* <View
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
          </View> */}
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

export default AddProduct;

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
