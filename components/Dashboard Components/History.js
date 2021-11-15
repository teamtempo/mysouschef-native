import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useRecoilValue } from 'recoil';
import HistoryItem from './HistoryItem';
import { pastLinks } from '../../atoms/PastLinks';

function History() {
    const previous = useRecoilValue(pastLinks);



    return (
        <View style={styles.container}>

           <FlatList data={previous} renderItem={({ item }) => <HistoryItem item={item.value}/>} keyExtractor={item => item.key} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: 350,
        height: 150,
        borderRadius: 60
    },
});


export default History;