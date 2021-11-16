import { PorcupineManager } from '@picovoice/porcupine-react-native';

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

export { createPorcupineManager, addListener, stopListener, removeListeners, detectionCallback }