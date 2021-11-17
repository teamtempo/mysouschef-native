import React, { useRef, useEffect,useState } from 'react'
import { Animated, StyleSheet, View, FlatList, Dimensions, Text, ScrollView, Button } from 'react-native';
import { useRecoilState } from 'recoil';
import { stepsState } from '../atoms/Steps';
import TimerAndTTS from './CurrentStep Components/TimerAndTTS';
import { PorcupineManager } from '@picovoice/porcupine-react-native';
import Voice from '@react-native-voice/voice';
import { voiceResults } from '../atoms/VoiceResults';

function CurrentStep() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const {width, height} = Dimensions.get('screen');
    const [steps, setSteps] = useRecoilState(stepsState);
    //stores the results from the speech recognition    
    const [voiceResultsState, setVoiceResultsState] = useRecoilState(voiceResults);
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const [blueberry, setBlueberry ]= useState("");
    //console.log(steps)

    //checking on the speech service
    useEffect(async() => {
        console.log("voice check:", await Voice.getSpeechRecognitionServices());
        console.log("voice check:", await Voice.isAvailable());
    },[]);

    //VOICE RECOGNITION SECTION
    useEffect(() => {
        Voice.onSpeechStart = onSpeechStartHandler;
        Voice.onSpeechEnd = onSpeechEndHandler;
        Voice.onSpeechResults = onSpeechResultsHandler;
        Voice.onSpeechError = onSpeechError;
        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        }
      }, [])

      const onSpeechStartHandler = (e) => {
        console.log("start handler==>>>", e)
      }
      const onSpeechEndHandler = (e) => {
        setLoading(false)
        setBlueberry("");
        console.log("stop handler", e)
      }

      const onSpeechError = (e) => {
        console.log('onSpeechError: ', e);
        addListener();
        setError({
          error: JSON.stringify(e.error),
        });
      };
    
      //add functionality here to call the function that will deal with the relevant action
      const onSpeechResultsHandler = (e) => {
        let text = e.value[0]
        setVoiceResultsState(text)
        addListener();
        console.log("speech result handler", e)
      }
    
      const startRecording = async () => {
        setBlueberry("listening");
        setLoading(true)
        try {
            stopListener();
            await Voice.start('en-UK',{ RECOGNIZER_ENGINE: 'GOOGLE' })
        } catch (error) {
            console.log("error raised", error)
        }
      }
    
      const stopRecording = async () => {
        try {
          await Voice.stop()
          console.log("stop")
        } catch (error) {
          console.log("error raised", error)
        }
      }

    //VOICE RECOGNITION END

    let porcupineManager;

    async function createPorcupineManager() {
        try {
          
          porcupineManager = await PorcupineManager.fromKeywords(
            ["blueberry"],
            detectionCallback)
            addListener();
            console.log(porcupineManager);
            console.log("porcupine started")
    
        } catch(err) {
          console.log(err);
        }
      }
    
      function detectionCallback(keyWordIndex) {
        if(keyWordIndex === 0) {
          console.log("blueberry detected")
          startRecording();
        } else if (keyWordIndex === 1) {
          console.log("FUCK YOU porcupines")
        }
      }
    
      async function addListener() {
        await porcupineManager.start();
        console.log("started")
      }
    
      async function stopListener() {
        await porcupineManager.stop();
        console.log("stopped")
       
      }
    
      async function removeListeners() {
        await porcupineManager.delete();
        console.log("deleted")
      }

    useEffect(() => {
        createPorcupineManager();
        return () => {
            removeListeners();
    }
    }, [])
       
    const bgs = ['#F5CA82', '#F4E7A0', '#E7B25A', '#E18B52', '#F5CA82'];

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
    
    return (
        <View style={styles.container}>
            <Backdrop scrollX={scrollX}/>
            <Square scrollX={scrollX}/>
            <Animated.FlatList data={steps}
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
            renderItem={({item}) => {
                return (
                    <View style={{width, alignItems: 'center'}}>
                        <View style={{ flex: 0.3, justifyContent: 'center'}}>
                            <Text style={{color:'#000000'}}>{blueberry}</Text>
                            <Text style={styles.stepInd}> Step { item.step } of {steps.length} </Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <ScrollView>
                            <Text style={styles.deets}> { item.details }</Text>
                            </ScrollView>
                        </View>
                        <TimerAndTTS step={item.step} instructions={item.details} time={item.timer}/>
                    </View>
                )
            }}/>
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
    }
});

export default CurrentStep