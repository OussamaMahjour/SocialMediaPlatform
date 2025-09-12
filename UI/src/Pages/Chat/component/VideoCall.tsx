import { useEffect, useRef } from "react";
import Contact from "../../../types/Contact";
import { useAuth } from "../../../provider/AuthProvider";
import RingingCall from "./RingingCall";


enum CallStatus  {
      RINGING = "ringing",
      IN_CALL = "inCall",
      INCOMMING = "incomming",
      REJECTED = "rejected",
      ACCEPTED = "accepted"
}

type Call = {
    caller?:string;
    status:CallStatus;
}

const VideoCall = ({target}:{target:Contact})=>{
    const selfCallcontainer = useRef<HTMLDivElement>(null); 
    const receiverCallcontainer = useRef<HTMLDivElement>(null); 
    const {user} = useAuth()
    const call = useRef<Call>({caller:user?.username,status:CallStatus.RINGING});
    //const {stompClient,cleanup} = useStomp();
    

    useEffect(()=>{
      // stompClient.current?.subscribe(`/app/call/video/${user?.username}`,(message)=>{

      // })
      startStream()
      

      return ()=>{
        if (selfCallcontainer.current) {
                      selfCallcontainer.current.innerHTML = '';
        }
      }
    },[])


    
    const startStream = async ()=>{
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });   
      const video2 = document.createElement("video");
      video2.autoplay = true;
      video2.srcObject = stream;
      video2.style.width = "100%";
      if (selfCallcontainer.current) {
                      selfCallcontainer.current.innerHTML = '';
                      selfCallcontainer.current?.appendChild(video2);
      }
      }

      const insertCall = () => {
          switch(call.current.status){
            case CallStatus.RINGING:
              return  <RingingCall target={target} ></RingingCall>
            case CallStatus.ACCEPTED:
              break;
          }
      }
   
      if(!user)return
    return (
    <div className="bg-background-light aspect-video w-4/5 h-4/5 m-4  z-100 relative rounded-md overflow-hidden">
        {
            insertCall()
        }
        <div ref={selfCallcontainer} className="absolute w-50 aspect-video overflow-hidden bg-amber-400 bottom-10 left-10 rounded-md">

            </div>
    </div>
  );
}

export default VideoCall