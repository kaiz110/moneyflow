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

const DAY_FORMAT = 'YYYY-MM-DD'

const MyBezierLineChart = ({data}) => {
  return (
    <>
      <LineChart
        data={data}
        width={Dimensions.get('window').width} // from react-native
        height={250}
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
              translateX: 25,
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

function getChartData(data, type, from ,to) {
    const chartData = []

    const start = moment(from)
    const end = moment(to)

    const dateNumber = end.diff(start, 'days')
    const limit = dateNumber > 30 ? 30 : dateNumber

    for(let i = 0 ; i <= limit; i++) {
        const tempDay = end.clone().subtract(i,'days') // ex 22/22/2222
        const classify = data.filter(val => {
            return moment(val.time).format(DAY_FORMAT) == tempDay.format(DAY_FORMAT) && val.type == type
        }) // day array
        
        let daySum = 0 
        for(let j = 0 ; j < classify.length ; j++) daySum+=classify[j].amount //sum
            
        chartData.push(daySum)
    }

    return chartData
}

function getArrayDateRange(data, from, to) {
    const mod = date => moment(date).format(DAY_FORMAT)

    const arr = data.filter(val => {
        const d = mod(val.time)

        return moment(d).isSameOrAfter(mod(from)) && moment(d).isSameOrBefore(mod(to))
    })

    return arr
}

function getSum(data, type) {
    let sum = 0
    for(let i = 0 ; i < data.length ; i++){
        if(data[i].type === type) sum += data[i].amount
    }
    return sum
}

// MAIN
const InfoScreen = () => {
    const history = useSelector(state => state.history)
    const [ arrayLastWeek, setArrayLastWeek ] = useState([])
    const [ dateRange, setDateRange ] = useState([]) // from - to array
    const [ dateFrom, setDateFrom ] = useState(new Date())
    const [ showDateFrom, setShowDateFrom ] = useState(false)
    const [ showDateTo, setShowDateTo ] = useState(false)
    const [ dateTo, setDateTo ] = useState(new Date())
    const [ isOut, setIsOut ] = useState(false)

    useEffect(() => {
        if(history[0]) {
            const daySumArray = getChartData(history,isOut?'OUT':'IN', dateFrom, dateTo)
            setArrayLastWeek(daySumArray.reverse())
        }

        const data = getArrayDateRange(history, dateFrom, dateTo)
        setDateRange( data )
    },[history, dateFrom, dateTo, isOut])

    const renderCard = ({item}) => {
        return <View style={styles.cardContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between',margin: 5}}>
                {item.type === 'OUT' 
                ? <AntDesign name='caretup' size={17} style={{color: 'red', marginHorizontal: 5}}/>
                : <AntDesign name='caretdown' size={17} style={{color: 'green', marginHorizontal: 5}}/>
                }

                <Text h4 style={{marginHorizontal: 5}}>{item.amount}</Text>
                <Text style={{marginLeft: 25, marginRight: 5}}>{moment(item.time).format('DD/MM/YYYY HH:mm')}</Text>
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
        const lm = moment(dateTo).diff(moment(dateFrom), 'days') > 30
        const disF = 'DD-MM-YYYY'
        return <View style={styles.container}>
            <Text>Biểu đồ hoạt động (tối đa 30 ngày)</Text>
            <MyBezierLineChart 
                data={{
                    labels: [
                        lm ? moment(dateTo).clone().subtract(30, 'days').format(disF) : moment(dateFrom).format(disF),
                        '', 
                        moment(dateTo).format(disF)],
                    datasets: [
                    {
                        data: arrayLastWeek.length ? arrayLastWeek : [0,0,0,0,0,0,0],
                    },
                    ],
                }}
            />

            <Divider style={{backgroundColor: 'lightgray', height: 1, width: '90%'}}/>

            {/*switch type button */}
            <TouchableOpacity 
            onPress={() => setIsOut(!isOut)}
            style={{flexDirection: 'row',padding: 2,borderWidth:1,alignSelf: 'flex-end'}}>
                <AntDesign name='caretup' size={22} color={isOut ? 'red' : 'gray'}/>
                <AntDesign name='caretdown' size={22} color={isOut ? 'gray' : 'green'}/>
            </TouchableOpacity>

            <Text style={{fontSize: 20}}>Tổng tiền đã {isOut ? 'chi' : 'thu'}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly',width: '100%'}}>
                <Text style={{fontSize: 50, color: isOut?'red':'green', marginVertical: 10}}>{getSum(dateRange, isOut?'OUT':'IN')}</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-around',width: '100%'}}>
                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <Text style={{marginHorizontal: 5}}>From</Text>

                    <TouchableOpacity onPress={() => setShowDateFrom(true)} style={{borderWidth: 1,padding: 5}}>
                        <Text>{moment(dateFrom).format('DD/MM/YYYY')}</Text>
                    </TouchableOpacity>
                </View>


                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                    <Text style={{marginHorizontal: 5}}>To</Text>

                    <TouchableOpacity onPress={() => setShowDateTo(true)} style={{borderWidth: 1,padding: 5}}>
                        <Text>{moment(dateTo).format('DD/MM/YYYY')}</Text>
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
