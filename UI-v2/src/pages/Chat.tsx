import { createContext, useContext, useEffect, useState } from "react"
import ChatService from "../services/chat-service";
import Conversation from "../entities/chat/Conversation";
import { usePopup } from "../services/providers/PopupProvider";
import Account from "../entities/user/Account";
import Attachement, { AttachementType } from "../entities/chat/Attachement";
import ChatView from "./chat/ChatView";
import { Client, StompSubscription } from "@stomp/stompjs";
import Message, { MessageType } from "../entities/chat/Message";
import MediaService from "../services/media-service";
import { useAuth } from "../services/providers/AuthProvider";
import UserService from "../services/user-service";
import useMount from "../hooks/useMount";


type ChatContextType = {
    openConversation:(contact:Account)=>void;
    sendMessage:(destination:Account,message:Message) =>void;
    activeConv:Conversation | null;
    chat:Conversation[] | null;
    attachments:Attachement[] | null;
    setAttachments:React.Dispatch<React.SetStateAction<Attachement[] | null>>
}

const ChatContext = createContext<ChatContextType | null>(null);


export default function Chat(){
    const [activeConv,setActiveConv] = useState<Conversation | null>(null)
    const {closePopup} = usePopup()
    const [attachments,setAttachments] = useState<Attachement[] | null>(null);
    const [loading,setLoading] = useState(true)
    const [client,setClient] = useState<Client | null>(null);
    const [sub,setSub] = useState<StompSubscription | null>(null)
    const [chat,setChat] = useState<Conversation[] | null>(null);
    const {user} = useAuth();
    useEffect(()=>{
       
        let isMounted = true;
        const initSocket = async ()=>{
        const client = await ChatService.initialSocketConnnection(async (message)=>{
            
            const account = await UserService.getUser(message.owner);
            if(account){
                updateChat(account,message);
            }
            
        })
        if(isMounted)setClient(client)
        }
        initSocket()
        
        return ()=>{
            isMounted = false;
            client?.unsubscribe("chat-sub")
            client?.deactivate();
        }
    },[])
  

    useEffect(()=>{
        if (!client) return;
        const initChat = async ()=>{
        const chats =  await ChatService.getChat()
        setChat(chats)
        setLoading(false)
        }
        
        initChat()
        
        return ()=>{
        setChat([]);
        setLoading(true)
        }
    }, [client])
  
   useEffect(()=>{
        if(!activeConv)return ;
        chat?.forEach((element,index)=>{
            if(element.contact == activeConv.contact){
                setActiveConv({contact:element.contact,messages:element.messages})
            }
        })
        
   },[chat])


    const sendMessage = (destination:Account,message:Message) => {
        if(!client || !activeConv) return
        if(attachments){
            attachments.forEach(async (element,index)=>{
                    const id:string | undefined = await MediaService.saveAttachment(element);

                    if(id && user){
                        let messagetype:MessageType ;
                        switch(element.type){
                            case AttachementType.IMAGE:
                                messagetype = MessageType.IMAGE
                                break;
                            case AttachementType.VIDEO:
                                messagetype = MessageType.VIDEO
                                break;
                            case AttachementType.AUDIO:
                                messagetype = MessageType.AUDIO
                                break;
                            case AttachementType.DOCUMENT:
                                messagetype = MessageType.DOCUMENT
                        }
                        const attachmentMsg = {body:id,seen:false,sentAt:new Date(),owner:user.username,type:messagetype}
                        ChatService.sendMessage(destination.username,attachmentMsg,client)
                        updateChat(destination,attachmentMsg)
                    }
            })
            setAttachments(null)
            
        }
        if(message.body.length > 0){
            ChatService.sendMessage(destination.username,message,client);
            updateChat(destination,message)
        }
        
    }

    const updateChat = (destination:Account,message:Message)=>{
        
        setChat(prev =>
            prev?.map(conv =>
                conv.contact.username === destination.username
                ? { ...conv, messages: [...conv.messages, message] }
                : conv
            ) || null
            );
        
    }


    const openConversation = (contact:Account)=>{
        const selectedConvo:Conversation | undefined = chat?.filter((convo:Conversation)=>(convo.contact.username == contact.username))[0] 
        if(!selectedConvo){
            setActiveConv({contact:contact,messages:[]})
            closePopup()
            return
        }
        setActiveConv(selectedConvo);
        closePopup()
    }


    const contextValue:ChatContextType = {
        openConversation,
        sendMessage,
        activeConv,
        chat,
        attachments,
        setAttachments


    }

    if(loading) return <>Loading</>
    return <ChatContext.Provider value={contextValue}>
            <ChatView />
        </ChatContext.Provider>
}

export const useChat= ()=>{
    const context = useContext(ChatContext);
    if(!context)throw Error("Can't use useChatContext outside of the Chat component")
    return context;
}