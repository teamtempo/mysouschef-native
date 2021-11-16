import {useRecoilState} from 'recoil';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from 'react'
import { StyleSheet, View, Keyboard, Image, TouchableWithoutFeedback, KeyboardAvoidingView, PermissionsAndroid, Button } from 'react-native';

import Instructions from './Dashboard Components/Instructions';
import PasteLink from './Dashboard Components/PasteLink';
import History from './Dashboard Components/History';

import { pastLinks } from '../atoms/PastLinks';
import { micPermission } from '../atoms/MicPermission';




function Dashboard({ navigation }) {
    const [pastLinksState, setPastLinksState] = useRecoilState(pastLinks);
    const [micPermissionState, setMicPermissionState] = useRecoilState(micPermission);
    let porcupineManager;

    async function requestAudioPermission() {
        try {
          
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: "Mysouschef microphone permission",
              message: "onegai",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setMicPermissionState(true);
            console.log("You can use the Microphone");
          } else {
            console.log("Microphone permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      };

      async function createPorcupineManager() {
        try {
          
          porcupineManager = await PorcupineManager.fromKeywords(
            ["blueberry", "porcupine"],
            detectionCallback)
            console.log(porcupineManager);
            console.log("porcupine started")
    
        } catch(err) {
          console.log(err);
        }
      }
    
      function detectionCallback(keyWordIndex) {
        if(keyWordIndex === 0) {
          console.log("blueberry detected")
        } else if (keyWordIndex === 1) {
          console.log("porcupine detected")
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
    

    async function getData() {
      try {
        AsyncStorage.getAllKeys()
        .then((keys)=> AsyncStorage.multiGet(keys)
            .then((data) => {
            setPastLinksState(data.map((link) => ({ key: link[0], value: link[1] })))
            }))
        } catch {
            console.log(error)
        }
    }

    useEffect(() => {
        getData();
      }, [pastLinksState]);

    useEffect(() => {
        requestAudioPermission();
        }, []);


  
    const logo = { uri: 'https://i.ibb.co/SyzsG9g/My-Sous-Chef-removebg-preview.png'}
    return (
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
            }}>
                <KeyboardAvoidingView
                behavior="position"
                style={styles.container}
                >
                    <View>
                        <View style={styles.header}>
                            <View style={styles.item}>
                                <Image source={logo} style={styles.logo}/>
                            </View>
                            <View style={styles.item}>
                                <Instructions />
                            </View>
                        </View>
                        <View style={{backgroundColor: '#F3EAC2'}}>
                            <View style={styles.body}>
                                <View style={styles.item}>
                                    <PasteLink navigation={navigation}/>
                                </View>
                                <View style={styles.item}>
                                    <History />
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        )
    }
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5B462'
    }, 
    header: {
        backgroundColor: '#F3EAC2',
        alignItems: 'center',
        paddingTop: 70,
        paddingBottom: 30,
        borderBottomEndRadius: 60,
    },
    body: {  
        paddingTop: 10,
        backgroundColor: '#F5B463',
        alignItems: 'center',
        paddingBottom: 50,
        height: 400,
        borderTopStartRadius: 60
    },
    item: {
        marginTop: 20,
    },
    bgImage: {
        flex: 1,
        justifyContent: "center"
    },
    logo: {
        width: 250,
        height: 150
    }
});

export default Dashboard;