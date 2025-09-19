import { useEffect, useRef } from "react";
import Contact from "../../../types/Contact";
import { useAuth } from "../../../provider/AuthProvider";
import RingingCall from "./RingingCall";
import {  useNotification } from "../../../provider/NotificationProvider";
import { NotificationType } from "../../../types/Notification";
import { useCall } from "../../../provider/CallProvider";




const VideoCall = ()=>{
    const {selfCallContainer,remoteCallContainer,call} = useCall()
    
    const {user} = useAuth()
    
    
    

    useEffect(()=>{
      call()
      

      return ()=>{
       
      }
    },[])


    
    
   
      if(!user)return
    return (
    <div className="bg-background-light aspect-video w-4/5 h-4/5 m-4  z-100 relative rounded-md overflow-hidden">
        
        <div ref={selfCallContainer} className="absolute w-50 aspect-video overflow-hidden bg-amber-400 bottom-10 left-10 rounded-md">

            </div>
        <div ref={remoteCallContainer} className="w-full  rounded-md">

            </div>
    </div>
  );
}

export default VideoCall