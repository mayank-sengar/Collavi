import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import useAuthUser from './../hooks/useAuthUser';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const getWebSocketUrl = () => {
  try {
    const backend = new URL(BACKEND_URL);
    const wsProtocol = backend.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${backend.host}/ws`;
  } catch {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${window.location.host}/ws`;
  }
};

const CallPage = () => {
  const { callId } = useParams();
  const location = useLocation();
  const friendName = location.state?.friendName;
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const isCallerRef = useRef(false);
  const hasCreatedOfferRef = useRef(false);
  const mediaReadyPromiseRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);
  const outboundIceCandidatesRef = useRef([]);

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [connectionState, setConnectionState] = useState('Connecting...');
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [mediaError, setMediaError] = useState('');

  const sendSignal = (payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(payload));
  };

  const flushPendingRemoteCandidates = async (pc) => {
    const pending = [...pendingIceCandidatesRef.current];
    pendingIceCandidatesRef.current = [];

    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error applying queued remote ICE candidate:', err);
      }
    }
  };

  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const next = !micOn;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    setMicOn(next);
  };

  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (!stream) return;

    const next = !videoOn;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
    setVideoOn(next);
  };

  const handleExit = () => {
    navigate('/');
  };

  useEffect(() => {
    hasCreatedOfferRef.current = false;
    pendingIceCandidatesRef.current = [];
    outboundIceCandidatesRef.current = [];

    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    const remoteVideoElement = remoteVideoRef.current;

    const flushPendingOutboundCandidates = () => {
      const pending = [...outboundIceCandidatesRef.current];
      outboundIceCandidatesRef.current = [];

      pending.forEach((candidate) => {
        sendSignal({
          type: 'ice-candidate',
          callId,
          candidate,
        });
      });
    };

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pcRef.current = pc;

    mediaReadyPromiseRef.current = navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        setMediaError('');
      })
      .catch((err) => {
        console.error('Media access error:', err);
        setMediaError('Camera/microphone access denied or unavailable.');
      });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      setIsPeerConnected(true);
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;

      if (ws.readyState === WebSocket.OPEN) {
        sendSignal({
          type: 'ice-candidate',
          callId,
          candidate: event.candidate,
        });
        return;
      }

      outboundIceCandidatesRef.current.push(event.candidate);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setConnectionState('Connected');
        setIsPeerConnected(true);
      } else if (pc.connectionState === 'connecting') {
        setConnectionState('Connecting...');
      } else if (pc.connectionState === 'failed') {
        setConnectionState('Connection failed');
      } else if (pc.connectionState === 'disconnected') {
        setConnectionState('Peer disconnected');
        setIsPeerConnected(false);
      } else if (pc.connectionState === 'closed') {
        setConnectionState('Call ended');
      }
    };

    ws.onopen = () => {
      setConnectionState('Waiting for peer...');
      sendSignal({
        type: 'join',
        callId,
      });
      flushPendingOutboundCandidates();
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'offer') {
        try {
          await mediaReadyPromiseRef.current;
          await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
          await flushPendingRemoteCandidates(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          sendSignal({
            type: 'answer',
            callId,
            answer,
          });
        } catch (err) {
          console.error('Error handling offer:', err);
        }
      }

      if (msg.type === 'answer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
          await flushPendingRemoteCandidates(pc);
        } catch (err) {
          console.error('Error handling answer:', err);
        }
      }

      if (msg.type === 'ice-candidate') {
        if (pc.remoteDescription) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        } else {
          pendingIceCandidatesRef.current.push(msg.candidate);
        }
      }

      if (msg.type === 'role') {
        isCallerRef.current = msg.role === 'caller';
      }

      if (msg.type === 'ready' && isCallerRef.current && !hasCreatedOfferRef.current) {
        try {
          await mediaReadyPromiseRef.current;

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          hasCreatedOfferRef.current = true;

          sendSignal({
            type: 'offer',
            callId,
            offer,
          });

          setConnectionState('Calling...');
        } catch (err) {
          console.error('Error creating offer:', err);
        }
      }

      if (msg.type === 'peer-left') {
        setIsPeerConnected(false);
        setConnectionState('Peer left the call');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      }

      if (msg.type === 'room-full') {
        setConnectionState('Room is full');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionState('Signaling error');
    };

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      if (pcRef.current) {
        pcRef.current.close();
      }

      if (remoteVideoElement) {
        remoteVideoElement.srcObject = null;
      }
    };
  }, [callId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800 text-white px-4 py-5 md:px-8 md:py-7">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <button
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm transition hover:bg-white/10 md:text-base"
            onClick={handleExit}
          >
            <ArrowLeft className="size-5" />
            <span>Exit</span>
          </button>

          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-300 md:text-base">{connectionState}</p>
            <p className="text-xs text-gray-300">Call ID: {callId}</p>
          </div>
        </div>

        {mediaError ? (
          <div className="mb-4 rounded-lg border border-rose-400/40 bg-rose-500/20 px-4 py-3 text-sm text-rose-100">
            {mediaError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 pb-24 md:grid-cols-2 md:gap-5">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-xl">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="h-[240px] w-full object-cover md:h-[420px]"
            />
            <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-4 py-3">
              <h4 className="truncate text-sm font-semibold md:text-base">{authUser?.fullName || 'You'}</h4>
              <span className="rounded-full border border-sky-300/30 bg-sky-500/20 px-2 py-1 text-xs text-sky-200">
                You
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-[240px] w-full bg-black object-cover md:h-[420px]"
            />
            <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-4 py-3">
              <h4 className="truncate text-sm font-semibold md:text-base">{friendName || 'Remote user'}</h4>
              <span
                className={`rounded-full border px-2 py-1 text-xs ${
                  isPeerConnected
                    ? 'border-emerald-300/40 bg-emerald-500/20 text-emerald-200'
                    : 'border-amber-300/40 bg-amber-500/20 text-amber-200'
                }`}
              >
                {isPeerConnected ? 'Connected' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 shadow-2xl backdrop-blur md:gap-4">
          <button
            className={`cursor-pointer rounded-full p-3 transition ${
              micOn ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={toggleMic}
            aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {micOn ? <Mic /> : <MicOff />}
          </button>

          <button
            className={`cursor-pointer rounded-full p-3 transition ${
              videoOn ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={toggleVideo}
            aria-label={videoOn ? 'Turn camera off' : 'Turn camera on'}
          >
            {videoOn ? <Video /> : <VideoOff />}
          </button>

          <button
            className="cursor-pointer rounded-full bg-rose-600 p-3 transition hover:bg-rose-500"
            onClick={handleExit}
            aria-label="End call"
          >
            <PhoneOff />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPage;
