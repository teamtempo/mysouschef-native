import React, { useState }from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { pastLinks } from '../../atoms/PastLinks';
import { clickedRecipe } from '../../atoms/ClickedRecipe';
import { useRecoilState } from 'recoil';

const HistoryItem = ({item}) => {

    const [links, setLinks] = useRecoilState(pastLinks);
    const [clickedLink, setclickedLink] = useRecoilState(clickedRecipe);

    const getLink = () => {
        let clickedItem = links.find(link => link.value === item);
        let link = clickedItem.key.slice(1);
        setclickedLink(link);
    }
    
    return (
        
        <View style={ styles.container }>
            <TouchableOpacity onPress={() => {getLink()}}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        padding: 10,
        borderRadius: 20,
        color: '#000000'
    }
})

export default HistoryItem
