import React from 'react'
import { useRecoilState } from 'recoil';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { instructionsModal } from '../../atoms/InstructionsModal';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { showInstructions } from '../../atoms/ShowInstructions';
import { continueClicked } from '../../atoms/ContinueClicked';
import { voiceCommandInst } from '../../atoms/VoiceCommandInst';

function storeData(key, value) {
    AsyncStorage.setItem(key, value)
      .then(() => {
        console.log("Stored value", value);
      })
      .catch((e) => {
        alert("Error saving to AsyncStorage:" + JSON.stringify(e));
      });
}

const Instructions = () => {
    const [showInst, setShowInst] = useRecoilState(showInstructions);
    const [modalVisible, setModalVisible] = useRecoilState(instructionsModal);
    const [continueClickedState, setContinueClickedState] = useRecoilState(continueClicked);
    const [inCurrStep, setInCurrStep] = useRecoilState(voiceCommandInst);

    function nextScreen() {
        setModalVisible(false);
        setContinueClickedState(true); 
    }

    function updateInstructions() {
        setShowInst(!showInst)
        const timer = setTimeout(() => {
            storeData(("showInstructions"), JSON.stringify(!showInst))
        }, 1);
          return () => clearTimeout(timer);
    }
    //
    return ( 
        <View>
            <Modal isVisible={modalVisible} backdropOpacity={0.3} onBackdropPress={() => {setModalVisible(false)}}>
                        <View style={styles.modal}>
                            <View style={styles.instructions}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', paddingBottom: 10}}>
                                    Voice Commands
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                                    To activate the voice commands, call "blueberry", then say one of the commands listed below.
                                </Text>
                            </View>
                            <View style={styles.commandList}>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Start" </Text>
                                    or 
                                    <Text style={{fontWeight: 'bold'}}> "Begin" </Text>
                                    to start the timer.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Stop" </Text>
                                    or 
                                    <Text style={{fontWeight: 'bold'}}> "Pause" </Text>
                                    to stop the timer.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Read instructions" </Text>
                                    to read the instructions.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Extend" </Text>
                                    or 
                                    <Text style={{fontWeight: 'bold'}}> "Increase" </Text>
                                    to increase the timer by 1 minute.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Subtract" </Text>
                                    or 
                                    <Text style={{fontWeight: 'bold'}}> "Decrease" </Text>
                                    to decrease the timer by 1 minute.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Reset" </Text>
                                    or 
                                    <Text style={{fontWeight: 'bold'}}> "Restart" </Text>
                                    to restart the timer.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Next step" </Text>
                                    to go to the next step.
                                </Text>
                                <Text style={styles.text}>
                                    <Text style={{fontWeight: 'bold'}}> ● "Previous step" </Text>
                                    to go to the previous step.
                                </Text>
                                { inCurrStep === false ?
                                <View>
                                    <BouncyCheckbox 
                                        style={{marginTop:10}}
                                        textStyle={{color:'black', textDecorationLine: "none"}}
                                        text="Do not show these instructions again"
                                        isChecked={!showInst}
                                        onPress={updateInstructions}
                                        disableBuiltInState={true}
                                    />
                                </View> : null
                                }
                            </View>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity onPress={() => {setModalVisible(false)}} style={styles.closebutton}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}} >Close</Text>
                            </TouchableOpacity>
                            { inCurrStep === false ?
                            <TouchableOpacity onPress={() => nextScreen()} style={styles.nextstepbutton}>
                                <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}} >Start Recipe</Text>
                            </TouchableOpacity> : null
                            }  
                        </View>


            </Modal>
        </View>
     );
}
 
const styles = StyleSheet.create({
    modal: {
        flexDirection: 'column',
        backgroundColor: "white", 
        padding: 15,
        marginLeft: -10,
        marginRight: -10,
        borderRadius: 40, 
    },
    instructions: {
       alignItems: 'center',
       paddingTop: 10
    },
    text: {
        fontSize: 15,
        color: 'black'
    },
    commandList: {
        padding: 10,
        paddingLeft: 17,
        paddingRight: 17
    },
    closebutton: {
        backgroundColor: "#9AD3BB", 
        padding: 10,
        borderRadius: 20, 
        marginLeft: 0,
        marginRight: 2,
        marginTop: 2,
        flex: 1
    },
    nextstepbutton: {
        backgroundColor: "#9AD3BB", 
        padding: 10,
        borderRadius: 20, 
        marginLeft: 2,
        marginRight: 0,
        marginTop: 2,
        flex: 1
    },
    noMoreInstructions: {
        marginTop:10,
        flex:1,
        color:'#000000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }

});

export default Instructions;