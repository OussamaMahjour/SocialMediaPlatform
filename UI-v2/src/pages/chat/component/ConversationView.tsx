import { act, forwardRef, ReactEventHandler, useEffect, useRef, useState } from "react";
import Message, { MessageType } from "../../../entities/chat/Message";
import { useAuth } from "../../../services/providers/AuthProvider";
import { useChat } from "../../Chat";
import ReactPlayer from "react-player";
import mediaApi from "../../../services/api/media";

const ConversationView = ()=>{
    const {user} = useAuth()
    const {activeConv} = useChat()
    const lastMessageRef = useRef<HTMLDivElement | null>(null);    
    
    //Setup the focus to the last message so it's appears in the converstion
    useEffect(() => {
        if (lastMessageRef.current) {
            console.log("focusing")
        lastMessageRef.current.focus();
        // setTimeout(() => {
        // lastMessageRef.current?.blur();
        // }, 100);
        }
    }, [activeConv]);
    
    if(!activeConv)return;
    return <div  className="w-full flex-1 overflow-y-scroll flex flex-col gap-2 py-3 px-3"> 
            {activeConv.messages.map((message,index)=>(
                (message.owner==user?.username)?
                <UserMessage  key={index} message={message} ref={(index==(activeConv.messages.length-1))?lastMessageRef:null} />:
                <ContactMessage key={index} message={message} />
            ))}
    </div>
}


const UserMessage = forwardRef<HTMLDivElement,{message:Message}>(({message},ref)=>{
    const [visible,setVisible] = useState(false) 


    return <div ref={ref} onMouseEnter={(e)=>{setVisible(true)}} onMouseLeave={()=>setVisible(false)} className="w-full flex justify-end items-center gap-3 ">
        <p  className={`text-sm text-border-dark dark:text-border-light ${visible?"":"invisible"}`}>{message.sentAt.toLocaleTimeString()}</p>
        <div className=" rounded-2xl  max-w-60 overflow-hidden">{
            message.type == MessageType.TEXT?
                    <h1 className="bg-accent-light dark:bg-accent-dark text-text-light dark:text-text-dark px-3 py-2">{message.body}</h1>:
            message.type == MessageType.VIDEO?
            <ReactPlayer
                width="100%"
                className="w-full"
                src={mediaApi.getFileSrc(message.body)}
                controls
                
                />:
            message.type == MessageType.AUDIO?
            <audio controls src={mediaApi.getFileSrc(message.body)}></audio>:
            message.type == MessageType.DOCUMENT?
            <></>:
            message.type == MessageType.IMAGE?
            <img src={mediaApi.getFileSrc(message.body)}/>:
            <></>
        }
        </div>
    </div>
})

const ContactMessage = forwardRef<HTMLDivElement,{message:Message}>(({message},ref)=>{
    const [visible,setVisible] = useState(false) 


    return <div ref={ref} onMouseEnter={(e)=>{setVisible(true)}} onMouseLeave={()=>setVisible(false)} className="w-full flex justify-start items-center gap-3 ">
        
        <div className=" rounded-2xl  max-w-60 overflow-hidden">{
            message.type == MessageType.TEXT?
                    <h1 className="dark:bg-accent-light bg-accent-dark dark:text-text-light text-text-dark px-3 py-2">{message.body}</h1>:
            message.type == MessageType.VIDEO?
            <ReactPlayer
                width="100%"
                className="w-full"
                src={mediaApi.getFileSrc(message.body)}
                controls
                
                />:
            message.type == MessageType.AUDIO?
            <audio controls src={mediaApi.getFileSrc(message.body)}></audio>:
            message.type == MessageType.DOCUMENT?
            <></>:
            message.type == MessageType.IMAGE?
            <img src={mediaApi.getFileSrc(message.body)}/>:
            <></>
        }
        </div>
        <p  className={`text-sm text-border-dark dark:text-border-light ${visible?"":"invisible"}`}>{message.sentAt.toLocaleTimeString()}</p>
    </div>
})

export default ConversationView;