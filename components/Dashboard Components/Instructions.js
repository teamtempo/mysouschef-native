import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

function Instructions() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> 1. Grab any recipe page from the internet. </Text>
            <Text style={styles.text}> 2. Copy the link, and paste it below. </Text>
            <Text style={styles.text}> 3. Click on generate, and start cooking! </Text>

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
        borderRadius: 60,
        marginTop: -15
    },
    text: {
        marginTop: 10,
        fontSize: 15,
        color: '#000000'
    }
});

export default Instructions