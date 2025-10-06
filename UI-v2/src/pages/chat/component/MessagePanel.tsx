import { useEffect, useRef, useState } from "react"
import Attachement, { AttachementType } from "../../../entities/chat/Attachement"
import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/Input"
import ButtonInverse from "../../../components/ui/ButtonInverse"
import { useChat } from "../../Chat"
import { useAuth } from "../../../services/providers/AuthProvider"
import { MessageType } from "../../../entities/chat/Message"




const MessagePanel = ()=>{
    const attachementMenu = useRef<HTMLDivElement | null>(null)
    const filePicker = useRef<any>()
    const [message,setMessage] =  useState("")
    const {user} = useAuth()
    const {sendMessage,setAttachments,activeConv,attachments} = useChat();
    

    const onFileSelect = (files:FileList | null)=>{
                    if(!files) return         
                    let attachments:Attachement[] = [];
                    for(let i =0;i<files.length;i++){
                        let fileType = files[i].type.split('/')[0]
                        
                        switch(fileType){
                            case "image":
                                attachments.push({file:files[i],type:AttachementType.IMAGE})
                                break;
                            case "video":
                                attachments.push({file:files[i],type:AttachementType.VIDEO})
                                break;
                            case "audio":
                                attachments.push({file:files[i],type:AttachementType.AUDIO})
                                break;
                            default:
                                attachments.push({file:files[i],type:AttachementType.DOCUMENT})
                                break;
                        }
                    }
                    setAttachments(attachments)
                    if(!attachementMenu.current)return
                    attachementMenu.current.classList.add("hidden")
    }

    const getAttachment = (attachmentType:AttachementType)=>{
        if(!filePicker.current)return
        
        switch(attachmentType){
            case AttachementType.AUDIO:
                filePicker.current.accept="audio/*"
                break;
            case AttachementType.DOCUMENT:
                filePicker.current.accept="./*"
                break;
            case AttachementType.IMAGE:
                filePicker.current.accept="image/*"
                break;
            case AttachementType.VIDEO:
                filePicker.current.accept="video/*"
                break;
        }
        filePicker.current.click()
    }
    
    
    
    
    return <div className="h-20  w-full flex p-3 py-4 gap-1 border-t dark:border-border-dark border-border-light ">
               
                <div className="relative w-fit h-fit">
                    <div id="attachement-menu-container " className="hidden" ref={attachementMenu} >
                        <div className="w-screen h-screen fixed top-0 left-0  z-10" id="attachement-menu-closer" onClick={(e)=>{
                                if(!attachementMenu.current)return
                                attachementMenu.current.classList.add("hidden")
                                
                            }}></div>
                        <div  className="overflow-hidden z-20 absolute flex flex-col w-fit rounded bg-background-light dark:bg-background-dark text-sm left-1/2 top-0 -translate-x-1/2 -translate-y-2/2 border border-border-light dark:border-border-dark p-1">
                                <Button className="flex justify-start gap-2 font-bold" onClick={()=>getAttachment(AttachementType.IMAGE)}>
                                    <i className="fa-solid fa-image text-xl"></i> 
                                    <h1>Image</h1>
                                </Button>
                                    
                                <Button className="flex justify-start gap-2 font-bold" onClick={()=>getAttachment(AttachementType.VIDEO)}>
                                    <i className="fa-solid fa-film text-xl"></i> 
                                    <h1>Video</h1>
                                </Button>
                                    
                                <Button className="flex justify-start gap-2 font-bold" onClick={()=>getAttachment(AttachementType.AUDIO)}>
                                    <i className="fa-solid fa-headphones text-xl"></i> 
                                    <h1>Audio</h1>
                                </Button>
                                    
                                <Button className="flex justify-start gap-2 font-bold" onClick={()=>getAttachment(AttachementType.DOCUMENT)}>
                                    <i className="fa-solid fa-file text-xl"></i> 
                                    <h1>Document</h1>
                                </Button>

                        </div>
                    </div>

                    {/*file picker  */}
                    <input onChange={(e)=>{onFileSelect(e.target.files)}}  type='file' id='file' ref={filePicker} style={{display: 'none'}}/>
                    
                    
                    <Button className="h-full aspect-square relative  font-bold text-xl " onClick={()=>{
                        if(!attachementMenu.current)return
                            attachementMenu.current.classList.remove("hidden")
                    }}>
                        
                        
                        <i className="fa-solid fa-paperclip"></i>
                    </Button>
                </div>
                <Input
                onKeyDown={(e)=>{
                    if(e.key ==="Enter"){
                        document.getElementById("sendMessage")?.click();
                    }
                }}
                
                
                value={message} autoFocus id="message" onChange={(e)=>{setMessage(e.target.value)}} placeholder="Write something..." className="p-3 focus:outline-hidden dark:border-border-dark dark:focus:border-border-light focus:border-border-dark flex-1 h-full border border-border-light rounded  text-text-light dark:text-text-dark"/>
                <ButtonInverse id="sendMessage" className="h-full aspect-square  text-xl  " 
                   
                    onClick={()=>{
                            if (activeConv && user) {
                               
                                    sendMessage(activeConv.contact,{
                                        body: message,
                                        owner: user.username,
                                        seen: false,
                                        type:MessageType.TEXT,
                                        sentAt: new Date(),
                                    });
                                    setMessage("");
                                
                            }
                           
                        }}
                >
                    <i className="fa-solid fa-paper-plane "></i>
                </ButtonInverse>
            </div>
}



export default MessagePanel