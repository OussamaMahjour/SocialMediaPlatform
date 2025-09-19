import Contact from "../../../types/Contact";
import skype_ring from "../../../assets/skype_ring.mp3"
import { useEffect } from "react";
import ControlPannel from "./call/ControlPannel";
import { useCall } from "../../../provider/CallProvider";

const RingingCall = ({target}:{target:Contact}) =>{
        const audio = new Audio(skype_ring);
        const {answerCall} = useCall()
        useEffect(()=>{     
                audio.play()
                return ()=>{
                        audio.pause()
                }
        },[])


    return <div className="w-70 h-120 bg-background-dark dark:bg-background-light flex flex-col rounded-2xl z-200">
                    <div className="h-3/5 w-full flex justify-center items-center">
                        <img className="aspect-square w-20 rounded-full" src={`http://localhost:8080/api/v1/media/${target.profileId}`}/>
                    </div>
                    <div className="h-2/5 w-full flex items-center justify-around">
                        <button className="aspect-square w-15 rounded-full flex justify-center items-center bg-red-600 text-white text-2xl cursor-pointer">
                                <i className="fa-solid fa-phone rotate-135"></i>
                        </button>
                        <button onClick={answerCall} className="aspect-square w-15 rounded-full flex justify-center items-center bg-green-600 text-white text-2xl cursor-pointer">
                                <i className="fa-solid fa-phone"></i>
                        </button>
                        
                    </div>
            </div>
            
    


}



export default RingingCall;