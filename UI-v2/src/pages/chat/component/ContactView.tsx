import Message from "../../../entities/chat/Message"
import Account from "../../../entities/user/Account"



const ContactView = ({contact,lastMessage,onClick}:{contact:Account,lastMessage:Message,onClick:()=>void})=>{
    return <div onClick={onClick} className="w-full flex items-center px-5 py-3 cursor-pointer">
        <img className="w-14 aspect-square rounded-full" src={`http://localhost:8080/api/v1/media/${contact.profileId}`}/>
        <div className="flex flex-1 flex-col p-3 gap-1">
                <div className="flex justify-between">
                     <h1 className="text-text-light dark:text-text-dark ">{contact.username}</h1>
                     <p className="text-sm font-light text-border-dark dark:text-border-light">{new Date(lastMessage.sentAt).getDate()}</p>
                </div>
               
                <p className="text-sm font-light text-border-dark dark:text-border-light ">{lastMessage.body}</p>
                
        </div>
    </div>

}

export default ContactView