import React,{useEffect,useState}from 'react'
import {StyleSheet,View,Text,ScrollView } from "react-native"
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
export default function List(props) {
    const productTable= props.data
    const [tableHead,setTableHead]=useState([])
    const [tableData,setTableData]=useState([])
    const [arrWidth,setArrWidth]=useState([])


  useEffect(() => {
    setTimeout(() => {
        setTableData(productTable['data'])
        setTableHead(productTable['head'])
        setArrWidth(productTable['width'])
        console.log("run")
    }, 1000);
  },[props]);




//   _alertIndex =(index) => {
//     Alert.alert(`This is row ${index + 1}`);
//   }
  const element = (data, index) => (
    <TouchableOpacity >
      <View style={styles.btn}>
        <Text style={styles.btnText}>button</Text>
      </View>
    </TouchableOpacity>
  );

  return (
      <View style={{marginBottom:20}} >
    <Text>{props.title}</Text>
    <ScrollView horizontal={true}>
    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}} >
    <Row data={tableHead} style={styles.head} widthArr={arrWidth} textStyle={styles.text}/>
         <Rows data={tableData} textStyle={styles.text} widthArr={arrWidth}/>
         
        </Table>
        </ScrollView>
        </View>
  )
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
    head: { height: 60, backgroundColor: '#f1f8ff'   },
    text: { textAlign: 'center',fontWeight:"bold",padding:15},


  });