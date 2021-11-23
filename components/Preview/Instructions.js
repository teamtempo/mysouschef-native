import React, {useState, useEffect} from 'react'
import { useRecoilState } from 'recoil';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { instructionsModal } from '../../atoms/InstructionsModal';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { showInstructions } from '../../atoms/ShowInstructions';
import { continueClicked } from '../../atoms/ContinueClicked';

function storeData(key, value) {
    AsyncStorage.setItem(key, value)
      .then(() => {
        console.log("Stored value", value);
      })
      .catch((e) => {
        alert("Error saving to AsyncStorage:" + JSON.stringify(e));
      });
}

const Instructions = ( {continueClicked} ) => {
    const [showInst, setShowInst] = useRecoilState(showInstructions);
    const [modalVisible, setModalVisible] = useRecoilState(instructionsModal);
    const [continueClickedState, setContinueClickedState] = useRecoilState(continueClicked);

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
            <Modal isVisible={modalVisible} backdropOpacity={0.3} onBackdropPress={() => setModalVisible(false)}>
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
                                <BouncyCheckbox 
                                    style={{marginTop:10}}
                                    textStyle={{color:'black', textDecorationLine: "none"}}
                                    text="Do not show these instructions again"
                                    isChecked={!showInst}
                                    onPress={updateInstructions}
                                    disableBuiltInState={true}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => nextScreen()} style={styles.continueButton}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}} >Continue</Text>
                        </TouchableOpacity>


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
    continueButton: {
        backgroundColor: "#9AD3BB", 
        padding: 15,
        alignItems: 'center', 
        borderRadius: 40, 
        marginTop: 10
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

{/* <View>
<Modal isVisible={modalVisible} backdropOpacity={0.3} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modal}>
                <View style={styles.instructions}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black'}}>
                        Voice Commands
                    </Text>
                    <Text style={{ fontSize:14, fontWeight: 'bold', color: 'black' }}>
                        To activate the voice commands, first say "blueberry", then say one of the commands listed below.
                    </Text>
                </View>
                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Start"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    or
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, fontWeight: "bold", color: 'black'}}>
                    "Begin"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    to start the timer.
                    </Text>
                 </View>
                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Stop"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    or
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, fontWeight: "bold", color: 'black'}}>
                    "Pause"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                        to stop the timer.
                    </Text>
                 </View>

                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black'}}>
                    ● "Read instructions"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    to read the instructions.
                    </Text>
                 </View>

                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Extend"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    or
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, fontWeight: "bold", color: 'black'}}>
                    "Increase"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    to increase the timer by 1 minute.
                    </Text>
                 </View>

                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Subtract"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    or
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, fontWeight: "bold", color: 'black'}}>
                    "Decrease"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black' }}>
                    to decrease the timer by 1 minute.
                    </Text>
                 </View>

                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Reset"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    or
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, fontWeight: "bold", color: 'black'}}>
                    "Restart"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    to to restart the timer.
                    </Text>
                 </View>

                 
                 <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Next step"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    to go to the next step.
                    </Text>
                </View>

                 
                <View style={{flexDirection: "row"}}>
                    <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                    ● "Previous step"
                    </Text>
                    <Text style={{ fontSize:14, marginLeft: 2, color: 'black'}}>
                    to go to the previous step.
                    </Text>
                </View>   
            </View>
            <TouchableOpacity onPress={() => nextScreen()} style={{backgroundColor: "#9AD3BB", height: 40, alignItems: 'center', borderRadius: 20, marginTop: 3}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}} >Continue</Text>
            </TouchableOpacity>
</Modal>
</View> */}