import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import socket from '../services/socket';
import CallScreen from './CallScreen';

export default function VideoCallScreen() {
  const [roomId, setRoomId] = useState('');
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('room-created', (id: string) => {
      console.log('Room created:', id);
      setRoomId(id);
      setInCall(true);
    });

    return () => {
      socket.off('connect');
      socket.off('room-created');
    };
  }, []);

  const createRoom = () => {
    socket.emit('create-room', (id: string) => {
      setRoomId(id);
      setInCall(true);
    });
  };

  const joinRoom = () => {
    if (!roomId) return;
    setInCall(true);
  };

  if (inCall) {
    return <CallScreen roomId={roomId} onEnd={() => setInCall(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Video Call</Text>

      <TextInput
        placeholder="Enter Room ID"
        value={roomId}
        onChangeText={setRoomId}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={createRoom}>
        <Text style={styles.buttonText}>Create Room</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={joinRoom}>
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e7dff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});