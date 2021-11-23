import React, { useState, useEffect, useRef }from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native'
import axios from 'axios'
import { useRecoilState } from 'recoil';
import { stepsState } from '../../atoms/Steps';
import { loading } from '../../atoms/Loading';
import { ingredientsState } from '../../atoms/Ingredients';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { unitChoice } from '../../atoms/UnitChoice';
import { pastLinks } from '../../atoms/PastLinks';
import { linkUpdate } from '../../atoms/LinkUpdate';

function storeData(key, value) {
    AsyncStorage.setItem(key, value)
      .then(() => {
        console.log("Stored value", value);
      })
      .catch((e) => {
        alert("Error saving to AsyncStorage:" + JSON.stringify(e));
      });
}

function PasteLink( { navigation } ) {
    const textInput = useRef();
    const [url, setURL] = useState();
    const[isLoading, setIsLoading] = useRecoilState(loading);
    const [links, setLinks] = useRecoilState(pastLinks);
    const [linkUpdated, setLinkUpdated] = useRecoilState(linkUpdate);

    const [initSteps, setInitSteps] = useRecoilState(stepsState);
    const steps = useRef(initSteps)

    const [initIngredients, setInitIngredients] = useRecoilState(ingredientsState);
    const ingredients = useRef(initIngredients)

    const [ImperialIsEnabled, setImperialIsEnabled] = useRecoilState(unitChoice);
    const toggleSwitch = () => setImperialIsEnabled(previousState => !previousState);

    function showUnitChoice() {
        if (ImperialIsEnabled === false) {
            return <Text style={{ fontSize: 14, color: 'black'}}>Measurements are shown in Metric units</Text>
        } else {
            return <Text style={{ fontSize: 14, color: 'black'}}>Measurements are shown in Imperial units</Text>
        }
    }

    const addHistory = (key, value) => {
        const timer = setTimeout(() => {
            storeData(key, value);
            setLinkUpdated(true);
          }, 1);
          return () => clearTimeout(timer);
    }
    
    useEffect(() => {
        steps.current = initSteps
    }, [initSteps])

    useEffect(() => {
        ingredients.current = initIngredients
    }, [initIngredients])

    async function fetchData() {
        setIsLoading(true);
        let res;
        if (ImperialIsEnabled) {
            res = await axios.get(`https://my-souschef.herokuapp.com/recipe?url=${url}&unit=imperial`);
            setIsLoading(false);
        } else {
            res = await axios.get(`https://my-souschef.herokuapp.com/recipe?url=${url}&unit=metric`);
            setIsLoading(false);
        }
        
        if (res.data === "Site not yet supported") {
            alert("The website provided is not yet supported, please try another website.")
        } else if (res.data === "Failed to parse domain") {
            alert("The url provided is invalid, please try again.")
        } else if (res.data === "No recipe found on page") {
            alert("No recipe found on page, try another recipe")
        } else if (res.data.includes("url provided must include")) {
            alert("The url provided must include http:// or https://") 
        } else {
            navigation.navigate('Preview')
            const aData = new Date();
            addHistory(url, JSON.stringify([res.data[0].title, aData]));
            setInitIngredients(res.data[1])
            setInitSteps(res.data.slice(2));
            textInput.current.clear();
        }
    }
    
    return (
        <View>
        <View style={styles.container}>
            <View style= {{ flexDirection: 'row', alignItems: 'center'}}>
                <TextInput 
                    ref={textInput}
                    style={styles.input}
                    placeholder='paste recipe url here'
                    onPressIn={() => textInput.current.clear()}
                    onChangeText={(val) => setURL(val)}/>
                <TouchableOpacity style={styles.button} onPress={fetchData}>
                    <Text style={{ color: '#000000' }}>GO</Text>
                </TouchableOpacity> 
            </View>
            
            <View style={styles.switch}>
                {showUnitChoice()}
                <Switch
                trackColor={{ false: "#767577", true: "#9AD3BB" }}
                thumbColor={ImperialIsEnabled ? "#F5B463" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={ImperialIsEnabled}
                />
            </View>
        </View>
    </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 100,
        borderRadius: 40,
        paddingTop: 7,
    },
    input: {
        borderWidth: 1,
        borderRadius: 40,
        borderColor: '#777',
        padding: 8,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: 250,
        height: 40,
        color:'#000000',
    },
    button: {
        borderRadius: 60,
        height: 40,
        width: 40,
        marginTop: 10,
        marginRight: 10,
        backgroundColor: '#9AD3BB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch: {
        flex: 1,
        flexDirection: 'row',	
        alignItems: 'center',
      }
});

export default PasteLink;