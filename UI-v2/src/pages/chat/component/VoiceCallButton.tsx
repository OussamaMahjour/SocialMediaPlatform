import ChatNotification, { ChatNotificationType } from "../../../entities/notification/ChatNotification";
import { NotificationType } from "../../../entities/notification/Notification";
import Account from "../../../entities/user/Account";
import CallService from "../../../services/call-service";
import { useAuth } from "../../../services/providers/AuthProvider";
import CallProvider from "../../../services/providers/CallProvider";
import { useNotification } from "../../../services/providers/NotificationProvider";
import { usePopup } from "../../../services/providers/PopupProvider";

const VoiceCallButton = ({className,contact}:{className?:string,contact:Account})=>{
    const {notify} = useNotification()
    const {user} = useAuth()
    const {openPopup} = usePopup();
    if(!user)return;
    const voiceCall = async ()=>{
        const notification:ChatNotification = {
            message:"",
            MessageType:ChatNotificationType.VOICE_CALL,
            senderUsername:user.username,
            recipientUsername:contact.username,
            type:NotificationType.CHAT_NOTIFICATION
        }
        notify(notification,contact)
        openPopup(<CallProvider contact={contact} init={true}></CallProvider>)
    }
    
    
    return <button onClick={voiceCall} className={`flex text-2xl p-2 min-w-5 aspect-square cursor-pointer ${className}`}>
        <i className="fa-solid fa-phone"></i>
    </button>
}


export default VoiceCallButton;