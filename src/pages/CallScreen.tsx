import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCView,
  MediaStream,
} from 'react-native-webrtc';
import socket from '../services/socket';

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

interface Props {
  roomId: string;
  onEnd: () => void;
}

export default function CallScreen({ roomId, onEnd }: Props) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const isOfferCreated = useRef(false);

  useEffect(() => {
    startCall();
    return () => cleanup();
  }, []);

  const startCall = async () => {
    const stream = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);

    const pc = new RTCPeerConnection(configuration);
    peerConnection.current = pc;

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    pc.ontrack = event => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection State:', pc.connectionState);
    };

    registerSocketEvents();
    socket.emit('join-room', roomId);
  };

  const registerSocketEvents = () => {
    socket.off('user-joined');
    socket.off('offer');
    socket.off('answer');
    socket.off('ice-candidate');

    socket.on('user-joined', async () => {
      if (isOfferCreated.current) return;

      isOfferCreated.current = true;

      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      socket.emit('offer', { roomId, offer });
    });

    socket.on('offer', async (data: any) => {
      const offer = data.offer;

      await peerConnection.current!.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);

      socket.emit('answer', { roomId, answer });
    });

    socket.on('answer', async (data: any) => {
      const answer = data.answer;

      if (peerConnection.current!.signalingState !== 'stable') {
        await peerConnection.current!.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on('ice-candidate', async (data: any) => {
      const candidate = data.candidate;

      try {
        await peerConnection.current!.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.log('ICE Error:', err);
      }
    });
  };

  const cleanup = () => {
    peerConnection.current?.close();
    localStream?.getTracks().forEach(track => track.stop());

    socket.off('user-joined');
    socket.off('offer');
    socket.off('answer');
    socket.off('ice-candidate');

    isOfferCreated.current = false;
  };

  return (
    <View style={styles.container}>

      {/* 🔥 LOCAL USER - TOP */}
      <View style={styles.videoContainer}>
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.video}
            objectFit="cover"
          />
        )}
      </View>

      {/* 🔥 REMOTE USER - BOTTOM */}
      <View style={styles.videoContainer}>
        {remoteStream && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.video}
            objectFit="cover"
          />
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.endButton}
          onPress={() => {
            cleanup();
            onEnd();
          }}
        >
          <Text style={{ color: 'white' }}>End</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  videoContainer: {
    flex: 1,
  },

  video: {
    flex: 1,
  },

  controls: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
  },

  endButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 30,
  },
});