import { PorcupineManager } from '@picovoice/porcupine-react-native';
import { voiceResults } from '../atoms/VoiceResults';
import { promiseSetRecoil } from "recoil-outside"
import Voice from '@react-native-voice/voice';

let porcupineManager

async function createPorcupineManager() {
    try {
      porcupineManager = await PorcupineManager.fromKeywords(
        ["blueberry", "porcupine"],
        detectionCallback)
        addListener()
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
