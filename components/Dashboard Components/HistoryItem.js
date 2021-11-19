import React, { useRef, useEffect }from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { pastLinks } from '../../atoms/PastLinks';

import axios from 'axios'
import { useRecoilState, useRecoilValue } from 'recoil';
import { stepsState } from '../../atoms/Steps';
import { ingredientsState } from '../../atoms/Ingredients';

import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unitChoice } from '../../atoms/UnitChoice';

const HistoryItem = ({navigation, item}) => {
    const links = useRecoilValue(pastLinks);
    const [initSteps, setInitSteps] = useRecoilState(stepsState);
    const steps = useRef(initSteps)

    const [initIngredients, setInitIngredients] = useRecoilState(ingredientsState);
    const ingredients = useRef(initIngredients)

    const [ImperialIsEnabled, setImperialIsEnabled] = useRecoilState(unitChoice);

    useEffect(() => {
        steps.current = initSteps
    }, [initSteps])

    useEffect(() => {
        ingredients.current = initIngredients
    }, [initIngredients])

    
    async function getLink() {
        let res;
        let clickedItem = links.find(link => link.value === item);
        let link = clickedItem.key.slice(1);
        if (ImperialIsEnabled) {
            res = await axios.get(`https://my-souschef.herokuapp.com/recipe?url=${link}&unit=metric`);
        } else {
            res = await axios.get(`https://my-souschef.herokuapp.com/recipe?url=${link}&unit=imperial`);
        }
        navigation.navigate('Preview')  
        setInitSteps(res.data.slice(2));
        setInitIngredients(res.data[1])
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
            <View style={styles.icons}>
                <TouchableOpacity onPress={deleteLink} style={{marginLeft: 10}}>
                    <Icon name="trash" size={25} color="#9AD3BB"/>
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.text}>{item}</Text>
            </View>
            <View style={styles.icons}>
                <TouchableOpacity onPress={getLink}>
                        <Icon name="check-circle" size={25} color="#9AD3BB"/>
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
