import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import socket from "../services/socket";
import { useNavigation } from "@react-navigation/native";

export default function AudioScreen() {
  const [roomId, setRoomId] = useState("");
  const navigation = useNavigation<any>();

  const createRoom = () => {
    socket.emit("create-audio-room", (id: string) => {
      navigation.navigate("AudioCallScreen", { roomId: id, isCaller: true });
    });
  };

  const joinRoom = () => {
    navigation.navigate("AudioCallScreen", { roomId, isCaller: false });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Call</Text>

      <Button title="Create Audio Room" onPress={createRoom} />

      <Text style={{ marginVertical: 10 }}>OR</Text>

      <TextInput
        placeholder="Enter Room ID"
        value={roomId}
        onChangeText={setRoomId}
        style={styles.input}
      />

      <Button title="Join Audio Room" onPress={joinRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
});