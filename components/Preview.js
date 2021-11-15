import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Steps from './Preview/Steps';


function Preview( { navigation } ) {
    return (
       
    <View style={styles.container}>
        <Text style={styles.title}>Recipe</Text>
        <Steps />
        <TouchableOpacity onPress={() => navigation.navigate('CurrentStep')} style={styles.button}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Start</Text>
        </TouchableOpacity>
    </View>

    );

}
          
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5B463',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingTop: 40,
        padding: 10,
        textAlign: 'center',
        color: 'white'
    },
    button: {
        alignItems: "center",
        padding: 15,
    },
    checkbox: {
        alignItems: "center",
        backgroundColor: "#D89B63",
        padding: 10
    },
    bgImage: {
        flex: 1,
        justifyContent: "center"
    },

});

export default Preview;
