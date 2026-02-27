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
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const EMOJIS = ["❤️", "😂", "👏", "🔥", "😮"];

export default function AudioCallScreen({ route, navigation }: any) {
  const { roomId, isCaller } = route.params;

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<any>(null);

  const lastEmojiTime = useRef<number>(0); // ⏱ anti overlap

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<any[]>([]);

  useEffect(() => {
    init();

    socket.on("emoji-reaction", ({ emoji }) => {
      triggerFloatingEmoji(emoji);
    });

    return () => {
      cleanup();
      socket.off("emoji-reaction");
    };
  }, []);

  const init = async () => {
    await startAudio();
    socket.emit("join-audio-room", roomId);

    socket.on("audio-user-joined", async () => {
      if (isCaller) await createOffer();
    });

    socket.on("audio-offer", async ({ offer }) => {
      if (!offer) return;

      await pc.current?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await pc.current?.createAnswer();
      if (!answer) return;

      await pc.current?.setLocalDescription(answer);
      socket.emit("audio-answer", { roomId, answer });
    });

    socket.on("audio-answer", async ({ answer }) => {
      if (!answer) return;

      await pc.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("audio-ice-candidate", async ({ candidate }) => {
      if (!candidate) return;
      try {
        await pc.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch {}
    });
  };

  const startAudio = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;

    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(false);

    localStream.current = await mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    pc.current = new RTCPeerConnection(configuration);

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("audio-ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    localStream.current.getTracks().forEach((track: any) => {
      pc.current?.addTrack(track, localStream.current);
    });
  };

  const createOffer = async () => {
    if (!pc.current) return;
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit("audio-offer", { roomId, offer });
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

  // 🔥 EMOJI SEND WITH 500ms DELAY CONTROL
  const sendEmoji = (emoji: string) => {
    const now = Date.now();

    if (now - lastEmojiTime.current < 500) return; // prevent spam overlap
    lastEmojiTime.current = now;

    triggerFloatingEmoji(emoji);
    socket.emit("emoji-reaction", { roomId, emoji });

    setShowEmojiPicker(false);
  };

  // 🔥 ADVANCED FLOATING ANIMATION
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
    pc.current?.close();
    pc.current = null;
    localStream.current?.getTracks().forEach((t: any) => t.stop());
    InCallManager.stop();
  };

  const endCall = () => {
    cleanup();
    socket.emit("audio-leave", roomId);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Call Room: {roomId}</Text>

      {/* Floating Emojis */}
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

      {/* Emoji Picker */}
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
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <Button title="End Call" color="red" onPress={endCall} />
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