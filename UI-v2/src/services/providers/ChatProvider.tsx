import { createContext } from "react"

type ChatContextType = {

}

const ChatContext = createContext<ChatContextType | null>(null);


const ChatProvider