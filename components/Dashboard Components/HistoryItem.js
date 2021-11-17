import React, { useRef, useEffect }from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { pastLinks } from '../../atoms/PastLinks';
import { clickedRecipe } from '../../atoms/ClickedRecipe';

import axios from 'axios'
import { useRecoilState } from 'recoil';
import { stepsState } from '../../atoms/Steps';

import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryItem = ({navigation, item}) => {
    const [links, setLinks] = useRecoilState(pastLinks);
    const [initSteps, setInitSteps] = useRecoilState(stepsState);
    const steps = useRef(initSteps)
    const [clickedLink, setclickedLink] = useRecoilState(clickedRecipe);

    useEffect(() => {
        steps.current = initSteps
    }, [initSteps])
    
    async function getLink() {
        let clickedItem = links.find(link => link.value === item);
        let link = clickedItem.key.slice(1);
        setclickedLink(link); 
        const res = await axios.get(`https://my-souschef.herokuapp.com/recipe?url=${link}`);
        navigation.navigate('Preview')  
        setInitSteps(res.data.slice(1));
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
                <Text style={styles.text}>{item}</Text>
            </View>
            
            <View style={styles.icons}>
                <TouchableOpacity onPress={getLink}>
                        <Icon name="check-circle" size={20} color="#9AD3BB"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteLink} style={{marginLeft: 10}}>
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
    },
    icons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
})

export default HistoryItem
