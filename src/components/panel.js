import React from 'react'
import {StyleSheet,View,Text} from "react-native"
export default function Pannel(props) {
  return (
   <View style={styles.container}>
       <Text style={styles.title}>{props.title}</Text>
       <Text>{props.number}</Text>
    </View>

  )
}


const styles = StyleSheet.create({
    container:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"grey",
        height:150,
        width:150,
        marginBottom: 50
    },
    title: {
        fontSize:20,
        fontWeight:"bold",
        marginBottom:5,
        color:"black"
    }

})