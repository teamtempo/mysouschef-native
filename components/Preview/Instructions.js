import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { instructionsModal } from '../../atoms/InstructionsModal';

import { useRecoilState } from 'recoil';
import { continueClicked } from '../../atoms/ContinueClicked';

const Instructions = ( {continueClicked} ) => {

    const [modalVisible, setModalVisible] = useRecoilState(instructionsModal);
    const [continueClickedState, setContinueClickedState] = useRecoilState(continueClicked);

    function nextScreen() {
        setModalVisible(false);
        setContinueClickedState(true);
    }
    
    return ( 
        <View>
            <Modal isVisible={modalVisible} backdropOpacity={0.3} onBackdropPress={() => setModalVisible(false)}>
                        <View style={styles.modal}>
                            <View style={{ alignItems: 'center', marginBottom: 5}}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black'}}>
                                Voice commands
                            </Text>
                            <Text style={{ fontSize:14, fontWeight: 'bold', color: 'black' }}>
                                To activate the voice commands, first say "blueberry",
                            </Text>
                            <Text style={{ fontSize:14, fontWeight: 'bold', color: 'black' }}>
                                then say one of the commands listed below.
                            </Text>
                            </View>
                             <View style={{flexDirection: "row"}}>
                             <Text style={{ fontSize:14, fontWeight: "bold", color: 'black' }}>
                             ● "Start"
                            </Text>
                            <Text style={{ fontSize:14, marginLeft: 2}}>
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
        </View>
     );
}
 
const styles = StyleSheet.create({
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

export default Instructions;