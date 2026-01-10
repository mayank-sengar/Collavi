import React from 'react'
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'
import { useRef } from 'react';
import useAuthUser from './../hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Mic } from 'lucide-react';
import { MicOff } from 'lucide-react';
import { useState } from 'react';
import { Video } from 'lucide-react';
import { VideoOff } from 'lucide-react';
const CallPage = () => {
  const {callId }= useParams();
  const location = useLocation();
  const friendName = location.state?.friendName;
  
  const localVideoRef = useRef(null);
  const remoteVideoRef= useRef(null);
  const localStreamRef = useRef(null);

  const wsRef= useRef(null);
  const pcRef= useRef(null);
  const isCallerRef= useRef(false);
  const hasCreatedOfferRef = useRef(false);

  const [micOn,setMicOn] = useState(true);
  const [videoOn,setVideoOn] = useState(true);

  const toggleMic = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !micOn;
    stream.getAudioTracks().forEach((track) => { track.enabled = next; });
    setMicOn(next);
  };

  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !videoOn;
    stream.getVideoTracks().forEach((track) => { track.enabled = next; });
    setVideoOn(next);
  };
  const navigate = useNavigate()

   const handleExit = ()=>{
    navigate(`/`)
  }

const {authUser} =useAuthUser();


  useEffect(()=>{
    hasCreatedOfferRef.current = false;
    const ws= new WebSocket("ws://localhost:8080");
    wsRef.current = ws;
    
    //adding STUN server
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    pcRef.current = pc;

    navigator.mediaDevices.
    getUserMedia({video : true, audio: true})
    .then((stream)=>{
      localStreamRef.current = stream;
      localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track)=>{
        pc.addTrack(track,stream);
      })
    }).catch(err => {
      console.error("Access error", err);
    });

    //when remote stream arrives
    pc.ontrack = (event)=>{
      console.log("Remote track received:", event.track.kind);
      remoteVideoRef.current.srcObject = event.streams[0];
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "ice-candidate",
            callId,
            candidate: event.candidate,
          })
        );
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
    };

    //websocket connected
    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        type: "join",
        callId
      }))
    }

    //handling signaling messages
    ws.onmessage = async(event)=>{
      const msg = JSON.parse(event.data);
      console.log("Message received:", msg.type);

      if(msg.type === "offer"){
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type:"answer",
              callId,
              answer,
              
            })
          )
        } catch (err) {
          console.error("Error handling offer:", err);
        }
      }

      if(msg.type === "answer"){
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
        } catch (err) {
          console.error("Error handling answer:", err);
        }
      }

      if(msg.type === "ice-candidate" && pc.remoteDescription){
        try {
          await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } catch (err) {
          console.error("Error adding ice candidate:", err);
        }
      }

      if(msg.type === "role"){
        isCallerRef.current = msg.role === "caller";
        ws.send(JSON.stringify({
          type: "setUser",
          remoteUser : authUser
        }))
        console.log("Role assigned:", msg.role);
      }

      // start offer only after both peers joined
      if(msg.type === "ready" && isCallerRef.current && !hasCreatedOfferRef.current){
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          hasCreatedOfferRef.current = true;
         
          ws.send(
            JSON.stringify({
              type:"offer",
              callId,
              offer,
            })
          )
        } catch (err) {
          console.error("Error creating offer:", err);
        }
      }
    }

  

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    }

    return ()=>{
      ws.close();
      pc.close();
    }
  },[callId]);

  
  console.log("localvideored",localVideoRef);
   
  console.log("remotevideoref",remoteVideoRef);

  return (
    <div>
  
      <div>
        <button className="cursor-pointer mt-6 ml-2" onClick={handleExit}>
      <div className="flex text-xl ">   
      <ArrowLeft className='size-7'/>
      <span>Exit</span>
      </div>
      </button>
     
        <div  className="flex pt-8">
        <div className ="ml-4">
         
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
         className= 'w-2xl  border-[1px] border-black text-amber-50 h-xl' 
         
          ></video>
          <div className="pt-5">
           <h4 className="bg-green-500 text-amber-50 inline p-2 ml-1.5 rounded-lg">{authUser?.fullName}</h4>
           </div>
        </div>

        <div className="ml-2 flex-col">

        <video 
        ref={remoteVideoRef}
        autoPlay
        playsInline
         className= 'w-2xl  border-[1px] border-black' 
        />
           <div className="pt-5">
         <h4 className="bg-green-500 text-amber-50 inline p-2 ml-1.5 rounded-lg">{ friendName}</h4>
          </div>
        </div>

       
      </div>


      </div>
      <div className="flex justify-center mt-7 gap-8">
      {micOn ?
         <div >
          <button className="bg-red-600 rounded-3xl p-3 cursor-pointer"
          onClick={toggleMic}>
            <Mic/>
          </button>
         </div>
        :
         <div>
          <button  className="bg-gray-500 rounded-3xl p-3 cursor-pointer"
          onClick={toggleMic}>
            <MicOff/>
          </button>
          </div>}

         {videoOn ?
         <div >
          <button className="bg-red-600 rounded-3xl p-3 cursor-pointer"
          onClick={toggleVideo}>
            <Video/>
          </button>
         </div>
        :
         <div>
          <button  className="bg-gray-500 rounded-3xl p-3 cursor-pointer"
          onClick={toggleVideo}>
            <VideoOff/>
          </button>
          </div>}
      </div>

    </div>
  )
}

export default CallPage

