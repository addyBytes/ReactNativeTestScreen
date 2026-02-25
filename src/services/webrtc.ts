import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from "react-native-webrtc";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let peerConnection: RTCPeerConnection;

export const createPeer = () => {
  peerConnection = new RTCPeerConnection(configuration);
  return peerConnection;
};

export const getPeer = () => peerConnection;

export const getLocalStream = async () => {
  return await mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};

export const addIceCandidate = async (candidate: any) => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

export const setRemoteDescription = async (desc: any) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(desc)
  );
};