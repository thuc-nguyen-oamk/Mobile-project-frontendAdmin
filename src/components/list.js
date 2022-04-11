import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';
export default function List(props) {
  const productTable = props.data;
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [arrWidth, setArrWidth] = useState([]);

  //for update order status

  useEffect(() => {
    let isMounted = true;

    setTableData(productTable['data']);
    setTableHead(productTable['head']);
    setArrWidth(productTable['width']);
    return () => {
      isMounted = false;
    };
  }, [props]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Text>{props.title}</Text>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              data={tableHead}
              widthArr={arrWidth}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {tableData.map((rowData, index) => (
                // <Row
                //   key={index}
                //   data={rowData}
                //   widthArr={arrWidth}
                //   style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                //   textStyle={styles.text}

                // />
                <TableWrapper
                  key={index}
                  style={[
                    styles.row,
                    index % 2 && {backgroundColor: '#F7F6E7'},
                  ]}>
                  {rowData.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={
                        cellData === 'Order'
                          ? props.element(rowData, index)
                          : cellData === 'Product'
                          ? props.element(rowData, index)
                          : cellData ==="ProductDetail" ?  props.element(rowData, index) :cellData
                      }
                      width={arrWidth[cellIndex]}
                      textStyle={styles.text}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#808B97'},
  text: {margin: 6, textAlign: 'center'},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  //btn: { width: 100, height: 30, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: {textAlign: 'center', color: '#fff'},
});
