import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function Generate( { navigation } ) {
    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={() => {
             navigation.navigate('Preview');
            }}>
            <Text>Generate</Text>
            </TouchableOpacity> 
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 60,
        backgroundColor: '#9AD3BB',
        width: 350,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Generate