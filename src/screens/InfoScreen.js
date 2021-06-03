import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, StyleSheet, Dimensions,
  ScrollView, FlatList, TouchableOpacity, Platform
} from 'react-native';
import { Divider, Text, Chip } from 'react-native-elements'
import { LineChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux'
import moment from 'moment'
import { AntDesign } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

const MyBezierLineChart = ({data}) => {
  return (
    <>
      <LineChart
        data={data}
        width={Dimensions.get('window').width} // from react-native
        height={250}
        verticalLabelRotation={50}
        
        xLabelsOffset={-20}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForVerticalLabels: {
              opacity: 0.5,
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </>
  );
};

function getChartData(data) {
    const daysArray = []
    const daySumArray = []
    const f = 'DD/MM/YY'

    for(let i = 0 ; i < 7 ; i++) {
        const tempDay = moment(data[data.length - 1].time).subtract(i,'days') // ex 22/22/2222
        const classify = data.filter(val => {
            return moment(val.time).format(f) == tempDay.format(f) && val.type == 'OUT'
        }) // day array
        
        let daySum = 0 
        for(let j = 0 ; j < classify.length ; j++) daySum+=classify[j].amount //sum
            
        daySumArray.push(daySum)
        daysArray.push(tempDay.format(f))
    }
    return {daysArray,daySumArray}
}

function getArrayDateRange(data, from, to) {
    // from,to == YYYY-MM-DD
    const arr = data.filter(val => {
        const d = moment(val.time).format('YYYY-MM-DD')

        return moment(d).isSameOrAfter(from) && moment(d).isSameOrBefore(to)
    })

    return arr
}

// MAIN
const InfoScreen = () => {
    const history = useSelector(state => state.history)
    const [ arrayLastWeek, setArrayLastWeek ] = useState([])
    const [ listDays, setListDays ] = useState([])
    const [ dateRange, setDateRange ] = useState([]) // from - to array
    const [ dateFrom, setDateFrom ] = useState(new Date())
    const [ showDateFrom, setShowDateFrom ] = useState(false)
    const [ showDateTo, setShowDateTo ] = useState(false)
    const [ dateTo, setDateTo ] = useState(new Date())

    useEffect(() => {
        if(history[0]) {
            const { daysArray, daySumArray } = getChartData(history)
            setListDays(daysArray.reverse())
            setArrayLastWeek(daySumArray.reverse())
        }
    },[history])

    useEffect(() => {
        const mod = date => moment(date).format('YYYY-MM-DD')
        const data = getArrayDateRange(history, mod(dateFrom), mod(dateTo))
        setDateRange( data )
    },[history, dateFrom, dateTo])

    const renderCard = ({item}) => {
        return <View style={styles.cardContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between',margin: 5}}>
                {item.type === 'OUT' 
                ? <AntDesign name='caretup' size={17} style={{color: 'red', marginHorizontal: 5}}/>
                : <AntDesign name='caretdown' size={17} style={{color: 'green', marginHorizontal: 5}}/>
                }

                <Text h4 style={{marginHorizontal: 5}}>{item.amount}</Text>
                <Text style={{marginLeft: 25, marginRight: 5}}>{moment(item.time).format('DD/MM/YYYY HH:MM')}</Text>
            </View>

            {item.note !== '' &&
                <View style={styles.cardTag}>
                    <Text style={{marginHorizontal: 5}}>Note:</Text>
                    <Text style={{margin: 5}}>{item.note}</Text>
                </View>
            }

            {item.tag.length != false &&
                <View style={styles.cardTag}>
                    <Text style={{marginHorizontal: 5}}>Tag:</Text>
                    <FlatList
                        data={item.tag}
                        horizontal
                        keyExtractor={(data,i) => data+i}
                        contentContainerStyle={{marginHorizontal: 5}}
                        renderItem={({item}) => {
                            return <Chip title={item} type='solid'/>
                        }}
                    />
                </View>
            }

        </View>
    }

    const componentHeader = () => {
        return <View style={styles.container}>
            <MyBezierLineChart 
                data={{
                    labels: listDays,
                    datasets: [
                    {
                        data: arrayLastWeek.length ? arrayLastWeek : [0,0,0,0,0,0,0],
                    },
                    ],
                }}
            />

            <Divider style={{backgroundColor: 'lightgray', height: 1, width: '90%'}}/>

            <View>
                <Text style={{fontSize: 50, color: 'green', marginVertical: 10}}>10.000</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 25}}>
                    <Text>From:</Text>

                    <TouchableOpacity onPress={() => setShowDateFrom(true)} style={{borderWidth: 1}}>
                        <Text>{moment(dateFrom).format('DD MM YYYY')}</Text>
                    </TouchableOpacity>
                </View>


                <View>
                    <Text>To:</Text>

                    <TouchableOpacity onPress={() => setShowDateTo(true)} style={{borderWidth: 1}}>
                        <Text>{moment(dateTo).format('DD MM YYYY')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showDateFrom &&
            <DateTimePicker
                mode='date'
                display='default'
                maximumDate={dateTo}
                value={dateFrom}
                onChange={(e,selected) => {
                    setShowDateFrom(Platform.OS === 'ios')
                    setDateFrom(selected || dateFrom)
                }}
            />
            }

            {showDateTo &&
            <DateTimePicker
                mode='date'
                display='default'
                minimumDate={dateFrom}
                value={dateTo}
                onChange={(e,selected) => {
                    setShowDateTo(Platform.OS === 'ios')
                    setDateTo(selected || dateTo)
                }}
            />
            }
        </View>
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View>
                <FlatList
                    ListFooterComponent={componentHeader}
                    inverted
                    data={dateRange}
                    keyExtractor={(data,i) => data.time + i}
                    renderItem={renderCard}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  cardContainer: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: 'grey',
      padding: 5,
      margin: 5,
      marginHorizontal: 15
  },
  cardTag: {
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: 'lightgrey',
    borderRadius: 25,
    alignItems: 'center',
    padding:5,
    marginVertical: 2
  }
});

export default InfoScreen;
