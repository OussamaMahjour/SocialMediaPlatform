import { createContext, useContext, useEffect, useRef, useState } from "react"
import CallService from "../call-service"
import { Client } from "@stomp/stompjs"
import Account from "../../entities/user/Account"
import RingingView from "../../components/calls/RingingView"
import CallView from "../../components/calls/CallView"

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
    useEffect(()=>{
        const setup =  async ()=>{
            const {client,pc} = await CallService.initialCallSocket(contact,
                ()=>{},
                ()=>{
                    setRemoteStream()
                },
                ()=>{}
            )
            
            if(!init){
                setCallStatus(CallStatus.RINGING)
                CallService.startHandShake(client,pc,contact)
            }else{
                setCallStatus(CallStatus.CALLING);
            }
            setClient(client);
            setPc(pc);
        }
        setup();
        return  ()=>{
            client?.unsubscribe("call-sub");
            client?.deactivate();
            pc?.close()
        }
    },[])

    useEffect(()=>{
        switch(callStatus){
            case CallStatus.RINGING:
                setView(<RingingView contact={contact} callType={CallType.AUDIO_CALL}/>)
                break;
            case CallStatus.ACCEPTED:
                setView(<CallView />)
                setCallStatus(CallStatus.IN_CALL)
                break;
            case CallStatus.CALLING:
                setView(<CallView />)
                break;
            case CallStatus.IN_CALL:
                
                break;
            case CallStatus.REJECTED:
                break;
        }
    },[callStatus])

    const closeCall = ()=>{

    }

    const acceptCall = ()=>{
        if(!client || !pc)return;
        setCallStatus(CallStatus.ACCEPTED)
        CallService.startHandShake(client,pc,contact)
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

