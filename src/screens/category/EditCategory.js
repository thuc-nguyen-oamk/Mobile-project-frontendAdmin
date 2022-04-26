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

const EditCategory = ({route,navigation}) => {
  const data = JSON.parse(route.params?.data);
  const [images, setImages] = useState({});
  const [token, setToken] = useState('');

  data[1] = data[1]['props']['source']['uri'];
  
  //For product name, brand, price and discount price
  const [categoryID, setCategoryID] = useState('');
  const [categoryName, setCategoryName] = useState('');
  async function fetchData() {
    var token_temp = await AsyncStorage.getItem('token');
    token_temp = token_temp.replace(/"/g, '');
    setToken(token_temp);
  
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchData();
    return () => controller.abort();
  }, [route.params?.data]);
  useEffect(() => {
    const controller = new AbortController();
    setImages({uri: data[1], name: 'SomeImageName.jpg', type: 'image/jpg'});
    setCategoryID(data[0]);
    setCategoryName(data[2]);

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
    formData.append('category_image', images);
    formData.append('category_id', categoryID);
    formData.append('category_name', categoryName);

   console.log(formData)
     await apis.updateCategory(formData, token);
   navigation.navigate('Category',{signal:0})

    // setImages({uri: data[1], name: 'SomeImageName.jpg', type: 'image/jpg'});
    // setCategoryID('')
    // setCategoryName('');
    // setProductBrand('');
    // setProductPrice(0);
    // setProductDiscount(0);
    // setProductDescription('');



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
          <View style={{marginBottom:15}}>
            <Text>Category </Text>
            <TextInput
              style={styles.TextInput}
              placeholderTextColor="#BDBDBD"
              // value={data[2]}
              value={categoryName}
              onChangeText={e => setCategoryName(e)}
            />
           
          </View>
       
            <Button title="Save" size={50} onPress={() => Update()} />
        
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCategory;

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
