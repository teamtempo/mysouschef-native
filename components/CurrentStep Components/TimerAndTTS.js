import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import Icon from 'react-native-vector-icons/FontAwesome';

import Tts from 'react-native-tts';

import say from '../../helpers/tts-helper';

import { voiceResults } from '../../atoms/VoiceResults';
import { stepsState } from '../../atoms/Steps';
import { currentStepIndex } from '../../atoms/CurrentStepIndex';



const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time % 60;
    return { hours: formatNumber(hours), minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
}



const TimerAndTTS = ({step, instructions, time, index, scrollToIndex}) => {
    const [currentIndex, setCurrentIndex] = useRecoilState(currentStepIndex);
    const [remainingSecs, setRemainingSecs] = useState(time);
    const [isActive, setIsActive] = useState(false);
    const { hours, minutes, seconds } = getRemaining(remainingSecs);
    const [voiceResultsState, setVoiceResultsState] = useRecoilState(voiceResults);
    const steps = useRecoilValue(stepsState);
    

    useEffect(() => {
        voiceController();
    },[voiceResultsState]);
    
    const voiceController = () => {
        if (currentIndex === index) {
            if (voiceResultsState.includes("stop timer")
            || voiceResultsState.includes("pause timer")
            || voiceResultsState.includes("pause")
            || voiceResultsState.includes("stop")) {
                say("timer stopped")
                stopTimer();
            } else if (voiceResultsState.includes("start") 
            || voiceResultsState.includes("go")
            || voiceResultsState.includes("start timer")
            || voiceResultsState.includes("begin timer")
            || voiceResultsState.includes("begin")
            || voiceResultsState.includes("resume")) {
                say("timer started")
                startTimer();
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
                subtractTime();
                
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
                    setCurrentIndex(index+1);
                    scrollToIndex(index + 1)
                    say(`step ${currentIndex}`)
                }
            } else if (voiceResultsState.includes("previous step")
            || voiceResultsState.includes("previous")) {
                if (index-1 >= 0) {
                    setCurrentIndex(index-1);
                    scrollToIndex(index - 1)
                    say(`step ${currentIndex}`)
                }
            } else if (voiceResultsState !== "") {
                say("I didnt understand the command, please try again");
            }
        
        }
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

    useEffect(() => {
        if (remainingSecs === 0) {
            setIsActive(false)
            alert("Timer is done!")
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
            <View style={{flex: 0.6, marginTop: 40}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingLeft: 50, paddingRight: 50}}>
                    <TouchableOpacity style={styles.timerIcon} onPress={subtractTime}>
                        <Icon name="minus-circle" size={40} color="#9AD3BB"/>
                    </TouchableOpacity>
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
                        <Text> No timer set </Text>
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
    }
});

export default TimerAndTTS;
