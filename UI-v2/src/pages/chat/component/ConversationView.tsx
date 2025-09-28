import Conversation from "../../../entities/chat/Conversation";
import Message from "../../../entities/chat/Message";
import { useAuth } from "../../../services/providers/AuthProvider";

const ConversationView = ({conversation}:{conversation:Conversation})=>{
    const {user} = useAuth()
    return <div className="w-full h-full "> 
            {conversation.messages.map((message,index)=>(
                (message.owner==user?.username)?
                <UserMessage message={message} />:
                <ContactMessage message={message} />
            ))}
    </div>
}


const UserMessage = ({message}:{message:Message})=>{
    return <div className="w-full flex justify-end">
        <p className="text-sm ">{new Date(message.sentAt).getDate()}</p>
        <h1 className="bg-accent-light dark:bg-accent-dark ">
                {message.body}
        </h1>
    </div>
}

const ContactMessage = ({message}:{message:Message})=>{
    return <div className="w-full flex justify-start">
        <p className="text-sm ">{new Date(message.sentAt).getDate()}</p>
        <h1 className="dark:bg-accent-light bg-accent-dark ">
                {message.body}
        </h1>
    </div>
}

export default ConversationView;