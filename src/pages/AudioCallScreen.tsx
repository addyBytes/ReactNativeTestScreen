//audio calling screen IT works on the concept of P2p connection via same host or stun sever ip exchange [STUN SERVER IS MIDDLE SERVER WHICH EXCHANGES IP OF BOTH DEVICES ID IF NOT CONNECTED ON SAME WIFI FOR UPD TRANSFER ] and for multiuser i have user TURN server which are the external servers which connects 3 or more devices.

//I THINK The backend of audio and video crashes cuz of same socket idk not tested so check for that too


//ALTERNATIVE FOR TURN SERVERS
// 1.SFU (Selective Forwarding Unit) – Most Common Alternative
// 2.MCU (Multipoint Control Unit)



//SFU is better — it scales efficiently for multi-user calls with lower server load and real-time performance.

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";
import socket from "../services/socket";

const { width, height } = Dimensions.get("window");

const configuration = {
  iceServers: [
    { urls: "stun:stun.relay.metered.ca:80" },
    {
      urls: [
        "turn:global.relay.metered.ca:80",
        "turn:global.relay.metered.ca:80?transport=tcp",
        "turn:global.relay.metered.ca:443",
        "turns:global.relay.metered.ca:443?transport=tcp",
      ],
      username: "d071ee907289677b708cbaed",
      credential: "B9WclnyeR1E+sG90",
    },
  ],
};

const EMOJIS = ["❤️", "😂", "👏", "🔥", "😮"];

export default function AudioCallScreen({ route, navigation }: any) {
  const { roomId } = route.params;

  const peers = useRef<any>({});
  const localStream = useRef<any>(null);
  const lastEmojiTime = useRef<number>(0);

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<any[]>([]);

  useEffect(() => {
    init();

    socket.on("audio-existing-users", async (users) => {
      for (let userId of users) {
        await createPeer(userId, true);
      }
    });

    socket.on("audio-offer", async ({ from, offer }) => {
      const pc = await createPeer(from, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("audio-answer", { to: from, answer });
    });

    socket.on("audio-answer", async ({ from, answer }) => {
      const pc = peers.current[from];
      if (!pc) return;

      if (pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on("audio-ice-candidate", async ({ from, candidate }) => {
      const pc = peers.current[from];
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch {}
      }
    });

    socket.on("audio-user-left", (userId) => {
      if (peers.current[userId]) {
        peers.current[userId].close();
        delete peers.current[userId];
      }
    });

    socket.on("emoji-reaction", ({ emoji }) => {
      triggerFloatingEmoji(emoji);
    });

    return () => cleanup();
  }, []);

  const init = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );

    InCallManager.start({ media: "audio" });

    localStream.current = await mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    socket.emit("join-audio-room", roomId);
  };

  const createPeer = async (
    userId: string,
    initiator: boolean
  ) => {
    if (peers.current[userId]) return peers.current[userId];

    const pc = new RTCPeerConnection(configuration);
    peers.current[userId] = pc;

    localStream.current.getTracks().forEach((track: any) => {
      pc.addTrack(track, localStream.current);
    });

    pc.oniceconnectionstatechange = () => {
      console.log(
        "ICE STATE WITH",
        userId,
        ":",
        pc.iceConnectionState
      );
    };

    pc.onconnectionstatechange = () => {
      console.log(
        "CONNECTION STATE WITH",
        userId,
        ":",
        pc.connectionState
      );
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(
          "CANDIDATE:",
          event.candidate.candidate
        );

        socket.emit("audio-ice-candidate", {
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    if (initiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("audio-offer", {
        to: userId,
        offer,
      });
    }

    return pc;
  };

  const toggleMute = () => {
    localStream.current?.getAudioTracks().forEach((track: any) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    const newState = !isSpeakerOn;
    setIsSpeakerOn(newState);
    InCallManager.setForceSpeakerphoneOn(newState);
  };

  const sendEmoji = (emoji: string) => {
    const now = Date.now();
    if (now - lastEmojiTime.current < 500) return;

    lastEmojiTime.current = now;

    triggerFloatingEmoji(emoji);
    socket.emit("emoji-reaction", { roomId, emoji });

    setShowEmojiPicker(false);
  };

  const triggerFloatingEmoji = (emoji: string) => {
    const id = Date.now() + Math.random();

    const translateY = new Animated.Value(0);
    const translateX = new Animated.Value(
      Math.random() * (width - 100) - width / 2 + 50
    );
    const scale = new Animated.Value(0.5);

    const newEmoji = { id, emoji, translateY, translateX, scale };
    setFloatingEmojis((prev) => [...prev, newEmoji]);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -height,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFloatingEmojis((prev) =>
        prev.filter((item) => item.id !== id)
      );
    });
  };

  const cleanup = () => {
    Object.values(peers.current).forEach((pc: any) =>
      pc.close()
    );
    peers.current = {};

    localStream.current?.getTracks().forEach((t: any) =>
      t.stop()
    );

    InCallManager.stop();
  };

  const endCall = () => {
    cleanup();
    socket.emit("audio-leave", roomId);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Audio Call Room: {roomId}
      </Text>

      {floatingEmojis.map((item) => (
        <Animated.Text
          key={item.id}
          style={[
            styles.floatingEmoji,
            {
              transform: [
                { translateY: item.translateY },
                { translateX: item.translateX },
                { scale: item.scale },
              ],
            },
          ]}
        >
          {item.emoji}
        </Animated.Text>
      ))}

      {showEmojiPicker && (
        <View style={styles.emojiPicker}>
          {EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => sendEmoji(emoji)}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.buttons}>
        <Button
          title={isMuted ? "Unmute" : "Mute"}
          onPress={toggleMute}
        />
        <Button
          title={isSpeakerOn ? "Speaker Off" : "Speaker On"}
          onPress={toggleSpeaker}
        />
        <Button
          title="😊"
          onPress={() =>
            setShowEmojiPicker(!showEmojiPicker)
          }
        />
        <Button
          title="End Call"
          color="red"
          onPress={endCall}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  emojiPicker: {
    position: "absolute",
    bottom: 120,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },
  emoji: {
    fontSize: 28,
    marginHorizontal: 8,
  },
  floatingEmoji: {
    position: "absolute",
    bottom: 100,
    fontSize: 40,
  },
});