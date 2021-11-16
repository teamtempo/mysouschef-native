import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';

import say from '../../helpers/tts-helper';

import { voiceResults } from '../../atoms/VoiceResults';

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
}

const TimerAndTTS = ({step, instructions, time}) => {
    const [remainingSecs, setRemainingSecs] = useState(time);
    const [isActive, setIsActive] = useState(false);
    const { minutes, seconds } = getRemaining(remainingSecs);
    const [voiceResultsState, setVoiceResultsState] = useRecoilState(voiceResults);

    useEffect(() => {
        if (voiceResultsState === "stop") {
            stopTimer();
            setVoiceResultsState("");
        }
        if (voiceResultsState === "start") {
            startTimer();
            setVoiceResultsState("");
        
    }},[voiceResultsState]);



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
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 70, color: '#000000'}}>{`${minutes}:${seconds}`}</Text>
                <Text style={{fontSize: 20, color: '#000000'}}>minutes    seconds</Text>
            </View>

            <View style={{flex: 0.6, marginTop: 40}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingLeft: 50, paddingRight: 50}}>
                    <TouchableOpacity style={styles.timerIcon} onPress={subtractTime}>
                        <Text style={{fontSize: 20}}> - </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.adjustTimer} onPress={resetTimer}>
                        <Text style={{fontSize: 15, color: '#000000'}}> Reset </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timerIcon} onPress={addTime}>
                        <Text style={{fontSize: 20, color: '#000000'}}> + </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 7 }}>
                    <TouchableOpacity style={styles.resumebtn} onPress={toggleTimer}>
                        { isActive ?  <Text style={{fontSize: 15, color: '#000000'}}> Pause </Text> :  <Text style={{fontSize: 15, color: '#000000'}}> Resume </Text> }
                    </TouchableOpacity>
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
        backgroundColor: '#9AD3BB',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 40
    }
});

export default TimerAndTTS;
