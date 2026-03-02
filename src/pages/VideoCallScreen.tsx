import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import CallScreen from "./CallScreen";

export default function VideoCallScreen() {
  const [roomName, setRoomName] = useState("");
  const [inCall, setInCall] = useState(false);

  if (inCall) {
    return (
      <CallScreen
        roomName={roomName}
        onEnd={() => setInCall(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LiveKit Video Call</Text>

      <TextInput
        placeholder="Enter Room Name"
        value={roomName}
        onChangeText={setRoomName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setInCall(true)}
      >
        <Text style={styles.buttonText}>Join Room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2e7dff",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});