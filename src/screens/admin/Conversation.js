import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'base-64';
import React, {useEffect, useState, useRef} from 'react';
import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';

export default function Conversation({route, navigation}) {
  const [messageText, setMessageText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const customerId = route.params.customer_id;
  const customerName = route.params.customer_name;
  const [adminId, setAdminId] = useState('');

  const flatListRef = useRef(null);

  AsyncStorage.getItem('messageLastSeenTimestamps', (err, result) => {
    if (err) {
      console.error(err);
    } else {
      let messageLastSeenTimestamps;

      if (result == null) {
        messageLastSeenTimestamps = [];
      } else {
        messageLastSeenTimestamps = JSON.parse(result);
        const currentIndex = messageLastSeenTimestamps.findIndex(
          item => item.customer_id == customerId,
        );
        if (currentIndex > -1) {
          messageLastSeenTimestamps.splice(currentIndex, 1);
        }
      }

      messageLastSeenTimestamps.push({
        customer_id: customerId,
        lastSeen: Date.now(),
      });

      AsyncStorage.setItem(
        'messageLastSeenTimestamps',
        JSON.stringify(messageLastSeenTimestamps),
      );
    }
  });

  useEffect(() => {
    async function setupSocketIO() {
      let token = await AsyncStorage.getItem('token');
      // Forgot to call JSON.parse on AsyncStorage.getItem may lead to redundant double quotes
      token = token.replace(/"/g, '');

      if (!token) {
        alert('Unauthorized.');
        return;
      }

      // Decode the token
      const admin = JSON.parse(decode(token.split('.')[1]));

      // The token is in invalid format or it does not contain admin_id
      if (!admin || !admin.admin_id) {
        alert('Unauthorized.');
        return;
      }

      setAdminId(admin.admin_id);
      global.socket.emit('chat: admin join', {token, customer_id: customerId});

      global.socket.on('chat: force disconnect', data => {
        alert(data.msg);
      });

      global.socket.on('chat: join', data => {
        setMessageList(data.messageList);
      });

      global.socket.on('chat: message', newMessage => {
        setMessageList(prevState => [...prevState, newMessage]);
      });
    }

    setupSocketIO();
  }, []);

  function sendMessage() {
    global.socket.emit('chat: message', {
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
          <Text style={styles.title}>{customerName}'s Conversation</Text>
        </View>
        <FlatList
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd()}
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
