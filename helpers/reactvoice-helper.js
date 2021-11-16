//NOT USED!

import React, { Component, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

import { voiceRecognitionState } from '../atoms/VoiceRecognitionState';
import { useRecoilState } from 'recoil';

function VoiceTest(props) {
  
  const [voiceState, setVoiceState] = useState(
    {
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
    }
    )
    //const [voiceRecog, setVoiceRecog] = useRecoilState(voiceRecognitionState);
    
    useEffect(() => {
      if(props.voiceRecog === "startRecog") {
        startRecognizing();
      }
      if(props.voiceRecog === "cancelRecog") {
        cancelRecognizing();
      }
  },[props.voiceRecog])
  
  useEffect(() => {
    Voice.getSpeechRecognitionServices()
    return () => { 
      componentWillUnmount();
    }
  },[])
  
  const componentWillUnmount =() => {
    Voice.destroy().then(Voice.removeAllListeners);
  }
  
  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
    setVoiceState({...voiceState, started: '√'});
  };
  
  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
    setVoiceState({...voiceState, recognized: '√'});
  };
  
  const onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
    setVoiceState({...voiceState, end: '√'});
  };
  
  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    setVoiceState({...voiceState, error: JSON.stringify(e)});
  };
  
  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    setVoiceState({...voiceState, results: e.value});
  };
  
  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResults: ', e);
    setVoiceState({...voiceState, partialResults: e.value});
  };
  
  const onSpeechVolumeChanged = (e: any) => {
    //console.log('onSpeechVolumeChanged: ', e);
    setVoiceState({...voiceState, pitch: e.value});
  };
  
  const startRecognizing = async () => {
    setVoiceState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    
    try {
      await Voice.start('en-US');
      console.log(voiceState)
    } catch (e) {
      console.error(e);
    }
  };
  
  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  
  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };
  
  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setVoiceState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
  };
  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechRecognized = onSpeechRecognized;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechPartialResults = onSpeechPartialResults;
  Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
  
  return (null)
}

export default VoiceTest;