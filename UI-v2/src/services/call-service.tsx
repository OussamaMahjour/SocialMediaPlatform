import { Client } from "@stomp/stompjs";
import authApi from "./api/auth";
import chatApi from "./api/chats";
import UserService from "./user-service";
import { RTCMessage, RTCMessageType } from "../entities/chat/RTCMessage";
import Account from "../entities/user/Account";

const CallService = {
    initialCallSocket:async(
            contact:Account,
            onOffer?:()=>void,
            onAnswer?:()=>void,
            onIceCondidate?:()=>void,
            
        )=>{
            const token = authApi.getJWTToken()
            const user = await UserService.getLoggedUser();
            const client:Client = chatApi.getChatStompClient(token);
            const pc =  new RTCPeerConnection();
            client.onConnect = ()=>{
                if(client.connected){
                    console.log("connected to call socket")
                    client.subscribe(`/queue/call/${user?.username}`,async (message)=>{
                        console.log("getting msg ",message.body)
                        const rtcMessage:RTCMessage = JSON.parse(message.body);
                        switch(rtcMessage.messageType){
                            case RTCMessageType.CREAT_OFFER:
                                if (rtcMessage.sdp?.type === "offer") {
                                    await pc.setRemoteDescription(rtcMessage.sdp);
                                    const answer = await pc.createAnswer();
                                    try{
                                        
                                        await pc.setLocalDescription(answer);

                                    }catch(e){
                                    }
                   
                                    console.log("localDescription is ",pc.localDescription)
                                    
                                    if(client.connected){
                                         client.publish({
                                            destination:`/app/call/${contact?.username}`,
                                            body:JSON.stringify({
                                                sender: user?.username,
                                                messageType: RTCMessageType.CREAT_ANSWER,
                                                sdp: pc.localDescription,
                                            })    
                                        });
                                    }
                                    if(onOffer)onOffer()
                                    
                                   
                                }
                                break;

                            case RTCMessageType.CREAT_ANSWER:
                            
                                console.log("creating answer",rtcMessage.sdp)
                                try{
                                    if(onAnswer)onAnswer()
                                    await pc.setRemoteDescription(rtcMessage.sdp);
                                    
                                }catch(e){

                                }
                                break;
                            case RTCMessageType.ICE_CONDIDATE:
                                
                                console.log("received ice candidate ",rtcMessage.candidate)
                                pc.addIceCandidate(rtcMessage.candidate);
                                
                                break;
                        }
                    },{id:"call-sub"})
                }
            }
            client.activate()
            if(contact){
               
            }
            return {client,pc};
        },
        startHandShake:async (client:Client,pc:RTCPeerConnection,contact:Account)=>{
            const user = await UserService.getLoggedUser();
            
            
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            pc.onicecandidate = (event)=>{
                console.log("inside ice condidate")
                if(event.candidate && user){
                    
                    client.publish({
                        destination:`/app/call/${contact.username}`,
                        body:JSON.stringify({
                            sender:user?.username,
                            messageType:RTCMessageType.ICE_CONDIDATE,
                            candidate:event.candidate
                        })
                    })
                    }
                }
            
            client.publish({
                destination:`/app/call/${contact.username}`,
                body:JSON.stringify({
                    sender:user?.username,
                    messageType: RTCMessageType.CREAT_OFFER,
                    sdp: pc.localDescription,
                })
            });
        },
        
}


export default CallService;