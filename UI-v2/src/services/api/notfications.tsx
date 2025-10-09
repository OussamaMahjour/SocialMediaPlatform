import { Client } from "@stomp/stompjs"
import Account from "../../entities/user/Account";
import ChatNotification from "../../entities/notification/ChatNotification";
import Notification from "../../entities/notification/Notification";


const BASE_URL = "ws://localhost:8080/api/v1/notification"


const notificationApi = {
    
    getNotificationStompClient: (token:string)=>{
        const stompClient = new Client({
            brokerURL:`${BASE_URL}?token=${token}`,
            
        })
       
        return stompClient;
    },
    getNotfications:(username:string,token:string)=>{

    },
    sendNotifiction:(notification:Notification,destination:Account,client:Client)=>{
        if(client.connected){
            if('message' in notification){
                let chatNotification = notification as ChatNotification;
                client.publish({
                    destination:`/app/${destination.username}/notify`,
                    body:JSON.stringify(chatNotification)
                }) 
            }
        }
    },


    
}

export default notificationApi;