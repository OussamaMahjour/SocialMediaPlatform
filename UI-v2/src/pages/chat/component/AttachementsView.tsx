import Attachement, { AttachementType } from "../../../entities/chat/Attachement";
import { useChat } from "../../Chat";
import ReactPlayer from "react-player";


const AttachmenstView = ()=>{
    const {attachments,setAttachments} = useChat();

    if(!attachments || attachments.length ==0)return
    return <div className="flex-1 flex justify-center items-center w-full h-full relative">
        <button onClick={()=>setAttachments(null)} className="absolute cursor-pointer top-10 right-10 text-accent-dark dark:text-accent-light ">
            <i className="fa-solid fa-x"></i>
        </button>
        {
            attachments.length == 1?
                
                    <AttachmentView attachment={attachments[0]}/>
                :
            attachments.map((attachment,index)=>(
                <div key={index} className="w-full h-full overflow-scroll">
                    <AttachmentView attachment={attachment} />
                </div>
            ))
        }
    </div>


}


const AttachmentView = ({attachment}:{attachment:Attachement})=>{
    return <div className="  w-2/3  flex items-center justify-center">
        {
            attachment.type==AttachementType.IMAGE?
            <img  src={URL.createObjectURL(attachment.file)} />
            :attachment.type==AttachementType.VIDEO?
            <ReactPlayer
                style={{height:"100%"}}
                src={URL.createObjectURL(attachment.file)}
                controls
                playing={false}
                />
            :attachment.type==AttachementType.AUDIO?
            <ReactPlayer
                style={{height:"100%"}}
                src={URL.createObjectURL(attachment.file)}
                controls
                playing={false}
                />
            :<div className="flex gap-3 justify-center items-center font-bold text-text-light dark:text-text-dark">
                <i className="fa-solid fa-file text-5xl"></i> 
                <h1 className="text-xl ">{attachment.file.name}</h1>
            </div>
        }
    </div>
}

export default AttachmenstView;