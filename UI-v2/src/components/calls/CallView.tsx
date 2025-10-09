import { useEffect } from "react";
import { useCall } from "../../services/providers/CallProvider";
import Card from "../ui/Card";



const CallView = ()=>{
    
    const {remoteContainerRef,localContainerRef,setLocalStream} = useCall()
    
    useEffect(()=>{
       setLocalStream();
       return ()=>{
        if(localContainerRef.current){  
                localContainerRef.current.innerHTML = ''
        }
        
       }
    },[])
    return <div  className="w-2/3 relative aspect-video bg-dark-accent  rounded-2xl overflow-hidden">
        <div ref={remoteContainerRef} className="absolute w-full h-full top-0 left-0 bg-red-600">

        </div>
        <div ref={localContainerRef} className="absolute bottom-2 left-2 w-50 h-35 aspect-video rounded-2xl bg-white flex justify-center items-center overflow-hidden border-border-light dark:border-border-dark">

        </div>
    </div>
}


export default CallView;