import React, { useRef } from 'react'
import { Animated, StyleSheet, View, FlatList, Dimensions, Text, ScrollView } from 'react-native';
import { useRecoilState } from 'recoil';
import { stepsState } from '../atoms/Steps';
import TimerAndTTS from './CurrentStep Components/TimerAndTTS';

function CurrentStep() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const {width, height} = Dimensions.get('screen');
    const [steps, setSteps] = useRecoilState(stepsState);
    console.log(steps)

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
        fontSize: 35
    },
    deets: {
        fontSize: 20,
        marginBottom: 10,
        padding: 30
    }
});

export default CurrentStep