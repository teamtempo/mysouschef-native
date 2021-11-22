import React from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native'
import { useRecoilValue } from 'recoil';
import HistoryItem from './HistoryItem';
import { pastLinks } from '../../atoms/PastLinks';

function History({ navigation }) {
    const previous = useRecoilValue(pastLinks);

    return (
        <View style={styles.container}>
           <FlatList data={previous} renderItem={({ item }) => <HistoryItem item={item.value} navigation={navigation}/>} keyExtractor={item => item.key}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: 350,
        height: 150,
        borderRadius: 50
    },
});
 

export default History;