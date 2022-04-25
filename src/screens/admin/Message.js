import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import apis from '../../api/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../components/Card';
import Icon from 'react-native-vector-icons/FontAwesome';
import {decode} from 'base-64';

export default function Message({navigation, setNewMessageBadge}) {
  const [customerList, setCustomerList] = useState([]);
  let token;
  console.log("Message comp render nà:" );
  async function fetchCustomerList() {
    token = await AsyncStorage.getItem('token');
    token = token.replace(/"/g, '');
    await apis.GetCustomerWithLastMessageList(token).then(response => {
      console.log('GetCustomerList response:', response);
      setCustomerList(response);
    });
  }

  fetchCustomerList();

  // AsyncStorage.removeItem('messageLastSeenTimestamps')

  AsyncStorage.getItem('messageLastSeenTimestamps', (err, result) => {
    if (err) {
      console.error(err);
    } else {
      let messageLastSeenTimestamps;
      if (result == null) {
        messageLastSeenTimestamps = [];
      } else {
        messageLastSeenTimestamps = JSON.parse(result);
      }
    }
  });

  useEffect(() => {
    async function fetchCustomerList() {
      token = await AsyncStorage.getItem('token');
      token = token.replace(/"/g, '');
      await apis.GetCustomerWithLastMessageList(token).then(response => {
        console.log('GetCustomerList response:', response);
        setCustomerList(response);
      });
    }

    fetchCustomerList();

    global.socket.on('chat: message', newMessage => {
      console.log("Message comp - newMessage:", newMessage);
      const customer_id = newMessage.room
      const c = customerList.find(item => item.customer_id == customer_id)
      console.log("c:", c);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNewMessageBadge(null);

      AsyncStorage.getItem('token', (err, result) => {
        if (err) {
          console.error(err);
          return;
        }

        if (!result) {
          alert('Please login first.');
          return;
        }

        const token = result.replace(/"/g, '');
        const admin = JSON.parse(decode(token.split('.')[1]));

        if (!admin || !admin.admin_id) {
          alert('Please login first.');
          return;
        }

        console.log('token:', token);

        // global.socket.emit('chat: admin join', {token});
      });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <FlatList
        data={customerList}
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
                  {item.last_message} -{' '}
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
    fontWeight: 'bold',
  },
});
