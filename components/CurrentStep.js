import React, { useRef, useEffect, useCallback } from 'react'
import { Animated, StyleSheet, View, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRecoilState } from 'recoil';
import { stepsState } from '../atoms/Steps';
import TimerAndTTS from './CurrentStep Components/TimerAndTTS';
import Voice from '@react-native-voice/voice';
import { currentStepIndex } from '../atoms/CurrentStepIndex';
import { onSpeechStartHandler, onSpeechEndHandler, onSpeechError, onSpeechResultsHandler, createPorcupineManager, removeListeners } from '../helpers/voice-helper';

import { voiceCommandInst } from '../atoms/VoiceCommandInst';
import { instructionsModal } from '../atoms/InstructionsModal'; 

import Icon from 'react-native-vector-icons/FontAwesome';

function CurrentStep({ navigation }) {
    const [currentIndex, setCurrentIndex] = useRecoilState(currentStepIndex);
    const scrollX = useRef(new Animated.Value(0)).current;
    const {width, height} = Dimensions.get('screen');

    const [inCurrStep, setInCurrStep] = useRecoilState(voiceCommandInst);
    const [showInst, setShowInst] = useRecoilState(instructionsModal);


    const [steps, setSteps] = useRecoilState(stepsState);
    const flatListRef = useRef();

    useEffect(() => {   
        Voice.onSpeechStart = onSpeechStartHandler;
        Voice.onSpeechEnd = onSpeechEndHandler;
        Voice.onSpeechResults = onSpeechResultsHandler;
        Voice.onSpeechError = onSpeechError;
        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        }
      }, [])

    useEffect(() => {
        createPorcupineManager();
    },[])

       
    const bgs = ['#F5CA82', '#F4E7A0', '#E7B25A', '#E18B52', '#F5CA82', '#F4E7A0', '#E7B25A', '#E18B52'];

    const Indicator=({scrollX}) => {
        return <View style={{position: 'absolute', bottom: 80, flexDirection: 'row'}}>
            {steps.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8, 1.4, 0.8],
                    extrapolate: 'clamp'
        
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 0.9, 0.6],
                    extrapolate: 'clamp'
        
                });
                return <Animated.View 
                key={`indicator-${i}`}
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                    opacity,
                    margin: 5,
                    transform: [
                        {
                            scale
                        }
                    ]
                }}/>
            })}
        </View>
    }

    const Backdrop = ({scrollX}) => {
        const backgroundColor = scrollX.interpolate({
            inputRange: bgs.map((_, i) => i * width),
            outputRange: bgs.map((bg) => bg)

        });
        return (
        <Animated.View
            style={[
                StyleSheet.absoluteFillObject,
            {
                backgroundColor,
            }
        ]}/>
        )
    }

    const Square = ({scrollX}) => {
        const YOLO = Animated.modulo(
            Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)), 1);

        const rotate = YOLO.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['35deg', '-35deg', '35deg']
        })
        
        return <Animated.View
        style={{
            width: height, 
            height: height, 
            backgroundColor: 'white', 
            borderRadius: 86, 
            position: 'absolute',
            top: -height * 0.6,
            left: -height * 0.3,
            transform: [
                {
                    rotate,
                }
            ]
        }}/>
    }   

    const scrollToIndex = (i) => {
        flatListRef.current.scrollToIndex({index: i});
    }

    const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        setCurrentIndex(viewableItems[0].index)
      },[]);

    const _viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    }
    
    return (
        <View style={styles.container}>
            <Backdrop scrollX={scrollX}/>
            <Square scrollX={scrollX}/>
            <Animated.FlatList 
            data={steps}
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={_viewabilityConfig}
            ref={flatListRef}
            keyExtractor={item => item.step}
            horizontal
            scrollEventThrottle={32}
            onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {useNativeDriver: false}
                )}
            contentContainerStyle={{paddingBottom: 100}}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            renderItem={({item, index}) => {
                return (
                    <View style={{width, alignItems: 'center'}}>
                        <View style={{ flex: 0.3, justifyContent: 'center'}}>
                            <Text style={styles.stepInd}> Step { item.step } of {steps.length} </Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <ScrollView>
                            <Text style={styles.deets}> { item.details }</Text>
                            </ScrollView>
                        </View>
                        <TimerAndTTS navigation={navigation} step={item.step} instructions={item.details} time={item.timer} index={index} scrollToIndex={scrollToIndex}/>
                    </View>
                )
            }}/>
             <View>
                    <TouchableOpacity style={styles.instructions} onPress={() => {setInCurrStep(true), setShowInst(true)}}>
                        <Icon name="question-circle" size={40} color="#9AD3BB"/>
                    </TouchableOpacity>
                </View>
            <Indicator scrollX={scrollX}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepInd: {
        fontSize: 35,
        color: '#000000'
    },
    deets: {
        fontSize: 20,
        marginBottom: 10,
        padding: 30,
        color: '#000000'
    },
    instructions: {
        backgroundColor: '#fff',
        position: 'absolute',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        width: 40,
        bottom: 675,   
        left: 140,
        zIndex: 100
    }
});

export default CurrentStep