import React, { useState }from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { pastLinks } from '../../atoms/PastLinks';
import { clickedRecipe } from '../../atoms/ClickedRecipe';
import { useRecoilState } from 'recoil';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryItem = ({item}) => {

    const [links, setLinks] = useRecoilState(pastLinks);
    const [clickedLink, setclickedLink] = useRecoilState(clickedRecipe);

    const getLink = () => {
        let clickedItem = links.find(link => link.value === item);
        console.log(clickedItem);
        let link = clickedItem.key.slice(1);
        console.log(link)
        setclickedLink(link);
    }

    async function deleteLink() {
        let deletedItem = links.find(link => link.value === item);
        try {
            await AsyncStorage.removeItem(deletedItem.key);
            console.log('Data removed')
        }
        catch(exception) {
            console.log(exception)
        }
    }
        


    
    return (
        
        <View style={ styles.container }>
            <View>
            <TouchableOpacity onPress={() => {getLink()}}>
                <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
            </View>
           
            <View>
                <TouchableOpacity onPress={() => {deleteLink()}} style={{marginLeft: 10}}>
                <Icon name="trash" size={20} color="#9AD3BB"/>
                </TouchableOpacity>
            </View>
          
                
        </View>
            
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        padding: 10,
        borderRadius: 20,
        color: '#000000',
       
    }
})

export default HistoryItem
