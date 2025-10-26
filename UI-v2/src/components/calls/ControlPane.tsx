import { useState } from "react";
import { useCall } from "../../services/providers/CallProvider2"



const ControlPane = ()=>{

    


    return <div className="w-full flex justify-center gap-10 p-2 items-center">
        <EndButton />
        <ToggleVoiceButton />
        <ToggleVideoButton />
        <ParamsButton />
    </div>
}

const EndButton = ()=>{
    const {closeCall} = useCall();

    return <button onClick={()=>closeCall()} className="w-15 cursor-pointer aspect-square rounded-full bg-red-500">
        <i className="fa-solid fa-phone text-text-dark rotate-135 text-xl"></i>
    </button>
}


const ToggleVoiceButton = ()=>{
    const [voiceEnabled,SetVoiceEnabled] = useState(true);
    

    return <button className={`w-15 cursor-pointer aspect-square rounded-full ${voiceEnabled?"bg-border-dark":"bg-accent-light"}`} onClick={()=>voiceEnabled?SetVoiceEnabled(false):SetVoiceEnabled(true)}>
        {
            voiceEnabled?
            <i className="fa-solid fa-microphone text-text-dark text-xl"></i>
            :
            <i className="fa-solid fa-microphone-slash text-text-light text-xl"></i>
        }
        
    </button>

}

const ToggleVideoButton = ()=>{
    const [videoEnabled,SetVideoEnabled] = useState(true);
    

    return <button className={`w-15 cursor-pointer aspect-square rounded-full ${videoEnabled?"bg-border-dark":"bg-accent-light"}`} onClick={()=>videoEnabled?SetVideoEnabled(false):SetVideoEnabled(true)}>
        {
            videoEnabled?
            <i className="fa-solid fa-video text-text-dark text-xl"></i>
            :
            <i className="fa-solid fa-video-slash text-text-light text-xl"></i>
        }
    </button>

}

const ParamsButton = ()=>{
    return <button className="w-15 cursor-pointer aspect-square rounded-full bg-border-dark">
            <i className="fa-solid fa-ellipsis-vertical text-text-dark text-xl"></i>
    </button>
}



export default ControlPane;