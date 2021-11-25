import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import ConfettiCannon from 'react-native-confetti-cannon';

const DonePage = ({ navigation }) => {
    const confetti = useRef();

    // useEffect(() => {
    //     confetti.current.start();
    // }, [])

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.heading}> Hooray, you're done! </Text>
            </View>
            <View>
            <FastImage
                style={{ width: 400, height: 300 }}
                source={{
                    uri: 'https://media.giphy.com/media/yqQHIn1vldyRSo4Fv9/giphy.gif',
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            /> 
            </View>
            <View>
                <TouchableOpacity style={styles.home} onPress={() => navigation.navigate('DashBoard')}>
                    <Text style={{color: 'black'}}> Return Home </Text>
                </TouchableOpacity>
            </View>
            <ConfettiCannon
                count={200}
                origin={{x: -10, y: 0}}
                autoStart={true}
                ref={confetti}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3EAC2',
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading: {
        color: '#F5B463',
        fontSize: 35,
        fontWeight: '900'
    },
    home: {
        backgroundColor: '#F5B463',
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20
    }
})

export default DonePage
