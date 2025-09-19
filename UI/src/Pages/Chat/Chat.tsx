import { ReactElement, useEffect, useRef, useState } from "react";
import Account from "./component/Account";
import Conversation from "../../types/Conversation";
import Contact from "../../types/Contact";
import Discussion from "./component/Discussion";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import Message, { MessageType } from "../../types/Message";
import notificationSound from '../../assets/notification.mp3';
import { useAuth } from "../../provider/AuthProvider";
import Input from "../../components/Input";
import ThemeButton from "../../components/ThemeButton";
import Button from "../../components/Button";
import ButtonInverse from "../../components/ButtonInverse";
import Attachement, { AttachementType } from "../../types/Attachement";
import ReactPlayer from "react-player";
import VideoCall from "./component/VideoCall";
import CallProvider from "../../provider/CallProvider";
import { useNotification } from "../../provider/NotificationProvider";
import { useTheme } from "../../provider/ThemeProvider";






function Chat():ReactElement | null{
    const stompClient = useRef<Client | null>(null)
    
    const [conversations,setConversations] = useState<Conversation[]>([])
    const [currentContact,setCurrentContact] = useState<Contact>()
    const destinationRef = useRef<HTMLInputElement>(null);
    const [,setUnseenConvo] = useState(0)
    const messageRef = useRef<HTMLInputElement>(null)
    const {user,token,openSetting,getContact} = useAuth()
    const [attachent,setAttachment] = useState<Attachement | null>(null)
    const filePicker = useRef<any>()
    const attachementMenu = useRef<HTMLDivElement | null>(null)
    const [isConnected,setIsConnected] = useState(false)
    
    const [popup,openPopup] = useState<ReactElement|null>(null)
    if(!user) return null;

    useEffect(()=>{
        stompClient.current = new Client({
            brokerURL:`ws://localhost:8080/api/v1/chat?token=${token}`,
            onConnect:(frame)=>{
                let subscription: StompSubscription | undefined;
                console.log("connected as "+user.username)
                setIsConnected(true)
                // Only attempt to subscribe when we have a proper connection
                if (stompClient.current && stompClient.current.connected ) {
                    console.log(`Subscribing to /queue/${user.username}/chat`)
                    
                    try {
                        subscription = stompClient.current.subscribe(`/queue/${user.username}/chat`, (msg: IMessage) => {
                            try {
                                const raw: Message = JSON.parse(msg.body);
                                console.log('Received message from:', raw.owner, raw);
                                
                                // Convert sentAt to Date object
                                raw.sentAt = new Date(raw.sentAt);
                                
                                // Register the message
                                registerMessage(raw.owner, raw);
                                
                                // Handle notification
                                setUnseenConvo(prev => {
                                    const newCount = prev + 1;
                                    const audio = new Audio(notificationSound);
                                    audio.play().catch(e => console.log("Could not play notification sound:", e));
                                    updateTitle(newCount);
                                    return newCount;
                                });
                                
                            } catch (err) {
                                console.error('Failed to parse message:', err);
                            }
                        });
                        
                        console.log("Successfully subscribed to chat queue");
                        
                        // Load existing chat history after successful subscription
                        getChat();
                        
                    } catch (error) {
                        console.error("Failed to subscribe to chat queue:", error);
                    }
                } else {
                    console.log("Not subscribing - Connection state:", {
                        isConnected,
                        hasStompClient: !!stompClient.current,
                        isStompConnected: stompClient.current?.connected,
                        hasUser: !!user
                    });
                }

                // Cleanup function
                return () => {
                    if (subscription) {
                        console.log("Unsubscribing from chat queue");
                        try {
                            subscription.unsubscribe();
                        } catch (error) {
                            console.error("Error during unsubscribe:", error);
                        }
                    }
                    if(isConnected && stompClient.current?.connected){
                        stompClient.current.deactivate();
                        setIsConnected(false);
                    }
                
                };
            }
        })
        stompClient.current.activate()
    },[])

    const getChat = async () =>{
        const response = await fetch(`http://localhost:8080/api/v1/chat/${user.username}`,{
            headers:{
                 Authorization:`Bearer ${token}`,
            }
        })

        const data= await response.json()
        const chats:{username:string,messages:Message[]}[] = data;
        chats.forEach(e=>{
            e.messages.forEach(m=>{
                m.sentAt = new Date(m.sentAt)
                registerMessage(e.username,m)
            })
        })
       
    }
    const updateTitle = (count: number) => {
        
        document.title = `${count > 0 ? `(${count})` : ''} ChatApp`;
    };
    


    const registerMessage = (destination:string,message:Message)=>{
        getContact(destination).then(contact=>{
            setConversations((prev) => {
                const found = prev.find((conv) => conv.contact.username === destination);
                if (found) {
                    return prev.map(conv =>
                        conv.contact.username === destination
                            ? { ...conv, messages: [...conv.messages, message] }
                            : conv
                    );
                } else {
                    return [...prev, { contact: contact, messages: [message] }];
                }
            });    
        })       
    }
  

    const updateMessage = async(message:Message) => {
        await fetch("http://localhost:8080/api/v1/chat/message",{
            headers:{
                 Authorization:`Bearer ${token}`,
                 "Content-Type": "application/json",
            },
            method: "PUT",
            
            body:JSON.stringify({id:message.id,body:message.body,seen:message.seen})
        })
    }
    const setActiveContact = (contact: Contact) => {
        setConversations(prev => {
            return prev.map(conv =>
                conv.contact.username === contact.username
                    ? {
                        ...conv,
                        messages: conv.messages.map(message => {
                            if(message.owner == contact.username){
                                message.seen = true
                                updateMessage(message)
                            }
                            return message;
                        })
                    }
                    : conv
            );
        });
        
        setUnseenConvo(prev => {
            const newCount = prev > 0 ? prev - 1 : 0;
            updateTitle(newCount);
            return newCount;
        });
        setCurrentContact(contact);
    };

    const uploadFile = async (attachent:Attachement)=>{
        if(!attachent.file)return
        let formData = new FormData()
        formData.append("context", "message");
        formData.append("medias", attachent.file);
        let response = await fetch("http://localhost:8080/api/v1/media",{
            method:"POST",
            body:formData,
            headers: {
              Authorization: `Bearer ${token}`,
          }
        })
        let ids = await response.json()
        return ids[0]
    }
    const sendMessage = async (destination:string,message:Message)=>{
        if (isConnected && stompClient.current!=null ) {
            if(attachent){
                message.body = await uploadFile(attachent)
                message.type = attachent.type
                console.log("sending attachment")
            }
            console.log("sending message")
            stompClient.current.publish({
            destination: `/app/${destination}/chat`,
            body: JSON.stringify({...message,sentAt: message.sentAt.toISOString()}),
            });
            registerMessage(destination,message)  
            messageRef.current!.value=""                                  
        }
       
                      
    
    }

    return <div className="h-full  w-full  rounded shadow-md dark:shadow-secondary-dark  dark:border-border-dark  border-border-light flex bg-background-light dark:bg-background-dark relative">
        {
            popup==null?
            <></>:
            <div className="absolute top-0 left-0 h-screen w-screen flex justify-center items-center" >
                <div className="absolute h-full w-full bg-[#00000033] top-0 left-0" onClick={()=>{openPopup(null)}}></div>
                {popup}
            </div>
            
        }
        
        {/*contacts list*/}
          
        <div className="h-full max-w-100 w-1/3 border-r dark:border-border-dark border-border-light flex-col flex ">
            <div className="h-20 border-b   dark:border-border-dark border-border-light  w-full flex px-4 py-3 gap-2 ">
                <img src={"http://localhost:8080/api/v1/media/"+user.profilePictureId} className="h-full aspect-square rounded-full cursor-pointer" onClick={openSetting}/>
                <h1 className="h-full w-5/7 text-center flex items-center font-bold text-xl dark:text-text-dark text-text-light">
                    Chats
                </h1>
                <ThemeButton className="w-3/7 " />
                
                <Button className="h-full w-1/7 text-center  text-text-light dark:text-text-dark flex justify-center items-center font-bold text-xl cursor-pointer rounded hover:dark:bg-accent-dark hover:bg-accent-light" 
                    onClick={()=>openPopup(
                        <div id="popup" className="z-100 min-w-1/4 w-100 rounded  shadow-md dark:shadow-secondary-dark  border  border-accent-light flex bg-background-light dark:bg-background-dark flex-col items-center justify-around gap-4 " > 
                            <div className="h-20 w-full flex p-3 py-4 gap-1  ">
                                <Input ref={destinationRef} id="destination" placeholder="Username" />
                            </div>
                            <div className="h-20 w-full flex p-3 py-4 gap-1 border-t dark:border-border-dark border-border-light ">
                                <Button className="h-full aspect-square   font-bold text-xl ">
                                    <i className="fa-solid fa-paperclip"></i>
                                </Button>
                                <Input id="message" ref={messageRef} placeholder="Write something..." className="p-3 focus:outline-hidden dark:border-border-dark dark:focus:border-border-light focus:border-border-dark flex-1 h-full border border-border-light rounded  text-text-light dark:text-text-dark"/>
                                <ButtonInverse className="h-full aspect-square  text-xl  " 
                                    onClick={()=>{
                                        const destination = destinationRef.current?.value || "";
                                        const message = messageRef.current?.value || "";
                                        if (destination.length !== 0 && message.length !== 0) {
                                            console.log("Call before message send ")
                                            console.log(message,destination)
                                          sendMessage(destination,{
                                            body: message,
                                            owner:user.username,
                                            seen: false,
                                            type:MessageType.TEXT,
                                            sentAt: new Date(),
                                          });
                                        }
                                        openPopup(null)                                      
                                    }}>
                                    <i className="fa-solid fa-paper-plane "></i>
                                </ButtonInverse>
                            </div>
                        </div>
                    )}
                >
                    <i className="fa-solid fa-plus"></i>
                </Button>

            </div>
            {/*Accounts list*/}
            <div className="w-full h-full flex-1 overflow-auto p-3">
                {
                    conversations.map((e,index)=>(
                        <Account 

                            key={index} 
                            contact={e.contact}
                            lastMessage={e.messages[(e.messages.length>0?e.messages.length-1:0)]} 
                            lastMessageTime={e.messages[(e.messages.length>0?e.messages.length-1:0)].sentAt} 
                            nbrOfUnSeenMessages={e.messages.filter(e=>!e.seen&&e.owner!=user.username).length}
                            setCurrentContact={setActiveContact}
                            isActive={currentContact==e.contact?true:false}
                            />
                    ))
                }
     
            </div>
        </div>

        {/* conversation container */}
        <div className="h-full w-2/3 flex-1 flex flex-col ">
        {   (currentContact!=undefined)?
            /* conversations header */
            <>
            <div className="h-20 border-b w-full  dark:border-border-dark border-border-light flex gap-3 p-3 ">
                <img className="h-full aspect-square rounded-full " src={currentContact?.profileId}></img>
                <div className="h-full w-8/10  justify-center flex flex-col  ">
                    <h1 className="w-full flex text-lg font-bold  text-text-light dark:text-text-dark">{currentContact?.username}</h1>
                    <p className="w-full text-secondary-light text-sm">{currentContact?.isOnline?"online":`last seen: ${currentContact?.lastOnline?.toLocaleDateString()}`}</p>
                </div>
                <button className="h-full aspect-square text-center  text-text-light dark:text-text-dark flex justify-center items-center font-bold text-xl cursor-pointer rounded hover:dark:bg-accent-dark hover:bg-accent-light">
                    <i className="fa-solid fa-phone"></i>
                </button>
                <button className="h-full aspect-square  text-center  text-text-light dark:text-text-dark flex justify-center items-center font-bold text-xl cursor-pointer rounded hover:dark:bg-accent-dark hover:bg-accent-light" onClick={()=>{
                    openPopup(
                        <CallProvider initCall={true} target={currentContact}>
                          
                        </CallProvider>
                        
                        
                    )
                }}>
                    <i className="fa-solid fa-video"></i>
                </button>
                <button className="h-full aspect-square  text-center  text-text-light dark:text-text-dark flex justify-center items-center font-bold text-xl cursor-pointer rounded hover:dark:bg-accent-dark hover:bg-accent-light" >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
            </div>
            
            {
                attachent && attachent.file?
                /* File visualiser */
                    <div className="flex-1 flex flex-col w-full bg-accent-light dark:bg-accent-dark">
                        <div className="h-10 w-full  pr-3 flex items-center justify-end">
                                <i className="fa-solid fa-xmark text-text-light dark:text-text-dark h-fit text-2xl cursor-pointer aspect-square text-center " onClick={()=>{
                                    setAttachment(null)
                                }}></i>
                        </div>
                        <div className="flex-1 w-full flex justify-center items-center ">
                            <div>
                                {
                                    attachent.type==AttachementType.IMAGE?
                                    <img  src={URL.createObjectURL(attachent.file)} />
                                    :attachent.type==AttachementType.VIDEO?
                                    <ReactPlayer
                                        style={{height:"100%"}}
                                        url={URL.createObjectURL(attachent.file)}
                                        controls
                                        playing={false}
                                        />
                                    :attachent.type==AttachementType.AUDIO?
                                    <ReactPlayer
                                        style={{height:"100%"}}
                                        url={URL.createObjectURL(attachent.file)}
                                        controls
                                        playing={false}
                                        />
                                    :<div className="flex gap-3 justify-center items-center font-bold text-text-light dark:text-text-dark">
                                        <i className="fa-solid fa-file text-5xl"></i> 
                                        <h1 className="text-xl ">{attachent.file.name}</h1>
                                    </div>
                                }
                            </div>
                        </div>
                        
                    </div>
                :
                /* conversation body */
                <Discussion  user={user}  conversation={
                conversations.filter((e=>e.contact.username==currentContact?.username))[0]
                }/>
            }
            
            
            <div className="h-20 w-full flex p-3 py-4 gap-1 border-t dark:border-border-dark border-border-light ">
               
                <div className="relative w-fit h-fit">
                    <div id="attachement-menu-container " className="hidden" ref={attachementMenu} >
                        <div className="w-screen h-screen fixed top-0 left-0  z-10" id="attachement-menu-closer" onClick={(e)=>{
                                if(!attachementMenu.current)return
                                attachementMenu.current.classList.add("hidden")
                                
                            }}></div>
                        <div  className="overflow-hidden z-20 absolute flex flex-col w-fit rounded bg-background-light dark:bg-background-dark text-sm left-1/2 top-0 -translate-x-1/2 -translate-y-2/2 border border-border-light dark:border-border-dark p-1">
                                <Button className="flex justify-start gap-2 font-bold" onClick={()=>{
                                if(!filePicker.current)return
                                setAttachment(prev=>{
                                    filePicker.current.accept="image/*"
                                    filePicker.current.click()
                                    return {file:null,type:AttachementType.IMAGE}})
                                }}>
                                    <i className="fa-solid fa-image text-xl"></i> 
                                    <h1>Image</h1></Button>
                                    
                                    <Button className="flex justify-start gap-2 font-bold" onClick={()=>{
                                if(!filePicker.current)return
                                setAttachment(prev=>{
                                    filePicker.current.accept="video/*"
                                    filePicker.current.click()
                                    return {file:null,type:AttachementType.VIDEO}})
                                }}>
                                
                                    <i className="fa-solid fa-film text-xl"></i> 
                                    <h1>Video</h1></Button>
                                    
                                    <Button className="flex justify-start gap-2 font-bold" onClick={()=>{
                                if(!filePicker.current)return
                                
                                setAttachment(prev=>{
                                    filePicker.current.accept="audio/*"
                                    filePicker.current.click()
                                    return {file:null,type:AttachementType.AUDIO}})
                                }}>
                                    <i className="fa-solid fa-headphones text-xl"></i> 
                                    <h1>Audio</h1></Button>
                                    
                                    <Button className="flex justify-start gap-2 font-bold" onClick={()=>{
                                if(!filePicker.current)return
                                setAttachment(prev=>{
                                    filePicker.current.accept=".*"
                                    filePicker.current.click()
                                    return {file:null,type:AttachementType.DOCUMENT}})
                                }}>
                                    <i className="fa-solid fa-file text-xl"></i> 
                                    <h1>Document</h1></Button>

                        </div>
                    </div>
                    <input onChange={(e)=>{
                                    setAttachment(prev=>{
                                        if(!prev || !e.target.files)return null
                                        return {file:e.target.files[0],type:prev.type}
                                    })
                                     if(!attachementMenu.current)return
                                     attachementMenu.current.classList.add("hidden")

                                }}  type='file' id='file' ref={filePicker} style={{display: 'none'}}/>
                    <Button className="h-full aspect-square relative  font-bold text-xl " onClick={()=>{
                        if(!attachementMenu.current)return
                            attachementMenu.current.classList.remove("hidden")
                    }}>
                        
                        
                        <i className="fa-solid fa-paperclip"></i>
                    </Button>
                </div>
                <Input id="message" ref={messageRef} placeholder="Write something..." className="p-3 focus:outline-hidden dark:border-border-dark dark:focus:border-border-light focus:border-border-dark flex-1 h-full border border-border-light rounded  text-text-light dark:text-text-dark"/>
                <ButtonInverse className="h-full aspect-square  text-xl  " 
                    onClick={()=>{
                            const message = messageRef.current?.value || "";
                            if (currentContact.username.length !== 0 && (message.length !== 0 || (attachent!=null && attachent.file!=null))) {
                                sendMessage(currentContact.username,{
                                    body: message,
                                    owner: user.username,
                                    seen: false,
                                    type:MessageType.TEXT,
                                    sentAt: new Date(),
                                });
                                setAttachment(null)
                            }
                           
                        }}
                >
                    <i className="fa-solid fa-paper-plane "></i>
                </ButtonInverse>
            </div>
            </>:
            <div className="flex h-full w-full bg-accent-light dark:bg-accent-dark justify-center items-center ">
                    <i className="fa-regular fa-message  text-center text-9xl text-secondary-light "></i>
            </div>
            }
        </div>
        
    </div>
}


export default Chat;