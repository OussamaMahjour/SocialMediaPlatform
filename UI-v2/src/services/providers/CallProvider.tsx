import { createContext, useContext, useEffect, useRef, useState } from "react"
import CallService from "../call-service"
import { Client } from "@stomp/stompjs"
import Account from "../../entities/user/Account"
import RingingView from "../../components/calls/RingingView"
import CallView from "../../components/calls/CallView"
import chatApi from "../api/chats"
import authApi from "../api/auth"
import { useAuth } from "./AuthProvider"
import Message from "../../entities/chat/Message"
import ChatService from "../chat-service"
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
    // useEffect(()=>{
    //     const setup =  async ()=>{
    //         const {client,pc} = await CallService.initialCallSocket(contact,
    //             ()=>{},
    //             ()=>{
    //                 setRemoteStream()
    //             },
    //             ()=>{}
    //         )
            
    //         if(!init){
    //             setCallStatus(CallStatus.RINGING)
    //             CallService.startHandShake(client,pc,contact)
    //         }else{
    //             setCallStatus(CallStatus.CALLING);
    //         }
    //         setClient(client);
    //         setPc(pc);


    //         // const client = chatApi.getCallStompClient(authApi.getJWTToken())
    //         // const pc =  new RTCPeerConnection();

    //         // client.onConnect = ()=>{
    //         //     console.log("connected call");
    //         //     client.subscribe(`/queue/call/${user?.username}`,async (message)=>{
    //         //         if(!pc)return
    //         //          if(!init){
    //         //                 setView(<RingingView contact={contact} callType={CallType.AUDIO_CALL}/>)
    //         //                 CallService.startHandShake(client,pc,contact)
    //         //             }else{
    //         //                // setCallStatus(CallStatus.CALLING);
    //         //                 setView(<CallView />)
    //         //             }
    //         //         console.log("getting msg ",message.body)
    //         //         const rtcMessage:RTCMessage = JSON.parse(message.body);
                    
                    
    //         //         switch(rtcMessage.messageType){
    //         //             case RTCMessageType.CREAT_OFFER:
    //         //                 if (rtcMessage.sdp?.type === "offer") {
    //         //                     await pc.setRemoteDescription(rtcMessage.sdp);
    //         //                     const answer = await pc.createAnswer();
    //         //                     try{          
    //         //                         await pc.setLocalDescription(answer);
    //         //                         setView(<RingingView contact={contact} callType={CallType.AUDIO_CALL}/>)

    //         //                     }catch(e){
    //         //                     }
                
    //         //                     console.log("localDescription is ",pc.localDescription)
                                
    //         //                     if(client.connected){
    //         //                             client.publish({
    //         //                             destination:`/app/call/${contact?.username}`,
    //         //                             body:JSON.stringify({
    //         //                                 sender: user?.username,
    //         //                                 messageType: RTCMessageType.CREAT_ANSWER,
    //         //                                 sdp: pc.localDescription,
    //         //                             })    
    //         //                         });
    //         //                     }
                                
                                
                                
    //         //                 }
    //         //                 break;

    //         //             case RTCMessageType.CREAT_ANSWER:
                        
    //         //                 console.log("creating answer",rtcMessage.sdp)
    //         //                 try{
    //         //                     await pc.setRemoteDescription(rtcMessage.sdp);
    //         //                     setView(<CallView />)
    //         //                     setCallStatus(CallStatus.IN_CALL)
    //         //                 }catch(e){

    //         //                 }
    //         //                 break;
    //         //             case RTCMessageType.ICE_CONDIDATE:
                            
    //         //                 console.log("received ice candidate ",rtcMessage.candidate)
    //         //                 pc.addIceCandidate(rtcMessage.candidate);
                            
    //         //                 break;
    //         //         }
    //         //     })
    //         // }
    //         // setClient(client);
    //         // setPc(pc);
    //         client.activate();
    //     }
    //     setup();
    //     return  ()=>{
    //         client?.unsubscribe("call-sub");
    //         client?.deactivate();
    //         pc?.close()
    //     }
    // },[])

    // useEffect(()=>{
    //     // switch(callStatus){
    //     //     case CallStatus.RINGING:
    //     //         setView(<RingingView contact={contact} callType={CallType.AUDIO_CALL}/>)
    //     //         break;
    //     //     case CallStatus.ACCEPTED:
    //     //         setView(<CallView />)
    //     //         setCallStatus(CallStatus.IN_CALL)
    //     //         break;
    //     //     case CallStatus.CALLING:
    //     //         setView(<CallView />)
    //     //         break;
    //     //     case CallStatus.IN_CALL:
                
    //     //         break;
    //     //     case CallStatus.REJECTED:
    //     //         break;
    //     // }
    // },[callStatus])

     useEffect(()=>{ 
       
        const token = authApi.getJWTToken();
        const RTCpc = new RTCPeerConnection();
        const stomp = new Client({
            brokerURL:`ws://localhost:8080/api/v1/chat?token=${token}`,
            onConnect:(frame)=>{
                if(client && client.connected){
                    CallService.startHandShake(client,RTCpc,contact)
                    console.log("connected to call socket")
                    client.subscribe(`/topic/call/${user?.username}`,async (message)=>{
                        const rtcMessage:RTCMessage = JSON.parse(message.body)
                        console.log(message)
                        switch(rtcMessage.messageType){
                            case RTCMessageType.CREAT_OFFER:
                                if (rtcMessage.sdp?.type === "offer") {
                                    await pc?.setRemoteDescription(rtcMessage.sdp);
                                    const answer = await pc?.createAnswer();
                                    try{
                                        await pc?.setLocalDescription(answer);
                                    }catch(e){
                                    }

                                    console.log("localDescription is ",pc?.localDescription)
                                    
                                    client.publish({
                                        destination:`/app/call/${rtcMessage.sender}`,
                                        body:JSON.stringify({ sender: user?.username,
                                        messageType: RTCMessageType.CREAT_ANSWER,
                                        sdp: pc?.localDescription,
                                        })});
                                }
                                break;

                            case RTCMessageType.CREAT_ANSWER:
                            
                                console.log("creating answer",rtcMessage.sdp)
                                try{
                                    await pc?.setRemoteDescription(rtcMessage.sdp);
                                    setView(<CallView />)
                                }catch(e){

                                }
                                break;
                            case RTCMessageType.ICE_CONDIDATE:
                           //     setCallStatus(CallStatus.INCOMMING)
                                console.log("received ice candidate ",rtcMessage.candidate)
                                pc?.addIceCandidate(rtcMessage.candidate);
                                break;
                        }
                    })
                }
            }
        })
        stomp.activate();
        setClient(stomp);
        setPc(RTCpc);
        return()=>{
            if(client && client.connected){
                client.deactivate();
                pc?.close()
                setPc(new RTCPeerConnection())
                
            }
        }
    },[])
    
  

    useEffect(()=>{
         if(!init){
            if(!client  || !pc)return;
            
            setView(<RingingView contact={contact} callType={CallType.AUDIO_CALL}/>)
            
        }else{
            // setCallStatus(CallStatus.CALLING);
            setView(<CallView />)
        }
    },[client,pc])

    const closeCall = ()=>{

    }

    const acceptCall = ()=>{
        if(!client || !pc)return;
        setCallStatus(CallStatus.ACCEPTED)
        CallService.startHandShake(client,pc,contact)
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
                  video.style.width = "100%"
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

