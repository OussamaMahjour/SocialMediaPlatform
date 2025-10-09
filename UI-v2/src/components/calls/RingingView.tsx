import Account from "../../entities/user/Account";
import { CallType,useCall} from "../../services/providers/CallProvider";
import Card from "../ui/Card";
import Img from "../ui/Img";

const RingingView = ({callType,contact}:{callType:CallType,contact:Account})=>{
    
    const {closeCall,acceptCall} = useCall();
    
    
    return <Card className="w-70 h-100 max-w-ful max-h-full  z-layer-front overflow-hidden p-0 border-none">
        <div className="w-full h-full bg-accent-dark flex flex-col justify-around">
                <div className="w-full h-1/2 flex justify-center items-center">
                        <Img id={contact.profilePictureId} className="w-20  aspect-square rounded-full" />
                </div>
                <div className="w-full h-15  flex justify-around">
                        <button onClick={closeCall} className="h-full  aspect-square rounded-full bg-red-700 items-center cursor-pointer text-white text-2xl">
                            <i className="fa-solid fa-phone rotate-135"></i>

                        </button>
                        <button onClick={acceptCall} className="h-full aspect-square rounded-full bg-green-700 items-center cursor-pointer text-white text-2xl">
                             <i className="fa-solid fa-phone"></i>
                        </button>
                </div>

        </div>
    </Card>

}


export default RingingView