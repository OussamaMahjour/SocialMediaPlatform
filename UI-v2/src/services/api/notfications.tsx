import { Client } from "@stomp/stompjs"
import Account from "../../entities/user/Account";


const BASE_URL = "http://localhost:8080/api/v1/notification"


const NotificationApi = {
    
    getNotificationStompClient: (token:string)=>{
        const stompClient = new Client({
            brokerURL:`${BASE_URL}/?token=${token}`
        })
        return stompClient;
    },
    getNotfications:(username:string,token:string)=>{

    },
    sendNotifiction:(notfication:Notification,destination:Account,client:Client)=>{
        if(client.connected){
            if('message' in notfication){
                
            }
        }
    }

    
}