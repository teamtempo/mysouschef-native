import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ingredients from './Preview/Ingredients';
import Steps from './Preview/Steps';
import { PorcupineManager } from '@picovoice/porcupine-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRecoilState } from 'recoil';
import { instructionsModal } from '../atoms/InstructionsModal';
import { showInstructions } from '../atoms/ShowInstructions';
import Instructions from './Preview/Instructions';
import { continueClicked } from '../atoms/ContinueClicked';

import { voiceCommandInst } from '../atoms/VoiceCommandInst';


function Preview( { navigation } ) {
    const [atBottom, setAtBottom] = useState(false)
    const [currPos, setCurrPos] = useState();
    const [maxHeight, setMaxHeight] = useState();
    const scroll = useRef()

    const scrollToBottom = () => {
        scroll.current.scrollToEnd({animated: true})
        setAtBottom(true)
    }

    const scrollToTop = () => {
        scroll.current.scrollTo({y: 0, animated: true})
        setAtBottom(false)
    }

    const [showInst, setShowInst] = useRecoilState(showInstructions);
    const [modalVisible, setModalVisible] = useRecoilState(instructionsModal);
    const [continueClickedState, setContinueClickedState] = useRecoilState(continueClicked);
    const [inCurrStep, setInCurrStep] = useRecoilState(voiceCommandInst);

    useEffect(() => {
        if (continueClickedState) {
            navigation.navigate('CurrentStep');
            setContinueClickedState(false);
        }
    }, [continueClickedState])

    useEffect(() => {
        async function getData() {
            try {
              const showInts = await AsyncStorage.getItem('showInstructions')
              showInts === 'true' ? setShowInst(true) : setShowInst(false)
              } catch (error) {
                  console.log(error)
              }
          }
          getData();
    },[])

    return (
        
    <View style={styles.container}>
        <View style={styles.main}>
            <View style={styles.instructions}>
                <TouchableOpacity onPress={() => {setModalVisible(true), setInCurrStep(false)}} >
                    <Text style={{fontSize: 15, color: '#fff', textAlign:'center'}}>Instructions</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Recipe</Text>
        </View>
            <ScrollView
            ref={scroll}
            onScroll={e => setCurrPos(e.nativeEvent.contentOffset.y)}
            onContentSizeChange={(width, height) => {
                setMaxHeight(height)
            }}
            showsVerticalScrollIndicator={true}>
                <Ingredients />
                <Steps />
            </ScrollView>
        <View style={[styles.scrollView, styles.iconShadow]}>
            { atBottom || currPos > maxHeight / 4 ? 
            <TouchableOpacity onPress={scrollToTop}>
                <Icon name="arrow-circle-up" size={55} color="#fff"/>
            </TouchableOpacity>
            : 
            <TouchableOpacity onPress={scrollToBottom}>
                <Icon name="arrow-circle-down" size={55} color="#fff"/>
            </TouchableOpacity>
            } 
        </View>
        <View style={styles.main}>
            <TouchableOpacity onPress={() => showInst ? (setModalVisible(true), setInCurrStep(false)) : setContinueClickedState(true)} style={styles.button}>
                <Text style={{fontSize: 25, fontWeight: '900', color: 'white'}}>Start</Text>
            </TouchableOpacity>
            <Instructions continueClicked={continueClicked}/>
        </View>
    </View>
    );

}
          
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3EAC2',
        justifyContent: 'center',
    },
    main: {
        backgroundColor: '#F5B463'
    }, 
    title: {
        fontSize: 30,
        fontWeight: '900',
        paddingTop: 20,
        padding: 10,
        textAlign: 'center',
        color: 'white'
    },
    instructions: {
        zIndex:100,
        position: 'absolute',
        backgroundColor: "#9AD3BB",
        alignItems: 'center',
        justifyContent:'center',
        borderRadius: 40,
        width: 95,
        height: 45,
        bottom: 10,
        right: 10,
    },
    button: {
        alignItems: "center",
        padding: 15,
    },
    bgImage: {
        flex: 1,
        justifyContent: "center"
    },
    scrollView: {
        position: 'absolute',
        backgroundColor: "#9AD3BB",
        alignItems: 'center',
        borderRadius: 40,
        width: 55,
        bottom: 70,
        right: 10,
    },
    iconShadow: {
        elevation: 10,
        shadowColor: '#171717',
        shadowOpacity: 10,
        shadowRadius: 3,    
    },
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

export default Preview;
