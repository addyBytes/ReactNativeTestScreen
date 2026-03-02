import "react-native-url-polyfill/auto";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import {
  LiveKitRoom,
  useTracks,
  VideoTrack,
} from "@livekit/react-native";
import { Track } from "livekit-client";

interface Props {
  roomName: string;
  onEnd: () => void;
}

export default function CallScreen({ roomName, onEnd }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const response = await fetch(
      "https://YOUR_NGROK_OR_DEPLOY_URL/get-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: roomName,
          identity: Math.random().toString(36).substring(7),
        }),
      }
    );

    const data = await response.json();
    setToken(data.token);
  };

  if (!token) return null;

  return (
    <LiveKitRoom
      serverUrl="wss://vc-iflnvq5g.livekit.cloud"
      token={token}
      connect={true}
      video={true}
      audio={true}
      style={{ flex: 1 }}
    >
      <RoomContent onEnd={onEnd} />
    </LiveKitRoom>
  );
}

function RoomContent({ onEnd }: { onEnd: () => void }) {
  const tracks = useTracks([Track.Source.Camera]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.participant.identity}
        renderItem={({ item }) => (
          <VideoTrack
            trackRef={item}
            style={styles.video}
          />
        )}
      />

      <TouchableOpacity style={styles.end} onPress={onEnd}>
        <Text style={{ color: "white" }}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { height: 250, marginBottom: 10 },
  end: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "red",
    padding: 15,
    borderRadius: 30,
  },
});