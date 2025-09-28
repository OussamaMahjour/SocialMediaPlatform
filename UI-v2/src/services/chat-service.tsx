import { Client } from "@stomp/stompjs";
import Message from "../entities/chat/Message";
import authApi from "./api/auth";
import chatApi from "./api/chats"
import UserService from "./user-service";
import Conversation from "../entities/chat/Conversation";
import Account from "../entities/user/Account";

const ChatService = {
    initialSocketConnnection:async (onMessage:(message:string)=>void)=>{
        const token = authApi.getJWTToken()
        const user = await UserService.getLoggedUser();
        const stompClient = chatApi.getChatStompClient(token);
        stompClient.onConnect = ()=>{
            console.log("connected to chat socket")
            if(stompClient.connected){
                stompClient.subscribe(`/queue/message/${user?.username}`,(message)=>{
                    onMessage(message.body)
                })
            }
        }
        stompClient.activate()
        return stompClient;
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
        const chats:{username:string,messages:Message[]}[] = await chatApi.getChats(user.username,token);
        const convos:Conversation[] = []
        for(let i = 0;i<chats.length;i++){
            const contact = await UserService.getUser(chats[i].username);
            if(contact)convos.push({contact:contact as Account,messages:chats[i].messages})
        }
        return convos;
    },
    getLastMessage: (convo:Conversation)=>{
        convo.messages.sort((e1,e2)=>(new Date(e1.sentAt).getDate() - new Date(e2.sentAt).getDate()))
        return convo.messages[convo.messages.length-1]
    }

}

export default ChatService