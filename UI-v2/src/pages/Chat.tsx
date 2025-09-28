import { useEffect, useState } from "react"
import Card from "../components/ui/Card"
import useChat from "../hooks/useChat"
import ChatService from "../services/chat-service";
import Conversation from "../entities/chat/Conversation";
import ContactView from "./chat/component/ContactView";
import ConversationView from "./chat/component/ConversationView";
import VideoCallButton from "./chat/component/VideoCallButton";
import VoiceCallButton from "./chat/component/VoiceCallButton";

export default function Chat(){
    const {sendMessage,loading,chat} = useChat()
    const [activeConv,setActiveConv] = useState<Conversation | null>(null)
    
    
    if(loading) return <>Loading</>
    return <div className="w-full h-full bg-background-light dark:bg-background-dark flex ">
                <div className="w-2/6 h-full min-w-100 max-w-140 border-r border-border-light dark:border-border-dark flex flex-col">
                    <div className=" h-18 w-full border-b border-border-light dark:border-border-dark p-4 flex items-center justify-between">
                        <h1 className="text-xl font-semibold ">Messages</h1>
                        <Card className="px-2 py-1 shadow-none border-none *:cursor-pointer">
                            <button  className="text-xl ">
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </Card>
                    </div>
                    <div className="flex-1 overflow-scroll ">
                        {chat?.map((element,index)=>(
                            <ContactView key={index} onClick={()=>{setActiveConv(element)}} lastMessage={ChatService.getLastMessage(element)} contact={element.contact}></ContactView>
                        ))}
                    </div>
                </div>
                <div className="flex-1 h-full">
                        {activeConv?<>
                        <div className="h-18 w-full border-b border-border-light dark:border-border-dark p-4 flex items-center justify-between gap-3">
                            <div className="flex-1 flex gap-5"> 
                                <img className="w-14 aspect-square rounded-full" src={`http://localhost:8080/api/v1/media/${activeConv.contact.profileId}`} />
                                <div className="">
                                    <h1 className="text-xl font-semibold">{activeConv.contact.username}</h1>
                                    <p>{activeConv.contact.isOnline?"online":activeConv.contact.lastOnline?.getDate()}</p>
                                </div>
                            </div>
                            <VideoCallButton />
                            <VoiceCallButton />
                        </div>
                        <ConversationView conversation={activeConv}/>

                        </>
                        :<div className="w-full h-full flex justify-center items-center">
                            <i className="fa-regular fa-message  text-center text-9xl text-secondary-light "></i>
                        </div>
                        }
                </div>

        </div>
}