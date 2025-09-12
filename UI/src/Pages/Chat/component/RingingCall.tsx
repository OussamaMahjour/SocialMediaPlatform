import Contact from "../../../types/Contact";
import skype_ring from "../../../assets/skype_ring.mp3"
import { useEffect } from "react";
import ControlPannel from "./call/ControlPannel";

const RingingCall = ({target}:{target:Contact}) =>{

    useEffect(()=>{
        const audio = new Audio(skype_ring);
        audio.play()
        
    },[])

    return <div className="w-full h-full relative">
            <div className="w-full h-full bg-background-dark dark:bg-background-light flex flex-col">
                    <div className="w-full flex-1  flex flex-col justify-center items-center" >
                           <span className="relative flex size-30">  
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>  
                                <img className="relative inline-flex w-40 aspect-square rounded-full " src={target.profileId}/>
                           </span> 
                           <h1 className="text-accent-light dark:text-accent-dark">
                                Ringing ...
                           </h1>
                    </div>
                    <div className="w-full h-20 flex justify-center items-center ">

                            <ControlPannel />
                    </div>

            </div>
            
    </div>


}



export default RingingCall;