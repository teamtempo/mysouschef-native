import { PorcupineManager } from '@picovoice/porcupine-react-native';
import { voiceResults } from '../atoms/VoiceResults';
import { promiseSetRecoil } from "recoil-outside"
import Voice from '@react-native-voice/voice';
import Sound from 'react-native-sound';


let porcupineManager

Sound.setCategory('Playback');

function blueberryDetectedSound() {
  var notification1 = new Sound('notification1.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + notification1.getDuration() + 'number of channels: ' + notification1.getNumberOfChannels());
      notification1.setVolume(1);
      // Play the sound with an onEnd callback
      notification1.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  
}


async function createPorcupineManager() {
    try {
      porcupineManager = await PorcupineManager.fromKeywords(
        ["blueberry", "porcupine"],
        detectionCallback);
        addListener()
        console.log(porcupineManager);
        console.log("porcupine started")
    } catch(err) {
      console.log(err);
    }
  }

function detectionCallback(keyWordIndex) {
  if(keyWordIndex === 0) {
    console.log("blueberry detected");
    blueberryDetectedSound();
    setTimeout(() => {
      startRecording();
    }, 500);
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

function onSpeechStartHandler(e) {
  console.log("start handler==>>>", e)
}

function onSpeechEndHandler(e) {
  console.log("stop handler", e)
}

async function onSpeechError(e) {
  console.log('onSpeechError: ', e);
  addListener();
};

async function onSpeechResultsHandler(e) {
  let text = e.value[0].toLowerCase();
  await promiseSetRecoil(voiceResults, text)
  addListener();
  console.log("speech result handler", e)
}

async function startRecording() {
  try {
      stopListener();
      await Voice.start('en-UK',{ RECOGNIZER_ENGINE: 'GOOGLE' })
  } catch (error) {
      console.log("error raised", error)
  }
}

async function stopRecording() {
  try {
    await Voice.stop()
    console.log("stop")
  } catch (error) {
    console.log("error raised", error)
  }
}

module.exports = {
  onSpeechStartHandler,
  onSpeechEndHandler,
  onSpeechError,
  onSpeechResultsHandler,
  createPorcupineManager,
  removeListeners,
}
