import Message, { MessageType } from "../../../entities/chat/Message"
import Account from "../../../entities/user/Account"
import mediaApi from "../../../services/api/media"
import Tools from "../../../utils/tools"



const ContactView = ({contact,lastMessage,onClick}:{contact:Account,lastMessage:Message,onClick:()=>void})=>{
    

    return <div onClick={onClick} className="w-full flex items-center px-5 py-3 cursor-pointer">
        <img className="w-14 aspect-square rounded-full" src={mediaApi.getFileSrc(contact.profileId)}/>
        <div className="flex flex-1 flex-col p-3 gap-1">
            
            <h1 className="text-text-light dark:text-text-dark ">{contact.username}</h1>
                <div className="flex justify-between">
                    {
                        lastMessage.type == MessageType.TEXT?
                        <p className="text-sm font-light text-border-dark dark:text-border-light ">{lastMessage.body}</p>:
                        lastMessage.type == MessageType.VIDEO?
                        <i className="fa-solid fa-film text-sm font-light text-border-dark dark:text-border-light"></i>:
                        lastMessage.type == MessageType.AUDIO?
                        <i className="fa-solid fa-headphones text-sm font-light text-border-dark dark:text-border-light"></i> :
                        lastMessage.type == MessageType.DOCUMENT?
                         <i className="fa-solid fa-file text-sm font-light text-border-dark dark:text-border-light"></i>:
                        lastMessage.type == MessageType.IMAGE?
                         <i className="fa-solid fa-image text-sm font-light text-border-dark dark:text-border-light"></i>:
                        <></>
                    }
                     
                     <p className="text-sm font-light text-border-dark dark:text-border-light">{Tools.dateToLastTimeFormat(lastMessage.sentAt)}</p>
                </div>
               
                
                
        </div>
    </div>

}

export default ContactView