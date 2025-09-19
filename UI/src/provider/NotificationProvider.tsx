import { createContext, ReactElement, useContext, useEffect, useRef, useState } from "react"
import Contact from "../types/Contact"
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthProvider";
import Notification, { NotificationType } from "../types/Notification";
import { useTheme } from "./ThemeProvider";
import RingingCall from "../Pages/Chat/component/RingingCall";
import ChatNotification from "../types/ChatNotification";
import CallProvider from "./CallProvider";







type NotificationContextType = {
    sendNotifification:(contact:Contact,notification:Notification)=>void;
    onNotification:(action:(notification:Notification)=>void)=>void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);



const NotificationProvider = ({children}:{children:React.ReactNode})=>{
    
    
    const stompClient = useRef<Client | null>(null);
    const {user,token,getContact} = useAuth();
    const [popup,openPopup] = useState<ReactElement|null>(null)
    
    const defaultNotficationActions = [
        async (notification:Notification)=>{
            var chatNotification = notification as ChatNotification
            var contact = await getContact(chatNotification.senderUsername)
            openPopup(<CallProvider initCall={false} target={contact}></CallProvider>)
        }
    ]


    const NotificationActions = useRef<((notification:Notification)=>void)[]>([]);    
    useEffect(()=>{
        defaultNotficationActions.forEach((e)=>{
            NotificationActions.current.push(e)
        })
        
    },[])


    useEffect(()=>{
        stompClient.current = new Client({
            brokerURL:`ws://localhost:8080/api/v1/notification?token=${token}`,
            onConnect: (frame)=> {
                console.log("notification connected as "+user?.username);
                stompClient.current?.subscribe(`/topic/${user?.username}`,(message)=>{
                    NotificationActions.current.forEach((action)=>{
                        action(JSON.parse(message.body) as Notification)
                    })
                    console.log(message.body)
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
    
    const sendNotifification = (contact:Contact,notification:Notification)=>{
            if(stompClient.current && stompClient.current.connected){
                if('message' in notification){
                    let chatNotfication = notification as ChatNotification;
                    stompClient.current.publish({
                        destination:`/app/${contact.username}/notify`,
                        body:JSON.stringify(notification)})
                }
            }
    }
    const onNotification = (action:(notification:Notification)=>void)=>{
             NotificationActions.current.push(action);
    }


    return <NotificationContext.Provider value={{sendNotifification,onNotification}}>
         {
            popup==null?
            <></>:
            <div className="absolute top-0 left-0 h-screen w-screen flex justify-center items-center z-100" >
                <div className="absolute h-full w-full bg-[#00000033] top-0 left-0" onClick={()=>{openPopup(null)}}></div>
                {popup}
            </div>
            
        }
        {children}
    </NotificationContext.Provider>
}



export const useNotification = () =>{
    const context = useContext(NotificationContext);
    if(!context) throw  new Error("u can't use the useNotification outside of a NotificationProvider");
    return context;
}

export default NotificationProvider;