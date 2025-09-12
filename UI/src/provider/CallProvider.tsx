import { createContext, ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react";
import Contact from "../types/Contact";
import User from "../types/User";

import { useAuth } from "./AuthProvider";
import { Client } from "@stomp/stompjs";


export enum CallType {
    VIDEO_CALL = "video_call",
    AUDIO_CALL = "audio_call"
}

export enum RTCMessageType {
    RECEIVER = "receiver",
    SENDER = "sernder",
    CREAT_OFFER="creatOffer",
    CREAT_ANSWER="creatAnswer",
    ICE_CONDIDATE="iceCondidate"
} 


export  type RTCMessage = {
    sender?:string;
    messageType:RTCMessageType;
    sdp?:any;
    candidate?:any;
}

type CallContextType = {
    toggleMic :()=>void;
    toggleSound :()=>void;
    toggleCamera :()=>void;
    setCaller: (caller:Contact | User)=>void;
    setReceiver: (receiver:Contact | User)=>void;
    call:(contact:Contact,callType:CallType)=>void;
    selfCallContainer:RefObject<HTMLDivElement>;
    remoteCallContainer:RefObject<HTMLDivElement>;
} 

const CallContext = createContext<CallContextType | null>(null)

    
    


const CallProvider = ({children}:{children:ReactNode}) =>{
    const [caller,setCaller] = useState<Contact | User | null>();
    const [receiver,setReceiver] = useState<Contact | User | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    const stompClient = useRef<Client | null>(null);
    const selfCallContainer = useRef<HTMLDivElement>(null); 
    const remoteCallContainer = useRef<HTMLDivElement>(null);
    const {user,token} = useAuth()
    
    useEffect(()=>{
        pc.current = new RTCPeerConnection();
        return ()=>{
            if(pc.current){
                pc.current.close()
                pc.current = new RTCPeerConnection();
            }
        }
    },[])

    const toggleMic = ()=>{

    }
    const toggleSound = ()=>{
        
    }
    const toggleCamera = ()=>{
        
    }

    const startStream = async ()=>{
      if (selfCallContainer.current) {
                      selfCallContainer.current.innerHTML = '';
       }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });   
      const video2 = document.createElement("video");
      video2.autoplay = true;
      video2.srcObject = stream;
      video2.style.width = "100%";
      selfCallContainer.current?.appendChild(video2);
      if(pc.current){
        stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));
        pc.current.ontrack = (event) => {
                  if (remoteCallContainer.current) {
                      remoteCallContainer.current.innerHTML = '';
                  }
                  const video = document.createElement("video");
                  video.autoplay = true;
                  video.srcObject = event.streams[0];
                  video.style.width = "100%"
                  remoteCallContainer.current?.appendChild(video);     
                };
      }           
    }

  useEffect(()=>{
        stompClient.current = new Client({
            brokerURL:`ws://localhost:8080/api/v1/chat?token=${token}`,
            onConnect: () =>{
                console.log("connected to "+stompClient.current?.brokerURL)            
                if(stompClient.current?.connected && pc.current){
                        startStream();
                        stompClient.current.subscribe(`/topic/call/video/${user?.username}`,async (message)=>{
                        const rtcMessage:RTCMessage = JSON.parse(message.body)
                        
                        switch(rtcMessage.messageType){
                            case RTCMessageType.CREAT_OFFER:
                            if (rtcMessage.sdp?.type === "offer") {
                                await pc.current?.setRemoteDescription(rtcMessage.sdp);
                                const answer = await pc.current?.createAnswer();
                                try{
                                    await pc.current?.setLocalDescription(answer);
                                }catch(e){
                                }

                                console.log("localDescription is ",pc.current?.localDescription)
                                
                                publish({
                                    sender: user?.username,
                                    messageType: RTCMessageType.CREAT_ANSWER,
                                    sdp: pc.current?.localDescription,
                                    },rtcMessage.sender);
                            }
                            break;

                            case RTCMessageType.CREAT_ANSWER:
                            
                            console.log("creating answer",rtcMessage.sdp)
                            try{
                                await pc.current?.setRemoteDescription(rtcMessage.sdp);
                            }catch(e){

                            }
                            break;
                            case RTCMessageType.ICE_CONDIDATE:
                            console.log("received ice candidate ",rtcMessage.candidate)
                            pc.current?.addIceCandidate(rtcMessage.candidate);
                            break;
                        }
                        
                        
                        })
                        console.log("connected as "+user?.username)
                    }
            
            }
        })
        
            stompClient.current.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            };

            stompClient.current.activate();

        return ()=>{
            if(stompClient.current && stompClient.current.connected){
                stompClient.current.deactivate();
            }
        }
  },[])

  const publish = (message:RTCMessage,destination?:string )=>{
    if (stompClient.current?.connected) {
      console.log("publishing message ",message)
      stompClient.current.publish({
              destination:`/app/call/video/${destination}`,
              body:JSON.stringify(message)
          })
    }else{
      console.log("no stomp connection")
    }
  }

    const call = async (contact:Contact,callType:CallType)=>{
        if(!pc.current || !stompClient.current?.connected)return;
        startStream();
        pc.current.onicecandidate = (event)=>{
            if(event.candidate && user){
            publish({sender:user?.username,messageType:RTCMessageType.ICE_CONDIDATE,candidate:event.candidate},contact.username)
            }
            
        }


        const offer = await pc.current?.createOffer();
        await pc.current?.setLocalDescription(offer);

        // publish({
        //     sender:user?.username,
        //     messageType: RTCMessageType.CREAT_OFFER,
        //     sdp: pc.current?.localDescription,
        // },contact.username);
    }



    return <CallContext.Provider value={{toggleCamera,toggleMic,toggleSound,setCaller,setReceiver,call,selfCallContainer,remoteCallContainer}}>
        {children}
    </CallContext.Provider>
}

export const useCall = ()=>{
    const context = useContext(CallContext);
    if(!context){
        throw new Error('useCall must be used within CallProvider');
    }
    return context
}


export default CallProvider;