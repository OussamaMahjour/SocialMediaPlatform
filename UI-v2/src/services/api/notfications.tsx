import { Client } from "@stomp/stompjs"


const BASE_URL = "http://localhost:8080/api/v1/notification"


const NotificationApi = {
    
    getNotificationStompClient: (token:string)=>{
        const stompClient = new Client({
            brokerURL:`${BASE_URL}/?token=${token}`
        })
        return stompClient;
    }

    
}