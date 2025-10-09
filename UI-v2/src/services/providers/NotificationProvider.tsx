import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Account from "../../entities/user/Account"
import NotificationService from "../notification-service";
import { Client } from "@stomp/stompjs";
import Notification from "../../entities/notification/Notification";
import UserService from "../user-service";
import ChatNotification, { ChatNotificationType } from "../../entities/notification/ChatNotification";
import CallService from "../call-service";
import { usePopup } from "./PopupProvider";
import CallProvider from "./CallProvider";


type NotificationContextType = {
    notify:(notification:Notification,destination:Account)=>void;
    onNotification:(action:(notification:Notification)=>void)=>void;
}


const NotificationContext = createContext<NotificationContextType | null>(null)



const NotificationProvider = ({children}:{children:React.ReactNode})=>{
    const [client,setClient] = useState<Client | null>(null);
    const NotificationActions = useRef<((notification:Notification)=>void)[]>([]); 
    const {openPopup} = usePopup();

    const defaultNotficationActions = [
        async (notification:Notification)=>{
            var chatNotification = notification as ChatNotification
            var contact = await UserService.getUser(chatNotification.senderUsername)
            if(!contact)return
            if(chatNotification.MessageType = ChatNotificationType.VOICE_CALL){
                    openPopup(<CallProvider contact={contact} init={false} ></CallProvider>)
                
                    }
        }
    ]
    useEffect(()=>{
        
        console.log("test")
        const init = async ()=>{
            const stompClient  = await NotificationService.initialSocketConnnection((notification:Notification)=>{
                 NotificationActions.current.forEach((action)=>{
                        action(notification)
                    })
            })
            setClient(stompClient);
            
        }
        init()
        return ()=>{ 
                client?.deactivate();
                client?.unsubscribe("notification-sub")
            }
        
    },[])

    useEffect(()=>{
       
        defaultNotficationActions.forEach((e)=>{
            NotificationActions.current.push(e)
        })
        return ()=>{
             NotificationActions.current = []
        }
    },[])


    const notify =(notification:Notification,destination:Account)=>{
        if(!client)return;
        console.log("sending notfication")
        NotificationService.notify(notification,destination,client)
    }

    const onNotification = (action:(notification:Notification)=>void)=>{
             NotificationActions.current.push(action);
    }

    return <NotificationContext.Provider value={{notify,onNotification}}>
        {children}
    </NotificationContext.Provider>
}

export default NotificationProvider

export const useNotification = ()=>{
    const context = useContext(NotificationContext);
    if(!context)throw Error("useNotification must be used within NotificationProvider")
    return context;
}

