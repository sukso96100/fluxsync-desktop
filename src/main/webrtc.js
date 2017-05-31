const webRTC = require('wrtc');
const RTCPeerConnection     = webRTC.RTCPeerConnection;
const RTCSessionDescription = webRTC.RTCSessionDescription;
const RTCIceCandidate       = webRTC.RTCIceCandidate;

let peer1 = new RTCPeerConnection();
let peer2 = new RTCPeerConnection();
