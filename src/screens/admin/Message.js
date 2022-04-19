import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import apis from '../../api/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../components/Card';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Message({navigation}) {
  const [customerList, setCustomerList] = useState([]);
  let token;

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
  }, []);

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
