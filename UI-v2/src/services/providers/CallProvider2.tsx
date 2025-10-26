import { createContext, useContext, useEffect, useRef, useState } from "react"
import CallService from "../call-service"
import { Client } from "@stomp/stompjs"
import Account from "../../entities/user/Account"
import RingingView from "../../components/calls/RingingView"
import CallView from "../../components/calls/CallView"
import authApi from "../api/auth"
import { useAuth } from "./AuthProvider"
import { RTCMessage, RTCMessageType } from "../../entities/chat/RTCMessage"

type CallContextType = {
    closeCall:()=>void;
    acceptCall:()=>void;
    remoteContainerRef:React.MutableRefObject<HTMLDivElement | null >;
    localContainerRef:React.MutableRefObject<HTMLDivElement | null >;
    callStatus:CallStatus | null;
    setLocalStream:()=>void;
    setRemoteStream:()=>void;

}
export enum CallType {
    VIDEO_CALL = "video_call",
    AUDIO_CALL = "audio_call"
}


export enum CallStatus  {
      RINGING = "ringing",
      IN_CALL = "inCall",
      CALLING = "calling",
      REJECTED = "rejected",
      ACCEPTED = "accepted"
}


const CallContext = createContext<CallContextType | null>(null)



const CallProvider = ({contact,init}:{contact:Account,init:boolean})=>{

    const [client,setClient] = useState<Client | null>(null);
    const [pc,setPc] = useState<RTCPeerConnection | null>(null);
    const [callStatus,setCallStatus] = useState<CallStatus | null>(null);
    const remoteContainerRef = useRef<HTMLDivElement | null>(null);
    const localContainerRef = useRef<HTMLDivElement | null>(null);
    const [view,setView] = useState<React.ReactNode | null>(null)
    const {user} = useAuth();
    useEffect(() => {
  const setup = async () => {
    const token = authApi.getJWTToken();
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const pendingCandidates: RTCIceCandidateInit[] = [];

    // 🔹 Always listen for local ICE candidates on both sides
    pc.onicecandidate = (event) => {
        console.log("🔍 ICE candidate event:", event.candidate);
        if (event.candidate && user) {
            console.log("📤 Sending ICE candidate to", contact.username);
            client?.publish({
            destination: `/app/call/${contact.username}`,
            body: JSON.stringify({
                sender: user?.username,
                messageType: RTCMessageType.ICE_CONDIDATE,
                candidate: event.candidate
            })
            });
        } else {
            console.log("✅ All ICE candidates sent (event.candidate is null)");
        }
        };


    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

    const stomp = new Client({
      brokerURL: `http://localhost:8080/api/v1/chat?token=${token}`,
      onConnect: () => {
        console.log("connected to socket");

        stomp.subscribe(`/queue/call/${user?.username}`, async (message) => {
          const rtcMsg: RTCMessage = JSON.parse(message.body);
          if (rtcMsg.sender === user?.username) return;

          switch (rtcMsg.messageType) {
            case RTCMessageType.CREAT_OFFER:
              await pc.setRemoteDescription(rtcMsg.sdp);
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);

              stomp.publish({
                destination: `/app/call/${rtcMsg.sender}`,
                body: JSON.stringify({
                  sender: user?.username,
                  messageType: RTCMessageType.CREAT_ANSWER,
                  sdp: pc.localDescription,
                }),
              });
              break;

            case RTCMessageType.CREAT_ANSWER:
              console.log("📥 Received answer from", rtcMsg.sender);
              await pc.setRemoteDescription(rtcMsg.sdp);
              // 🔹 Flush buffered candidates
              pendingCandidates.forEach((c) =>
                pc.addIceCandidate(new RTCIceCandidate(c))
              );
              break;

            case RTCMessageType.ICE_CONDIDATE:
              if (!rtcMsg.candidate) return;
              if (!pc.remoteDescription) {
                console.log("💾 Buffering ICE candidate");
                pendingCandidates.push(rtcMsg.candidate);
              } else {
                console.log("📥 Adding ICE candidate");
                await pc.addIceCandidate(new RTCIceCandidate(rtcMsg.candidate));
              }
              break;
          }
        });
      },
    });

    stomp.activate();
    setClient(stomp);
    setPc(pc);

    if (init) setView(<CallView contact={contact}/>);
    else setView(<RingingView callType={CallType.VIDEO_CALL} contact={contact} />);
  };

  setup();

  return () => {
    client?.deactivate();
    pc?.close();
  };
}, []);

    useEffect(()=>{
      
        
    },[callStatus])

    
  

  
    const closeCall = ()=>{

    }

    const acceptCall = ()=>{
        if(!client || !pc)return;
        setView(<CallView contact={contact}/>)
        // setCallStatus(CallStatus.ACCEPTED)
        // CallService.startHandShake(client,pc,contact)
        console.log("past accept call")
        pc.onsignalingstatechange = () => {
            console.log("🧭 Signaling state:", pc.signalingState);
            };
        
        pc.createOffer().then((offer)=>{
            pc.setLocalDescription(offer).then(()=>{
                console.log("publishing message to ",contact.username)
                client.publish({
                        destination:`/app/call/${contact.username}`,
                        body:JSON.stringify({
                            sender:user?.username,
                            messageType: RTCMessageType.CREAT_OFFER,
                            sdp: pc.localDescription,
                        })
                    });
            })
        })

       
        

    }

    const startStream = async ()=>{
      if (localContainerRef.current) {
                      localContainerRef.current.innerHTML = '';
       }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });   
      const video2 = document.createElement("video");
      video2.autoplay = true;
      video2.srcObject = stream;
      video2.style.width = "100%";
      localContainerRef.current?.appendChild(video2);
      if(pc){
        stream.getTracks().forEach(track => pc?.addTrack(track, stream));
        pc.ontrack = (event) => {
                  if (remoteContainerRef.current) {
                      remoteContainerRef.current.innerHTML = '';
                  }
                  const video = document.createElement("video");
                  video.autoplay = true;
                  video.srcObject = event.streams[0];
                  video.style.width = "100%"
                  remoteContainerRef.current?.appendChild(video);     
                };
      }           
    }                                                                             

    const setLocalStream = async ()=>{
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });   
        const video2 = document.createElement("video");
        video2.autoplay = true;
        video2.srcObject = stream;
        video2.style.width = "100%";
        if(localContainerRef.current){
            localContainerRef.current.innerHTML = '';
        }
        localContainerRef.current?.appendChild(video2);
        if(pc){
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        }
        
    }
    const setRemoteStream = async ()=>{
        if(!pc)return;
        pc.ontrack = (event) => {
                  const video = document.createElement("video");
                  video.autoplay = true;
                  video.srcObject = event.streams[0];
                  video.style.width = "100%";
                  if (remoteContainerRef.current) {
                    remoteContainerRef.current.innerHTML = '';
                  }
                  remoteContainerRef.current?.appendChild(video);     
                };
    }



    return <CallContext.Provider value={{closeCall,acceptCall,remoteContainerRef,localContainerRef,callStatus,setLocalStream,setRemoteStream}}>
            {view}
    </CallContext.Provider>

}

export default CallProvider;


export const useCall = ()=>{
    const context = useContext(CallContext);
    if(!context)throw Error("useCall must be used within a Call provider")
    return context ;
}

