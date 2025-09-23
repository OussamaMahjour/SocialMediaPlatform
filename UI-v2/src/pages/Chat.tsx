import { useEffect, useState } from "react"
import ChatService from "../services/chat-service";
import { Client } from "@stomp/stompjs";
import { MessageType } from "../entities/chat/Message";


export default function Chat(){
    const [loading,setLoading] = useState(true)
    const [client,setClient] = useState<Client | null>(null)

    useEffect(()=>{
        const init = async ()=>{
            const client = await ChatService.initialSocketConnnection((message)=>{
            console.log(message);
            })
            setClient(prev=>{
                setLoading(false);
                return client 
            });
        }
        init()
        

    })

    if(loading || !client )return <></>
    
    return <>
    <button onClick={()=>{
        ChatService.sendMessage("os11",{body:"heelo",owner:"os11",seen:false,type:MessageType.TEXT,sentAt:new Date()},client)
    }}>
        Send Message
    </button>
    
    </>
}