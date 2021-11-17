import React, { useState }from 'react'
import { StyleSheet, Text, View, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';
import { stepsState } from '../../atoms/Steps'
import Modal from "react-native-modal";
import { WheelPicker } from "react-native-wheel-picker-android";


const Steps = () => {

    let timePickerData = [...Array(61).keys()].map(i => i.toString());

    const [steps, setSteps] = useRecoilState(stepsState);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTimer, setModalTimer] = useState();
    const [modalInput, setModalInput] = useState();
    const [modalDetails, setModalDetails] = useState();
    const [modalstep, setModalstep] = useState();
    const [index, setIndex] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedSecond, setSelectedSecond] = useState(0);


    const editTimer = (index) => {
        setModalVisible(true);
        setModalstep(steps[index].step);
        setModalTimer(steps[index].timer / 60);
        setModalDetails(steps[index].details);
        setIndex(index);
    }

    const modalInputHandler = (val) => {
        setModalInput(val * 60);
    }

    const displayTimer = (timer) => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        let time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        return <Text style={{color: '#000000'}}>{time}</Text>
    }
    
    const saveTimer = () => {
        const newList = replaceItemAtIndex(steps, index, {
        ...steps,
        step: modalstep,
        timer: modalInput,
        details: modalDetails
        });
        setModalVisible(false);
        setSteps(newList);
        console.log("clicked");
    };

    let onMinuteSelected = selectedItem => {
        setSelectedMinute(selectedItem);
        setModalInput(selectedItem * 60);
      };
    
    let onSecondSelected = selectedItem => {
        setModalInput(modalInput + selectedItem)
      };
    


    return ( 
         
    <ScrollView style={styles.container}>
        {steps.map((step, index) => {
            return (
                <View key={index} style={styles.step}>
                    <View style={styles.overview}>
                        <View style={styles.stepNumber}>
                            <Text style={{fontWeight:"bold", fontSize: 18, color: '#000000'}}> Step {step.step} </Text>
                            <Text style={{color: '#000000'}}> {displayTimer(step.timer)} minutes </Text>
                        </View>
                        <View style={styles.timerbtn}>
                            <TouchableOpacity onPress={() => {editTimer(index)}}>
                                <Text style={{color: '#000000'}}> edit timer </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.details}>
                        <Text style={{color: '#000000'}}> {step.details} </Text>
                    </View>
                    <Modal isVisible={modalVisible} backdropOpacity={0.3} onBackdropPress={() => setModalVisible(false)}>
                        <View style={{ flex:1}}>
                        </View>
                        <View style={styles.modal}>
                            <WheelPicker
                            selectedItem={selectedMinute}
                            data={timePickerData}
                            onItemSelected={onMinuteSelected}
                            />
                            <WheelPicker
                            selectedItem={selectedSecond}
                            data={timePickerData}
                            onItemSelected={onSecondSelected}
                            />
                            <Button style={styles.modalbutton} title="edit Timer" onPress={() => {saveTimer()}}/>
                        </View>
                    </Modal>
                </View>
            )
        })}
    </ScrollView>
      
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3EAC1',
    },
    step: {
        padding: 20
    },
    stepNumber: {
        padding: 5,
    }, 
    timerbtn: {
        padding: 7,
        backgroundColor: '#9AD3BB',
        borderRadius: 20
    },
    overview: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#F5B463',
        borderWidth: 2,
        borderBottomWidth: 0,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderColor: '#F5B463',
        borderWidth: 2,
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    modal: {
        backgroundColor: "white", 
        margin:50,
        padding:40, 
        borderRadius:20, 
        alignContent: 'center',
        flexDirection: 'column',
    },
    modalbutton: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F8E0B8",
        padding: 10,
        marginLeft: 10,
        height: 100,
        borderRadius: 20,
    },
    modalinput: {
        borderColor: 'gray',
        height: 40,
        marginTop: 10,
        borderWidth: 1,
        marginLeft: 10,
        marginBottom: 10,
        padding: 10,
        marginRight: 10,
        textAlign: 'center',
        borderRadius: 10,
        color:'#000000',
    },
    
});

function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}
export default Steps;

// listContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#FECF82',
//     flex: 1,
//     marginLeft: 10,
//     marginRight: 10,
//     borderRadius: 20,
// },
// stepText: {
//     flex: 1,
//     borderRadius: 20,
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: "#F9A65C",
// },
// timerbutton: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#F9A65C",
//     padding: 10,
//     marginLeft: 10,
//     borderRadius: 20,
// },
// details: {
//     flex: 1,
//     marginLeft: 10,
//     marginRight: 10,
//     padding: 10,
//     backgroundColor: '#FECF82',
//     borderRadius: 20,
// },