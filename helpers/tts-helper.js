import Tts from 'react-native-tts';

export default function say(text) {
    Tts.getInitStatus().then(() => {
        Tts.speak(text)
    })
}