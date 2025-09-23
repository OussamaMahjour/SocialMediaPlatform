import { Client } from "@stomp/stompjs";
import Message from "../types/Message";

const BASE_URL = "http://localhost:8080/api/v1/chat"


const chatApi = {

    getChats:async (username:string,token:string)=>{
        const response = await fetch(BASE_URL+"/"+username,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return response.json()
    },

    updateMessage:async (token:string,message:Message)=>{
        const response = await fetch(BASE_URL,{
            method:"PUT",
            headers:{
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify(message)
        })
    },

    getChatStompClient:(token:string)=>{
        const stompClient = new Client({
            brokerURL:`${BASE_URL}?token=${token}`
        })
        return stompClient;

    },

    getCallStompClient:(token:string)=>{
        const stompClient = new Client({
            brokerURL:`${BASE_URL}?token=${token}`
        })
        return stompClient;
    },

    

}

export default chatApi