import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity,SafeAreaView,ScrollView} from 'react-native';
import List from '../../components/list';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Product() {
  const productTable = {
    head: ['ID','Image', 'Product','Brand' ,'Category', 'Rating','Stock','Price','Promotion'],
    data: [
      ['1', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['2', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['3', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['4', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['5', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['6', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['7', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['8', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['9', '2322', '3', '4','1', '2322', '3', '4',"123"],
      ['10', '2322', '3', '4','1', '2322', '3', '4',"123"],
   

    ],
    width: [50, 150, 150, 100,150, 150,150, 150,150],
  };
  return (
  <SafeAreaView>

    <View style={styles.head} >
    <Text style={styles.title}>List of Products</Text>
    <Icon name="plus" size={30} color="black" />
    </View>
   
    <ScrollView>
      <View>
       
      <List
              title=""
              data={productTable}></List>
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  
  title: { fontWeight:"bold", color:"black", fontSize:20 },
  head: {display:"flex", flexDirection:"row", justifyContent:"space-between", padding:20, paddingBottom:0}


});