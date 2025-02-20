import React, { useEffect, useState } from 'react';

import { Image, StyleSheet, Linking, View, Text, Button, ScrollView } from 'react-native';

import axios from 'axios';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [messages, setMessages] = useState([{ sender: 'Kapenga', text: 'Aguardando...' }]);
  const [isSleeping, setIsSleeping] = useState(false);

  // Substituir com o IP do ESP32 (IP local)
  const esp32Url = 'http://192.168.x.x';

  useEffect(() => {
    const checkSleepStatus = async () => {
      try {
        const response = await axios.get(esp32Url);
        if (response.data === 'sono_detectado') {
          setIsSleeping(true);
          addMessage('Sonolência detectada');
          playGasolina();
        } else {
          setIsSleeping(false);
          addMessage('Batimentos ok');
        }
      } catch (error) {
        console.error("Erro ao conectar com o ESP32:", error);
      }
    };

    const interval = setInterval(checkSleepStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const addMessage = (text: string) => {
    setMessages(prevMessages => [...prevMessages, { sender: 'Kapenga', text }]);
  };

  const playGasolina = () => {
    const spotifyUrl = 'https://open.spotify.com/track/228BxWXUYQPJrJYHDLOHkj?autoplay=true';
    Linking.openURL(spotifyUrl).catch(err => console.error('Erro ao abrir o Spotify:', err));
  };
  
  return (
    <ParallaxScrollView headerImage={undefined} headerBackgroundColor={{
      dark: '',
      light: ''
    }}      //headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} headerImage={undefined}      // headerImage={
      //   <Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo} />
      // }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Acorda FDP!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageBubble}>
            <Text style={styles.sender}>{msg.sender}:</Text>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Tocar Gasolina" onPress={playGasolina} />
      </View>
    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatContainer: {
    maxHeight: 300,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    margin: 10,
  },
  messageBubble: {
    backgroundColor: '#d1e7ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  sender: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  buttonContainer: {
    margin: 20,
    alignItems: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
