import Card from "../../components/ui/Card"
import mediaApi from "../../services/api/media"
import ChatService from "../../services/chat-service"
import { usePopup } from "../../services/providers/PopupProvider"
import { useChat } from "../Chat"
import AttachmenstView from "./component/AttachementsView"
import ContactSearch from "./component/ContactSearch"
import ContactView from "./component/ContactView"
import ConversationView from "./component/ConversationView"
import MessagePanel from "./component/MessagePanel"
import VideoCallButton from "./component/VideoCallButton"
import VoiceCallButton from "./component/VoiceCallButton"

const ChatView = ()=>{
    const {openConversation,activeConv,chat,attachments} = useChat();
    const {openPopup} = usePopup()


    return <div className="w-full h-full bg-background-light dark:bg-background-dark flex ">
                    <div className="w-2/6 h-full min-w-100 max-w-140 border-r border-border-light dark:border-border-dark flex flex-col">
                        <div className=" h-18 w-full border-b border-border-light dark:border-border-dark p-4 flex items-center justify-between">
                            <h1 className="text-xl font-semibold ">Messages</h1>
                            <Card className="shadow-none border-none *:cursor-pointer">
                                <button  className="text-xl px-2 py-1 " 
                                onClick={()=>openPopup(<ContactSearch onContactSelect={openConversation}></ContactSearch>)}>
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </Card>
                        </div>
                        <div className="flex-1 overflow-scroll ">
                            {chat?.map((element,index)=>(
                                <ContactView key={index} onClick={()=>openConversation(element.contact)} lastMessage={ChatService.getLastMessage(element)} contact={element.contact}></ContactView>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col h-full">
                            {activeConv?<>
                            <div className="h-18 w-full border-b border-border-light dark:border-border-dark p-4 flex items-center justify-between gap-3">
                                <div className="flex-1 flex gap-5"> 
                                    <img className="w-14 aspect-square rounded-full" src={mediaApi.getFileSrc(activeConv.contact.profileId)}/>
                                    <div className="">
                                        <h1 className="text-xl font-semibold text-text-light dark:text-text-dark">{activeConv.contact.username}</h1>
                                        <p>{activeConv.contact.isOnline?"online":activeConv.contact.lastOnline?.getDate()}</p>
                                    </div>
                                </div>
                                <VideoCallButton />
                                <VoiceCallButton />
                            </div>
                            {attachments?
                            <AttachmenstView />
                            :<ConversationView />
                            }
                            
                            <MessagePanel />
                            </>
                            :<div className="w-full h-full flex justify-center items-center">
                                <i className="fa-regular fa-message  text-center text-9xl text-secondary-light "></i>
                            </div>
                            }
                    </div>

            </div>
}



export default ChatView