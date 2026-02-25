// import React, { useEffect, useRef, useState } from "react";
// import { View, Button } from "react-native";
// import { socket } from "../services/socket";
// import CallScreen from "../pages/CallScreen";
// import {
//   createPeer,
//   getLocalStream,
//   addIceCandidate,
//   setRemoteDescription,
// } from "../services/webrtc";

// const ROOM_ID = "test-room";

// export default function ChatScreen() {
//   const [inCall, setInCall] = useState(false);
//   const [localStream, setLocalStream] = useState<any>(null);
//   const [remoteStream, setRemoteStream] = useState<any>(null);
//   const peerRef = useRef<any>(null);

//   useEffect(() => {
//     socket.on("offer", async (offer) => {
//       peerRef.current = createPeer();
//       const stream = await getLocalStream();
//       setLocalStream(stream);

//       stream.getTracks().forEach((track) =>
//         peerRef.current.addTrack(track, stream)
//       );

//       peerRef.current.ontrack = (event: any) => {
//         setRemoteStream(event.streams[0]);
//       };

//       await peerRef.current.setRemoteDescription(offer);
//       const answer = await peerRef.current.createAnswer();
//       await peerRef.current.setLocalDescription(answer);

//       socket.emit("answer", { roomId: ROOM_ID, answer });
//       setInCall(true);
//     });

//     socket.on("answer", async (answer) => {
//       await peerRef.current.setRemoteDescription(answer);
//     });

//     socket.on("ice-candidate", async (candidate) => {
//       await addIceCandidate(candidate);
//     });
//   }, []);

//   const startCall = async () => {
//     socket.emit("join-room", ROOM_ID);

//     peerRef.current = createPeer();
//     const stream = await getLocalStream();
//     setLocalStream(stream);

//     stream.getTracks().forEach((track) =>
//       peerRef.current.addTrack(track, stream)
//     );

//     peerRef.current.ontrack = (event: any) => {
//       setRemoteStream(event.streams[0]);
//     };

//     peerRef.current.onicecandidate = (event: any) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           roomId: ROOM_ID,
//           candidate: event.candidate,
//         });
//       }
//     };

//     const offer = await peerRef.current.createOffer();
//     await peerRef.current.setLocalDescription(offer);

//     socket.emit("offer", { roomId: ROOM_ID, offer });

//     setInCall(true);
//   };

//   const joinCall = () => {
//     socket.emit("join-room", ROOM_ID);
//   };

//   if (inCall) {
//     return (
//       <CallScreen
//         localStream={localStream}
//         remoteStream={remoteStream}
//         onEnd={() => setInCall(false)}
//       />
//     );
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: "center" }}>
//       <Button title="Start Call" onPress={startCall} />
//       <Button title="Join Call" onPress={joinCall} />
//     </View>
//   );
// }


import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChatScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Chat Screen</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});