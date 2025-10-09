import { Client } from "@stomp/stompjs";
import authApi from "./api/auth";
import notificationApi from "./api/notfications";
import UserService from "./user-service";
import Account from "../entities/user/Account";
import ChatNotification, { ChatNotificationType } from "../entities/notification/ChatNotification";
import Notification from "../entities/notification/Notification";
import { MessageType } from "../entities/chat/Message";
import CallService from "./call-service";

const NotificationService = {
    initialSocketConnnection:async (onNotification:(notification:Notification)=>void)=>{
        const token = authApi.getJWTToken()
        const user = await UserService.getLoggedUser();
        const client:Client = notificationApi.getNotificationStompClient(token);
        client.onConnect = ()=>{
            
            if(client.connected){
                console.log("notification connected")
                 client.subscribe(`/topic/${user?.username}`,(message)=>{
                    const notification:Notification = JSON.parse(message.body);
                    onNotification(notification);
                },{id:"notification-sub",oncancel:""})
            }
        }
        client.activate()
        return client;
    },
    
    notify:(notification:Notification,destination:Account,client:Client)=>{
        if(client.connected){
            notificationApi.sendNotifiction(notification,destination,client)
        }else{
            console.warn("notification client not connected")
        }
        
    },
    


}


export default NotificationService;