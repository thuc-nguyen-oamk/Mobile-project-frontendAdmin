import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'base-64';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';

export default function Conversation({route, navigation}) {
  const [messageText, setMessageText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const customerId = route.params.customer_id;
  const [adminId, setAdminId] = useState('7252643');

  useEffect(() => {
    async function setupSocketIO() {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Unauthorized.');
        return;
      }
      const admin = JSON.parse(decode(token.split(".")[1]));
      if (!admin || !admin.admin_id) {
        alert('Unauthorized.');
        return;
      }
      setAdminId(admin.admin_id)
      // apis then set adin id
      global.socket = io('https://api.uniproject.xyz/', {
        path: '/eshopmb/socket.io/',
      });

      global.socket.on('connect', () => {
        global.socket.emit('admin join', {token, customer_id: customerId});
      });

      global.socket.on('force disconnect', data => {
        alert(data.msg);
      });

      global.socket.on('join', data => {
        setMessageList(data.messageList);
      });

      global.socket.on('message', newMessage => {
        setMessageList(prevState => [...prevState, newMessage]);
      });
    }

    setupSocketIO();
  }, []);

  function sendMessage() {
    global.socket.emit('message', {
      message_text: messageText,
      sender_id: adminId,
      receiver_id: customerId,
      room: customerId,
    });
    setMessageText('');
  }

  const MessageItem = ({item}) => {
    return (
      <View>
        <Text
          style={
            item.sender_id == customerId
              ? [styles.shadow, styles.incoming]
              : [styles.shadow, styles.outgoing]
          }>
          {item.message_text}
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Contact Store</Text>
        </View>
        <FlatList
          data={messageList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={MessageItem}
        />
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            placeholder="Message here..."
            placeholderTextColor="#BDBDBD"
            value={messageText}
            onChangeText={setMessageText}
            onSubmitEditing={sendMessage}
          />
          <Icon
            name="arrow-up-circle"
            size={40}
            color="#F9ABF9"
            onPress={() => sendMessage()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  content: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 25,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
  textInput: {
    width: '70%',
  },
  incoming: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6F6F6',
    marginLeft: 10,
    marginBottom: 10,
    padding: 10,
  },
  outgoing: {
    alignSelf: 'flex-end',
    backgroundColor: '#f9abf9',
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
});
