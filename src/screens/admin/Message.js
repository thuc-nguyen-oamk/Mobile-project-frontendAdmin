import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'base-64';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import apis from '../../api/apis';
import Card from '../../components/Card';

export default function Message({navigation, setNewMessageBadge}) {
  const [customerList, _setCustomerList] = useState([]);
  // Save the customerList so that it can be used in the FlatList
  const customerListRef = useRef(customerList);

  // Save the customerList state's value to customerListRef also when setState
  const setCustomerList = data => {
    customerListRef.current = data;
    _setCustomerList(data);
  };

  let token;
  let messageLastSeenTimestamps = [];

  AsyncStorage.getItem('messageLastSeenTimestamps', (err, result) => {
    if (err) {
      console.error(err);
    } else {
      if (result == null) {
        messageLastSeenTimestamps = [];
      } else {
        messageLastSeenTimestamps = JSON.parse(result);
      }
    }
  });

  const handleCustomerList = (token, newMessage) => {
    const customer_id = newMessage.room;
    const foundIndex = customerListRef.current.findIndex(
      item => item.customer_id == customer_id,
    );
    const customerList = customerListRef.current;

    let customerName;

    async function setCustomerName() {
      // Get the customer name from the backend
      await apis.GetACustomer(token, customer_id).then(response => {
        customerName = response.userList[0].customer_name;
      });
    }

    setCustomerName();

    // If the customer is not in the list, add it
    if (foundIndex == -1) {
      const newCustomer = {
        customer_id: newMessage.room,
        customer_name: customerName,
        last_message: newMessage.message_text,
        last_message_created_at: Date.now(),
      };
      customerList.push(newCustomer);
    } else {
      // If the customer is in the list, update the last message and last_message_created_at of it
      customerList[foundIndex].last_message = newMessage.message_text;
      customerList[foundIndex].last_message_created_at = Date.now();
    }

    setCustomerList(customerList);
  };

  useEffect(() => {
    async function fetchCustomerList() {
      token = await AsyncStorage.getItem('token');
      token = token.replace(/"/g, '');
      await apis.GetCustomerWithLastMessageList(token).then(response => {
        setCustomerList(response);
      });
    }

    fetchCustomerList();

    global.socket.on('notifications: admin new message', newMessage => {
      handleCustomerList(token, newMessage);
    });
  }, []);

  useEffect(() => {
    // Register the listener for the onFocus event of the Message screen
    const unsubscribe = navigation.addListener('focus', () => {
      setNewMessageBadge(null);

      AsyncStorage.getItem('token', (err, result) => {
        if (err) {
          console.error(err);
          return;
        }

        // Token not found
        if (!result) {
          alert('Please login first.');
          return;
        }

        // Forgot to call JSON.parse on AsyncStorage.getItem may lead to redundant double quotes
        const token = result.replace(/"/g, '');
        const admin = JSON.parse(decode(token.split('.')[1]));

        if (!admin || !admin.admin_id) {
          alert('Please login first.');
          return;
        }
      });
    });

    // Unregister the listener when the Message screen is unmounted
    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <FlatList
        data={customerList}
        // extraData={triggerFlatlistRerender}
        numColumns={1}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.wrap}
            key={index}
            onPress={() =>
              navigation.navigate('Conversation', {
                customer_id: item.customer_id,
                customer_name: item.customer_name,
              })
            }>
            <Card style={styles.card}>
              <View style={styles.col1}>
                <Icon name="user-circle" size={40}></Icon>
                <Text>{item.customer_name}</Text>
              </View>
              <View style={styles.col2}>
                <Text>
                  {item.last_message}
                  {'  -  '}
                  {new Date(item.last_message_created_at).toLocaleTimeString()}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.customer_id}
        contentContainerStyle={styles.container1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  container1: {
    paddingHorizontal: 8,
  },
  card: {
    paddingLeft: 10,
    paddingRight: 20,
    height: 80,
    flexDirection: 'row',
  },
  row: {
    padding: 10,
  },
  col1: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  col2: {
    padding: 10,
    paddingRight: 20,
    // marginRight: 10,
    justifyContent: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  normal: {
    fontWeight: '400',
  },
});
