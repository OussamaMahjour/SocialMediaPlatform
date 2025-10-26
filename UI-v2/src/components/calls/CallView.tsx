import { useEffect } from "react";
import { useCall } from "../../services/providers/CallProvider2";
import Card from "../ui/Card";
import Account from "../../entities/user/Account";
import mediaApi from "../../services/api/media";
import ControlPane from "./ControlPane";
import { useAuth } from "../../services/providers/AuthProvider";



const CallView = ({contact}:{contact:Account})=>{
    
    const {remoteContainerRef,localContainerRef,setLocalStream} = useCall()
    const {user} = useAuth()
    useEffect(()=>{
       //setLocalStream();
       return ()=>{
        if(localContainerRef.current){  
                localContainerRef.current.innerHTML = ''
        }
        
       }
    },[])
    if(!user)return ;
    return <div  className="w-2/3 relative aspect-video bg-dark-accent  rounded-2xl overflow-hidden ">
        <div ref={remoteContainerRef} className="absolute w-full h-full top-0 left-0 bg-accent-dark flex justify-center items-center">
                <img src={mediaApi.getFileSrc(contact.profilePictureId)} className="w-20 aspect-square rounded-full border-border-dark border-3"/>

        </div>  
        
        <div ref={localContainerRef} className="absolute bottom-2 left-2 w-50 h-35 aspect-video rounded-2xl bg-background-dark flex justify-center border items-center overflow-hidden border-border-light  ">
                <img src={mediaApi.getFileSrc(user?.profilePictureId)} className="w-15 aspect-square rounded-full border-border-dark border-3"/>
        </div>
        <div className="absolute bottom-0 w-full z-layer-front h-30">
            <ControlPane />
        </div>
        
        
    </div>
}


export default CallView;