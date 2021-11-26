import {useRecoilState, useRecoilValue} from 'recoil';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from 'react'
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, View, Keyboard, Image, TouchableWithoutFeedback, KeyboardAvoidingView, PermissionsAndroid, ActivityIndicator, Text, TouchableOpacity, Linking } from 'react-native';

import Instructions from './Dashboard Components/Instructions';
import PasteLink from './Dashboard Components/PasteLink';
import History from './Dashboard Components/History';

import { loading } from '../atoms/Loading';
import { pastLinks } from '../atoms/PastLinks';
import { micPermission } from '../atoms/MicPermission';
import { linkUpdate } from '../atoms/LinkUpdate';
import { errorModal } from '../atoms/ErrorModal';

function Dashboard({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [pastLinksState, setPastLinksState] = useRecoilState(pastLinks);
    const [linkUpdated, setLinkUpdated] = useRecoilState(linkUpdate);
    const [isError, setIsError] = useRecoilState(errorModal);
    const [micPermissionState, setMicPermissionState] = useRecoilState(micPermission);
    const isLoading = useRecoilValue(loading);

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
    
    async function getData() {
      try {
        AsyncStorage.getAllKeys()
        .then((keys)=> AsyncStorage.multiGet(keys)
            .then((data) => {
              let stuff = data.map((link) => {
                const dataArr = JSON.parse(link[1]);
                return ({ key: link[0], value: dataArr[0], time: `${dataArr[1]}` })
              }).filter(obj => obj.key !== 'showInstructions')
              stuff = stuff.sort((a,b) => new Date(b.time) - new Date(a.time) )
            setPastLinksState(stuff)
            }).catch(error => console.log(error)) 
          )
        } catch {
            console.log(error)
        }
    }

    function show() {
      pastLinksState.forEach(link => {
        console.log(link.value, (link.time))
      })
    }

    useEffect(() => {
      if (linkUpdated) {
        getData();
        setLinkUpdated(false);
      }
    }, [linkUpdated]);

      
    useEffect(() => {
      requestAudioPermission();
      console.log(isLoading)
    }, []);

    const logo = { uri: 'https://i.ibb.co/SyzsG9g/My-Sous-Chef-removebg-preview.png'}
    return (
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
      }}>
      <KeyboardAvoidingView behavior="position" style={styles.container}>
        <Modal isVisible={isError[0]} backdropOpacity={0.3} onBackdropPress={() => setIsError([false,""])}>
          <View style={styles.modal}>
              <Text style={{fontSize:22, fontWeight: 'bold', color: 'black'}}>{isError[1]}</Text>
          </View>
          <View style={styles.modalButton}>
          <TouchableOpacity onPress={() => setIsError([false,""])}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}} >Close</Text>
          </TouchableOpacity>
          </View>           
      </Modal>  

          {!isLoading ? null : ( 
              <View style={styles.activityIndicator}>
                <Text style={{ fontSize:20 }}>Loading Recipe {isLoading}</Text>
                <ActivityIndicator style={{height:100}} size={75} />
              </View>
            )}
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
                      <History navigation={navigation}/>
                  </View>
                  <View style={{paddingTop: 10}}>
                    <Text onPress={() => setModalVisible(true)} style={{color: "#F3EAC2"}}> © Team Tempo 2021 </Text>
                  </View>
              </View>
          </View>
          <Modal isVisible={modalVisible} backdropOpacity={0.5} onBackdropPress={() => setModalVisible(false)}>
            <View style={styles.modal}>
                <Text style={styles.modalHeading}>About Us</Text>
              <Text style={styles.modalDescription}>MySousChef was developed by Team Tempo for their senior project whilst at Code Chrysalis - a full stack coding bootcamp in Tokyo.</Text>
              <Text style={styles.modalTeamHeading}>Team Tempo</Text>

                <View style={styles.modelMemberSet}>
                  <Text style={styles.modalMember}>•   Kimiko Escovilla</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/kimikoescovilla/')}>
                    <Icon name="linkedin-square" size={30} color="#9AD3BB"/>
                  </TouchableOpacity>
                </View>
                <View style={styles.modelMemberSet}>
                  <Text style={styles.modalMember}>•   Valters Klauze</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://github.com/valch1992')}>
                    <Icon name="github-square" size={30} color="#9AD3BB"/>
                  </TouchableOpacity>
                </View>
                <View style={styles.modelMemberSet}>
                  <Text style={styles.modalMember}>•   James Balcombe</Text>
                  <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/CodeWithMrB')}>
                    <Icon name="twitter-square" size={30} color="#9AD3BB"/> 
                  </TouchableOpacity>
                </View>

                <Text style={styles.modelFooter}>Feel free to get in touch with us!</Text>
            </View>
            <View style={styles.modalButton}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{color: '#fff', fontWeight: '900', fontSize: 20}}> Close </Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
        paddingTop: 30,
        paddingBottom: 30,
        borderBottomEndRadius: 60,
    },
    body: {  
        paddingTop: 10,
        backgroundColor: '#F5B463',
        alignItems: 'center',
        paddingBottom: 50,
        height: 400,
        borderTopStartRadius: 30
    },
    activityIndicator: {
      flex: 1,
      alignItems: 'center',
      justifyContent: "center",
      backgroundColor: 'rgba(52, 52, 52, 0.6)',
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 100
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
    },
    modal: {
      backgroundColor: '#fff',
      padding: 27,
      borderRadius: 30,
      alignItems: 'center'
    },
    modalHeading: {
      padding: 20,
      fontSize: 25,
      fontWeight: '600',
      color: 'black',
    },
    modalDescription: {
      fontSize: 15,
      textAlign: 'justify',
      color: 'black',
      paddingBottom: 15
    },
    modalTeamHeading: {
      fontSize: 20,
      paddingBottom: 10,
      fontWeight: '600',
      color: 'black',
    },
    modelMemberSet: {
      width: 200,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalMember: {
      color: 'black',
      fontSize: 15,
    },
    modelFooter: {
      paddingTop: 40,
      color: 'black',
      fontSize: 15
    },
    modalButton: {
      marginTop: 15,
      backgroundColor: '#F5B463',
      padding: 20,
      borderRadius: 30,
      alignItems: 'center'
    }
});

export default Dashboard;