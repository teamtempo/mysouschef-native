import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ingredients from './Preview/Ingredients';
import Steps from './Preview/Steps';
import { PorcupineManager } from '@picovoice/porcupine-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Preview( { navigation } ) {
    const [atBottom, setAtBottom] = useState(false)
    const [currPos, setCurrPos] = useState();
    const scroll = useRef()

    useEffect(() => {
        console.log(currPos)
    }, [currPos])

    const scrollToBottom = () => {
        scroll.current.scrollToEnd({animated: true})
        setAtBottom(true)
    }

    const scrollToTop = () => {
        scroll.current.scrollTo({y: 0, animated: true})
        setAtBottom(false)
    }

    return (
    <View style={styles.container}>
        <View style={styles.main}>
            <Text style={styles.title}>Recipe</Text>
        </View>
            <ScrollView
            ref={scroll}
            onScroll={e => setCurrPos(e.nativeEvent.contentOffset.y)}
            showsVerticalScrollIndicator={true}>
                <Ingredients />
                <Steps />
            </ScrollView>
        <View style={[styles.scrollView, styles.iconShadow]}>
            { atBottom || currPos > 1550 ? 
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
            <TouchableOpacity onPress={() => navigation.navigate('CurrentStep')} style={styles.button}>
                <Text style={{fontSize: 25, fontWeight: '900', color: 'white'}}>Start</Text>
            </TouchableOpacity>
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
        paddingTop: 40,
        padding: 10,
        textAlign: 'center',
        color: 'white'
    },
    button: {
        alignItems: "center",
        padding: 15,
    },
    checkbox: {
        alignItems: "center",
        backgroundColor: "#D89B63",
        padding: 10
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
});

export default Preview;
