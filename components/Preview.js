import React, {useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Steps from './Preview/Steps';

import { useRecoilState } from 'recoil';
import { instructionsModal } from '../atoms/InstructionsModal';
import Instructions from './Preview/Instructions';
import { continueClicked } from '../atoms/ContinueClicked';


function Preview( { navigation } ) {

    const [modalVisible, setModalVisible] = useRecoilState(instructionsModal);
    const [continueClickedState, setContinueClickedState] = useRecoilState(continueClicked);

    useEffect(() => {
        if (continueClickedState) {
            navigation.navigate('CurrentStep');
            setContinueClickedState(false);
        }
    }, [continueClickedState])

    

    return (
        
    <View style={styles.container}>
        <Text style={styles.title}>Recipe</Text>
        <Steps />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>Start</Text>
        </TouchableOpacity>
        <Instructions continueClicked={continueClicked}/>
        

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
    bgImage: {
        flex: 1,
        justifyContent: "center"
    },
    modal: {
        flexDirection: 'column',
        backgroundColor: "white", 
        marginLeft:-15,
        marginRight:-15,
        paddingBottom: 10,
        paddingTop: 10, 
        paddingLeft: 2,
        paddingRight: 10,
        borderRadius:20, 
        borderColor: '#F5B463',
        borderWidth: 2,
    },

});

export default Preview;
