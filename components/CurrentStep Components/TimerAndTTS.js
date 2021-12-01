import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import Icon from 'react-native-vector-icons/FontAwesome';

import Tts from 'react-native-tts';

import { voiceResults } from '../../atoms/VoiceResults';
import { stepsState } from '../../atoms/Steps';
import { currentStepIndex } from '../../atoms/CurrentStepIndex';
import { removeListeners, say } from '../../helpers/voice-helper';

import Sound from 'react-native-sound';
import DonePage from './DonePage';

import Modal from "react-native-modal";



const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time % 60;
    return { hours: formatNumber(hours), minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
}



const TimerAndTTS = ({step, instructions, time, index, scrollToIndex, navigation}) => {
    const [currentIndex, setCurrentIndex] = useRecoilState(currentStepIndex);
    const [remainingSecs, setRemainingSecs] = useState(time);
    const [isActive, setIsActive] = useState(false);
    const { hours, minutes, seconds } = getRemaining(remainingSecs);
    const [voiceResultsState, setVoiceResultsState] = useRecoilState(voiceResults);
    const steps = useRecoilValue(stepsState);
    const [modalVisible, setModalVisible] = useState(false);
    const [lastStepModalVisible, setLastStepModalVisible] = useState(false);
    
    useEffect(() => {
        voiceController();
    },[voiceResultsState]);
    
    const voiceController = () => {
        if (currentIndex === index) {
            if (voiceResultsState.includes("stop timer")
            || voiceResultsState.includes("pause timer")
            || voiceResultsState.includes("pause")) {
                say("timer stopped")
                stopTimer();
            } else if (voiceResultsState.includes("start") 
            || voiceResultsState.includes("go")
            || voiceResultsState.includes("start timer")
            || voiceResultsState.includes("begin timer")
            || voiceResultsState.includes("begin")
            || voiceResultsState.includes("resume")) {
                if (remainingSecs >= 60) {
                    say("timer started")
                    startTimer();
                }
            } else if (voiceResultsState.includes("read instructions")
            || voiceResultsState.includes("read step")
            || voiceResultsState.includes("instructions")
            || voiceResultsState.includes("read the instructions")) {
                console.log(step, instructions) 
                speak();
            } else if (voiceResultsState.includes("extend")
            || voiceResultsState.includes("add")
            || voiceResultsState.includes("increase timer")
            || voiceResultsState.includes("extend timer")
            || voiceResultsState.includes("increase timer")
            || voiceResultsState.includes("increase")
            || voiceResultsState.includes("more")) {
                addTime();
            } else if (voiceResultsState.includes("subtract")
            || voiceResultsState.includes("decrease timer")
            || voiceResultsState.includes("reduce timer")
            || voiceResultsState.includes("decrease")
            || voiceResultsState.includes("reduce")) {
                if (remainingSecs >= 60) {
                    subtractTime();
                }        
            } else if (voiceResultsState.includes("reset")
            || voiceResultsState.includes("restart")
            || voiceResultsState.includes("restart timer")
            || voiceResultsState.includes("restart timer")) {
                resetTimer();
            } else if (voiceResultsState.includes('stop reading')) {
                Tts.stop();
            } else if (voiceResultsState.includes("next step")
            || voiceResultsState.includes("next")) {
                if (index+1 < steps.length) {
                    setModalVisible(false);
                    setCurrentIndex(index+1);
                    scrollToIndex(index + 1)
                    say(`step ${currentIndex+2}`)
                }
            } else if (voiceResultsState.includes("previous step")
            || voiceResultsState.includes("previous")) {
                if (index-1 >= 0) {
                    setModalVisible(false);
                    setCurrentIndex(index-1);
                    scrollToIndex(index - 1)
                    say(`step ${currentIndex}`)
                }
            } else if (voiceResultsState !== "") {
                say("I didnt understand the command, please try again");
            } else if (voiceResultsState.includes("close") && modalVisible) {
                setModalVisible(false);
            }
        
        }
        setVoiceResultsState("");
    }
                    
    const speak = () => {
        say(`Step ${step}, ${instructions}`)
    }

    const toggleTimer = () => {
        setIsActive(!isActive);
      }

    const startTimer = () => {
        setIsActive(true);
      }

    const stopTimer = () => {
        setIsActive(false);
    }
    
    const resetTimer = () => {
        setRemainingSecs(time);
        setIsActive(false);
    }

    const addTime = () => {
        setRemainingSecs(remainingSecs + 60);
    }

    const subtractTime = () => {
        setRemainingSecs(remainingSecs - 60);
    }

    function alarm() {
        var alarm = new Sound('alarm.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
            console.log('duration in seconds: ' + alarm.getDuration() + 'number of channels: ' + alarm.getNumberOfChannels());
            alarm.setVolume(1);

            alarm.play((success) => {
              if (success) {
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
          });
        
      }

    function nextStep() {
        setCurrentIndex(currentIndex + 1);
        scrollToIndex(currentIndex + 1)
        setModalVisible(false);
    }



    useEffect(() => {
        if (remainingSecs === 0 && isActive === true && index +1 < steps.length) {
            setIsActive(false)
            setModalVisible(true)
        }

        if (remainingSecs === 0 && isActive === true && index +1 === steps.length) {
            setIsActive(false)
            setLastStepModalVisible(true);
        }
        
        if (remainingSecs === 1) {
            alarm();
        }
    }, [remainingSecs])

 
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
            setRemainingSecs(remainingSecs => remainingSecs - 1);
            }, 1000);
        } else if (!isActive && remainingSecs !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, remainingSecs]);

    return (
        <View style={{flex: 1, marginTop: 50 }}>
            { hours > 0 ? 
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 70, color: '#000000'}}>{`${hours}:${minutes}:${seconds}`}</Text>
                <Text style={{fontSize: 20, color: '#000000'}}>{ hours <= 1 ? "hour" : "hours"}        { minutes <= 1 ? "minute" : "minutes"}      { seconds <= 1 ? "second" : "seconds" }</Text>
            </View>
            : 
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 70, color: '#000000'}}>{`${minutes}:${seconds}`}</Text>
                <Text style={{fontSize: 20, color: '#000000'}}>{ minutes <= 1 ? "minute" : "minutes"}      { seconds <= 1 ? "second" : "seconds" }</Text>
            </View>
            }
            <Modal isVisible={modalVisible} backdropOpacity={0.3} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modal}>
                <Text style={{fontSize:22, fontWeight: 'bold', color: 'black'}}>Step complete!</Text>
               
            </View>
            <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closebutton}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}} >Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => nextStep()} style={styles.nextstepbutton}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}} >Next step</Text>
                        </TouchableOpacity>
            </View>
           
                        
            </Modal>

            <Modal isVisible={lastStepModalVisible} backdropOpacity={0.3} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modal}>
                <Text style={{fontSize:22, fontWeight: 'bold', color: 'black'}}>Step complete!</Text>
               
            </View>
            <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setLastStepModalVisible(false)} style={styles.closebutton}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}} >Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('DonePage')}style={styles.nextstepbutton}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}}>Done</Text>
                        </TouchableOpacity>
            </View>
           
                        
            </Modal>
            <View style={{flex: 0.6, marginTop: 40}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingLeft: 50, paddingRight: 50}}>
                    { remainingSecs < 60 ? 
                    <TouchableOpacity style={styles.timerIcon}>
                        <Icon name="minus-circle" size={40} color="#E8EBEF"/>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.timerIcon} onPress={subtractTime}>
                        <Icon name="minus-circle" size={40} color="#9AD3BB"/>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.adjustTimer} onPress={resetTimer}>
                        <Text style={{fontSize: 15, color: '#000000'}}> Reset </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timerIcon} onPress={addTime}>
                        <Icon name="plus-circle" size={40} color="#9AD3BB"/> 
                    </TouchableOpacity>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 7 }}>
                    { remainingSecs === 0 || !remainingSecs ? 
                    <TouchableOpacity style={[styles.resumebtn, { backgroundColor: '#E8EBEF' }]}>
                        <Text style={{color: 'black'}}> No timer set </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.resumebtn} onPress={toggleTimer}>
                    { isActive ?  <Text style={{fontSize: 15, color: '#000000'}}> Pause </Text> :  <Text style={{fontSize: 15, color: '#000000'}}> Resume </Text> }
                    </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.tts} onPress={speak}>
                        <Text style={{fontSize: 15, color: '#000000'}}> Read Instructions </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    { steps.length === index + 1 && 
                    <TouchableOpacity style={styles.done} onPress={() => navigation.navigate('DonePage')}>
                        <Text style={{fontSize: 15, color: '#000000'}}> Done </Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tts: {
        backgroundColor: 'white',
        padding: 25,
        alignItems: 'center',
        borderRadius: 60
    },
    resumebtn: {
        backgroundColor: 'white',
        padding: 25,
        paddingLeft: 50,
        paddingRight: 50,
        marginRight: 6,
        alignItems: 'center',
        borderRadius: 60,
    },
    adjustTimer: {
        backgroundColor: 'white',
        padding: 20,
        paddingLeft: 30,
        paddingRight: 30,  
        alignItems: 'center',
        borderRadius: 60,
    },
    timerIcon: {
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 30
    },
    done: {
        backgroundColor: 'white',
        padding: 25,
        alignItems: 'center',
        borderRadius: 60,
        marginTop: 10
    },
    modal: {
        backgroundColor: "white", 
        padding: 40,
        marginLeft: 40,
        marginRight: 40,
        borderRadius: 40, 
        alignItems: 'center',
        marginBottom:5,
    },
    closebutton: {
        backgroundColor: "#9AD3BB", 
        padding: 10,
        borderRadius: 20, 
        marginLeft: 45,
        marginRight: 2,
        marginTop: 2,
        flex: 1
    },
    nextstepbutton: {
        backgroundColor: "#9AD3BB", 
        padding: 10,
        borderRadius: 20, 
        marginLeft: 2,
        marginRight: 45,
        marginTop: 2,
        flex: 1
    },
});

export default TimerAndTTS;
