import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import apis from '../../api/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../../components/Card';

export default function Message({navigation}) {
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    async function fetchCustomerList() {
      let token = await AsyncStorage.getItem('token');
      token = token.replace(/"/g, '');

      await apis.GetCustomerList(token).then(response => {
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
          <View style={styles.wrap} key={index}>
            <Card style={styles.card}>
              <Text
                onPress={() =>
                  navigation.navigate('Conversation', {
                    customer_id: item.customer_id,
                    customer_name: item.customer_name,
                  })
                }>
                {item.customer_name}
              </Text>
            </Card>
          </View>
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
    paddingLeft: 20,
    height: 80,
    justifyContent: 'center',
    width: '50%',
  },
});
