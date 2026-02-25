import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface Props {
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallScreen({ onAccept, onReject }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Incoming Call...</Text>
      <Button title="Accept" onPress={onAccept} />
      <Button title="Reject" onPress={onReject} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 20 },
});