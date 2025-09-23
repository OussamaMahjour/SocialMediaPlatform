import { Client } from "@stomp/stompjs";
import Message from "../entities/chat/Message";
import authApi from "./api/auth";
import chatApi from "./api/chats"
import { userApi } from "./api/users";
import UserService from "./user-service";

const ChatService = {
    initialSocketConnnection:async (onMessage:(message:string)=>void)=>{
        const token = authApi.getJWTToken()
        const user = await UserService.getLoggedUser();
        if(!token) throw Error("no user logged in ")
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

    sendMessage:(username:string,message:Message,stompClient:Client)=>{
        stompClient.publish({
            destination:`/app/message/${username}`,
            body:JSON.stringify(message)
        })
    }
}

export default ChatService