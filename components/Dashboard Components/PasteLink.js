import React, { useState, useEffect, useRef }from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { useRecoilState, useRecoilValue } from 'recoil';
import { stepsState } from '../../atoms/Steps';
import { clickedRecipe } from '../../atoms/ClickedRecipe';
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const [url, setURL] = useState()
    const [initSteps, setInitSteps] = useRecoilState(stepsState);
    const steps = useRef(initSteps)
    const link = useRecoilValue(clickedRecipe)

    const addHistory = (key, value) => {
        const timer = setTimeout(() => {
            storeData(("@"+key), value);
          }, 1);
          return () => clearTimeout(timer);
    }


    useEffect(() => {
        steps.current = initSteps
    }, [initSteps])


    useEffect(() => {
        setURL(link);
      }, [link]);


    async function fetchData() {
        const res = await axios.get(`https://my-souschef.herokuapp.com/recipe?url=${url}`);
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
            addHistory(url, res.data[0].title);
            setInitSteps(res.data.slice(1));
        }
    }
    
    return (
        <View style={styles.container}>
            <TextInput 
            value={url}
            style={styles.input}
            placeholder='paste recipe url here'
            onChangeText={(val) => setURL(val)}/>
            <TouchableOpacity style={styles.button} onPress={fetchData}>
            <Text>GO</Text>
            </TouchableOpacity> 
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
        flexDirection: 'row'
    },
    input: {
        borderWidth: 1,
        borderRadius: 40,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: 250,
        height: 40
    },
    button: {
        borderRadius: 60,
        height: 40,
        width: 40,
        backgroundColor: '#9AD3BB',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default PasteLink;