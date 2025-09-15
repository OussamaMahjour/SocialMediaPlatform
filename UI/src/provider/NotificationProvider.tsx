import { createContext, useContext, useEffect, useRef } from "react"
import Contact from "../types/Contact"
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthProvider";



export enum NotificationType {
    VIDEO_CALL = "videaCall"
}


type Notification = {

}

type NotificationContextType = {
    sendNotifification:(contact:Contact,notificationType:NotificationType,payload:Object)=>void;
    onNotification:(notification:Notification)=>void;

    
}

const NotificationContext = createContext<NotificationContextType | null>(null);



const NotificationProvider = ({children}:{children:React.ReactNode})=>{
    
    const NotificationActions = useRef<{(notification:Notification):void}[]>([]);
    const stompClient = useRef<Client | null>(null);
    const {user,token} = useAuth();
    
    useEffect(()=>{
        stompClient.current = new Client({
            brokerURL:`ws://localhost:8080/api/v1/notification?token=${token}`,
            onConnect: (frame)=>{
                console.log("notification connected as "+user?.username);
                stompClient.current?.subscribe(`/topic/${user?.username}`,(message)=>{
                    const notification:Notification = message.body;
                    // NotificationActions.current.forEach((action)=>{
                    //     action(notification)
                    // })
                    console.log(notification)
                })
            }
        })
        stompClient.current.activate()
        return ()=>{
            if(stompClient.current){
                stompClient.current.deactivate();
            }
        }
    },[])
    
    const sendNotifification = (contact:Contact,notificationType:NotificationType,payload:Object)=>{
            if(stompClient.current && stompClient.current.connected){
                const notification = payload
                stompClient.current.publish({
                    destination:`/app/${contact.username}/notify`,
                    body:JSON.stringify(notification)})
            }
    }
    const onNotification = ()=>{

    }


    return <NotificationContext.Provider value={{sendNotifification,onNotification}}>
        {children}
    </NotificationContext.Provider>
}



export const useNotification = () =>{
    const context = useContext(NotificationContext);
    if(!context) throw  new Error("u can't use the useNotification outside of a NotificationProvider");
    return context;
}

export default NotificationProvider;