import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import List from '../../components/list';
import Pannel from '../../components/panel';
import Icon from 'react-native-vector-icons/FontAwesome';



export default function AdminPage({navigation}) {
  const Logout = async () => {
    await AsyncStorage.removeItem('token');
    console.log('Log out');
    navigation.navigate('Login');
  };

  const productTable = {
    head: ['ID', 'Product', 'Category', 'Quantity sold'],
    data: [
      ['1', '232', '3', '4'],
      ['1', '2', '3', '4'],
      ['1', '2', '3', '4'],
      ['1', '2', '3', '4'],
    ],
    width: [50, 150, 150, 100],
  };

  const orderTable = {
    head: ['ID', 'ID Customer', 'Address', 'Amount', 'Created at'],
    data: [
      ['1', '23sadsadsa2', '3', '4', '10'],
      ['1', '2', '3', '4', '10'],
      ['1', '2', '3', '4', '10'],
      ['1', '2', '3', '4', '10'],
    ],
    width: [40, 100, 150, 100, 100],
  };
  //console.log(productTable.head)
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          <Icon name="user" size={150} color="black" />

          <View style={styles.rightHeader}>
            <Text style={styles.title}>Welcome Admin</Text>
            <View style={styles.buttongroup}>
              <Button title="Change password" onPress={() =>  navigation.navigate('Profile')} />
              <Button
                title="Log out"
                onPress={() => {
                  Logout();
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.pannel}>
            <Pannel title="Pannel Name" number="1234556"></Pannel>
            <Pannel title="Pannel Name" number="1234556"></Pannel>
            <Pannel title="Pannel Name" number="1234556"></Pannel>
            <Pannel title="Pannel Name" number="1234556"></Pannel>
          </View>
          <View>
            <List
              title="List to show the most poluar products"
              data={productTable}></List>
            <List title="List of the recent orders" data={orderTable}></List>
          </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#F9ABF9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 150,
  },
  buttongroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  rightHeader: {
    width: '60%',
    display: 'flex',
    justifyContent: 'center',

    height: '100%',
  },
  content: {
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  pannel: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
