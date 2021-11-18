import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ingredients from './Preview/Ingredients';
import Steps from './Preview/Steps';
import { PorcupineManager } from '@picovoice/porcupine-react-native';

function Preview( { navigation } ) {

    return (
    <View style={styles.container}>
        <View style={styles.main}>
            <Text style={styles.title}>Recipe</Text>
        </View>
            <ScrollView showsVerticalScrollIndicator={true}>
                <Ingredients />
                <Steps />
            </ScrollView>
        <View style={styles.main}>
            <TouchableOpacity onPress={() => navigation.navigate('CurrentStep')} style={styles.button}>
                <Text style={{fontSize: 25, fontWeight: '900', color: 'white'}}>Start</Text>
            </TouchableOpacity>
        </View>
    </View>
    );

}
          
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3EAC2',
        justifyContent: 'center',
    },
    main: {
        backgroundColor: '#F5B463'
    }, 
    title: {
        fontSize: 30,
        fontWeight: '900',
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
