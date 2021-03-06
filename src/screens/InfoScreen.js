import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  SafeAreaView, View, StyleSheet, Dimensions,
  FlatList, TouchableOpacity, Platform
} from 'react-native';
import { Divider, Text, Chip } from 'react-native-elements'
import { LineChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'
import NumberFormat from 'react-number-format';

const DAY_FORMAT = 'YYYY-MM-DD'

const SCREEN_HEIGHT = Dimensions.get('window').height

const MyBezierLineChart = ({data}) => {
  return (
    <>
      <LineChart
        data={data}
        width={Dimensions.get('window').width} // from react-native
        height={250}
        chartConfig={{
          backgroundColor: '#444',
          backgroundGradientFrom: '#e0e8ff',
          backgroundGradientTo: '#eff3ff',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForVerticalLabels: {
              translateX: 25,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "1",
            stroke: "#fff"
          }
        }}
        bezier
        style={{
          borderRadius: 16,
          margin : 5
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
        const tempDay = end.clone().subtract(i,'days') 
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
const InfoScreen = ({navigation}) => {
    const history = useSelector(state => state.history)
    const [ arrayChartData, setArrayChartData ] = useState([])
    const [ dateRange, setDateRange ] = useState([]) 
    const [ dateFrom, setDateFrom ] = useState(new Date())
    const [ dateTo, setDateTo ] = useState(new Date())
    const [ showDateFrom, setShowDateFrom ] = useState(false)
    const [ showDateTo, setShowDateTo ] = useState(false)
    const [ isOut, setIsOut ] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{padding: 10}} onPress={() => navigation.navigate('SettingScreen')}>
                    <AntDesign name='setting' size={25}/>
                </TouchableOpacity>
            )
        })
    },[navigation])

    useEffect(() => {
        if(history[0]) {
            const daySumArray = getChartData( history, isOut?'OUT':'IN' , dateFrom , dateTo )
            setArrayChartData(daySumArray.reverse())
        }

        const data = getArrayDateRange( history , dateFrom , dateTo )
        setDateRange( data )
    },[ history, dateFrom, dateTo, isOut])

    const renderCard = ({item}) => {
        const tag = item.tag?.length || false

        return <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                {item.type === 'OUT' 
                ? <AntDesign name='caretup' size={17} style={{color: 'red',...styles.mH}}/>
                : <AntDesign name='caretdown' size={17} style={{color: 'green',...styles.mH}}/>
                }

                <NumberFormat 
                    value={item.amount} 
                    displayType='text'
                    thousandSeparator={true}
                    renderText={value => (
                        <Text h4 style={styles.mH}>{value}</Text>
                    )}
                />

                <Text style={{marginLeft: 25, marginRight: 5}}>
                    {moment(item.time).format('DD/MM/YYYY HH:mm')}
                </Text>
            </View>

            {item.note !== '' &&
                <View style={styles.cardTag}>
                    <Text style={styles.mH}>Note:</Text>
                    <Text style={{margin: 5}}>{item.note}</Text>
                </View>
            }

            {tag != false &&
                <View style={styles.cardTag}>
                    <Text style={styles.mH}>Tag:</Text>
                    <FlatList
                        data={item.tag}
                        horizontal
                        keyExtractor={(data,i) => data+i}
                        contentContainerStyle={styles.mH}
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
        const disF = 'DD/MM/YYYY'
        return <View style={styles.container}>
            <MyBezierLineChart 
                data={{
                    labels: [
                        lm ? moment(dateTo).clone().subtract(30, 'days').format(disF) : moment(dateFrom).format(disF),
                        '', 
                        moment(dateTo).format(disF)],
                    datasets: [
                    {
                        data: arrayChartData.length ? arrayChartData : [0,0,0,0,0,0,0],
                    },
                    ],
                }}
            />

            <Divider style={styles.divider}/>

            {/*switch type button */}
            <TouchableOpacity 
            onPress={() => setIsOut(!isOut)}
            style={styles.switchButton}>
                <AntDesign name='caretup' size={22} color={isOut ? 'red' : 'gray'}/>
                <AntDesign name='caretdown' size={22} color={isOut ? 'gray' : 'green'}/>
            </TouchableOpacity>

            <Text style={{fontSize: 20}}>S??? ti???n ???? {isOut ? 'chi' : 'thu'}</Text>
            <View style={styles.textSumContainer}>
                <NumberFormat 
                    value={getSum(dateRange, isOut?'OUT':'IN')} 
                    displayType='text'
                    thousandSeparator={true}
                    renderText={value => (
                        <Text style={[styles.textSum, {color: isOut?'red':'green'}]}>{value}</Text>
                    )}
                />
            </View>

            <View style={styles.datepickerContainer}>
                <View style={styles.datepicker}>
                    <Text style={styles.mH}>T???</Text>

                    <TouchableOpacity onPress={() => setShowDateFrom(true)} style={styles.dp}>
                        <Text>{moment(dateFrom).format(disF)}</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.datepicker}>
                    <Text style={styles.mH}>?????n</Text>

                    <TouchableOpacity onPress={() => setShowDateTo(true)} style={styles.dp}>
                        <Text>{moment(dateTo).format(disF)}</Text>
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
            <LinearGradient
                colors={['#b86ee0','#41bccc']}
                style={styles.background}
            />

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
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        opacity: 0.8,
        height: SCREEN_HEIGHT
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    cardContainer: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'white',
        padding: 5,
        margin: 5,
        marginHorizontal: 15
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5
    },
    cardTag: {
        flexDirection: 'row', 
        borderWidth: 1, 
        borderColor: 'lightgrey',
        borderRadius: 25,
        alignItems: 'center',
        padding:5,
        marginVertical: 2
    },
    datepickerContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around',
        width: '100%'
    },
    datepicker: {
        flexDirection: 'row',
        alignItems: 'center'
    },    
    dp: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 7,
        padding: 5,
        backgroundColor: 'white'
    },
    divider: {
        height: 1, 
        width: '90%',
        marginVertical: 5 ,
        backgroundColor: 'lightgray'
    },
    mH: {
        marginHorizontal: 5
    },
    switchButton: {
        flexDirection: 'row',
        padding: 2,
        borderBottomWidth: 1,
        backgroundColor: 'orange',
        alignSelf: 'flex-end'
    },
    textSumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    textSum: {
        fontSize: 50, 
        marginVertical: 10
    }
});

export default InfoScreen;
