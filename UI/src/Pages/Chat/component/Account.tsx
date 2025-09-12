import { ReactElement } from "react";
import Contact from "../../../types/Contact";
import Message, { MessageType } from "../../../types/Message";

type Props =  {
    isActive?:boolean; 
    contact:Contact
    lastMessage:Message;
    lastMessageTime:Date;
    nbrOfUnSeenMessages:number;
    setCurrentContact:CallableFunction;
}


function Account({isActive,contact,lastMessage,lastMessageTime,nbrOfUnSeenMessages,setCurrentContact}:Props):ReactElement{
    return <div className={`w-full h-20 p-4    rounded hover:bg-accent-light hover:dark:bg-accent-dark cursor-pointer flex items-center gap-2 ${isActive?"dark:bg-accent-dark bg-accent-light":""}`}
            onClick={()=>setCurrentContact(contact)}
    >
        <img className="h-full aspect-square rounded-full " src={contact.profileId}></img>
        <div className="h-full w-7/10 ">
                <div className="flex justify-between items-center h-1/2">
                    <h1 className="h-full text-center  text-text-light dark:text-text-dark ">{contact.username}</h1>
                    <h1 className="h-full text-center text-sm text-secondary-light">
                        {
                        lastMessageTime?.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                        })}</h1>
                </div>
                <span className="text-sm text-secondary-light  max-h-1/2 line-clamp-1">
                {lastMessage.type==MessageType.TEXT?
                lastMessage.body
                :lastMessage.type==MessageType.AUDIO?
                <span className="flex gap-2 items-center"><i className="fa-solid fa-headphones"></i><h1>audio</h1></span>
                :lastMessage.type==MessageType.VIDEO?
                <span className="flex gap-2 items-center"><i className="fa-solid fa-film"></i><h1>video</h1></span>
                :lastMessage.type==MessageType.IMAGE?
                <span className="flex gap-2 items-center"><i className="fa-solid fa-image"></i><h1>image</h1></span>
                :lastMessage.type==MessageType.DOCUMENT?
                <span className="flex gap-2 items-center"><i className="fa-solid fa-file"></i><h1>document</h1></span>:
                <></>
                }
                </span>
        </div>
        {
            nbrOfUnSeenMessages!=0?
        <div className="h-full w-1/10 flex justify-end">
            <h1 className=" aspect-square h-7 rounded-full bg-text-light  text-background-light dark:bg-text-dark dark:text-background-dark text-xs flex items-center justify-center text-center">{nbrOfUnSeenMessages}</h1>
        </div>:
        <></>
        }   
    </div>
}



export default Account;