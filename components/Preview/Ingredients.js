import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil';
import { ingredientsState } from '../../atoms/Ingredients';
import { Transition, Transitioning } from 'react-native-reanimated';

const transition = (
    <Transition.Together>
        <Transition.In type="fade" durationMs={200} />
        <Transition.Change/>
        <Transition.Out type="fade" durationMs={200}/>
    </Transition.Together>
)

const Ingredients = () => {
    const [isPressed, setIsPressed] = useState(false);
    const ref = useRef();
    const ingredientsList = useRecoilValue(ingredientsState);

    return (
        <Transitioning.View 
            ref={ref}
            transition={transition}
            style={styles.container} 
        >
           <TouchableOpacity 
            style={styles.cardContainer} 
            activeOpacity={0.9} 
            onPress={() => {
                ref.current.animateNextTransition();
                setIsPressed(!isPressed)
            }
            }>
               <View style={styles.card}>
                   <Text style={styles.heading}> Ingredients </Text>
               </View>
               { isPressed && (
                <View style={styles.list}>
                   {ingredientsList.ingredients.map((item, index) => {
                       return (
                             <Text key={index} style={styles.listText}> { item } </Text>
                       )
                   })}
               </View>
               )}
           </TouchableOpacity>
        </Transitioning.View>
    )
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        padding: 20,
    },
    cardContainer: {
        flexGrow: 1,
        backgroundColor: '#9AD3BB',
        borderRadius: 30,
        padding: 15,
        overflow: 'hidden'
    },
    card: {
        flexGrow: 1,
        padding: 10
    },
    heading: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "900"
    },
    list: {
        paddingTop: 15,
    },
    listText: {
        color: 'black',
        fontSize: 15,
        lineHeight: 20 * 1.5,
    }
})

export default Ingredients