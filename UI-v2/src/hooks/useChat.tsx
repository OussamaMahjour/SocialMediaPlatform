import { useEffect, useState } from "react";
import ChatService from "../services/chat-service";
import { Client } from "@stomp/stompjs";
import Conversation from "../entities/chat/Conversation";
import Account from "../entities/user/Account";
import Message from "../entities/chat/Message";

export default function useChat(){
  const [loading,setLoading] = useState(true)
  const [client,setClient] = useState<Client | null>(null)
  const [chat,setChat] = useState<Conversation[] | null>(null);
  
  useEffect(()=>{
    let isMounted = true;
    const initSocket = async ()=>{
      const client = await ChatService.initialSocketConnnection((message)=>{
        console.log(message);
      })
      if(isMounted)setClient(client)
      
    }
    initSocket()
    
    return ()=>{
        isMounted = false;
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
  
  const sendMessage = (destination:Account,message:Message) => {
    if(!client) return
    ChatService.sendMessage(destination.username,message,client);
  }
  
  return {sendMessage,loading,chat}
}