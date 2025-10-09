import { Client } from "@stomp/stompjs";
import Message from "../entities/chat/Message";
import authApi from "./api/auth";
import chatApi from "./api/chats"
import UserService from "./user-service";
import Conversation from "../entities/chat/Conversation";
import Account from "../entities/user/Account";

const ChatService = {
    initialSocketConnnection:async (onMessage:(message:Message)=>void)=>{
        const token = authApi.getJWTToken()
        const user = await UserService.getLoggedUser();
        const client:Client = chatApi.getChatStompClient(token);
        client.onConnect = ()=>{
            if(client.connected){
                 client.subscribe(`/queue/message/${user?.username}`,(message)=>{
                    const msg:Message = ChatService.formatMessage(message.body)
                    onMessage(msg)
                },{id:"chat-sub"})
            }
        }
        client.activate()
        return client;
    },
    
    cleanConnection:(stompClient:Client | null)=>{
        if(stompClient){
            stompClient.deactivate;
            stompClient = null;
        }
    },

    sendMessage:(username:string,message:Message,stompClient:Client)=>{
        if(stompClient.connected){
            stompClient.publish({
            destination:`/app/message/${username}`,
            body:JSON.stringify(message)
            })
        }else{
            console.warn("stomp client not connected")
        }
        
    },

    getChat:async ()=>{
        const token = authApi.getJWTToken()
        const user = await UserService.getLoggedUser();
        if(!user)return;
        const chats:{username:string,messages:Message[]}[] = await chatApi.getChats(user.username,token);
        const convos:Conversation[] = []
        for(let i = 0;i<chats.length;i++){
            const contact = await UserService.getUser(chats[i].username);
            chats[i].messages.forEach((message,index)=>{
                chats[i].messages[index] =  ChatService.formatMessage(message);
            })
            if(contact)convos.push({contact:contact as Account,messages:chats[i].messages})
            
        }
        return convos;
    },
    getLastMessage: (convo:Conversation)=>{
        convo.messages.sort((e1,e2)=>(new Date(e1.sentAt).getDate() - new Date(e2.sentAt).getDate()))
        return convo.messages[convo.messages.length-1]
    },

    formatMessage(json:string | Message){
        let message:Message ;
        if(typeof(json) == "string"){
            message = JSON.parse(json)
        }else{
            message= json
        }
       
        message.sentAt = new Date(message.sentAt)
        return message
    }
    

}

export default ChatService