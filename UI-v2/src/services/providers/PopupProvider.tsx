import { createContext, ReactNode, useContext,  useState } from "react";
import { createPortal } from "react-dom";
import InfoPopup, { InfoLevel, InfoMessage } from "../../components/ui/InfoPopup";
import useMount from "../../hooks/useMount";





type PopupContextType = {
    openPopup:(content:ReactNode,onClose?:()=>void)=>void;
    closePopup:()=>void;
    showInfo:(content:string,level:InfoLevel)=>void;
}

const PopupContext = createContext<PopupContextType | null>(null);


export default function PopupProvider({children}:{children:ReactNode}){
    const [popup,setPopup] = useState<ReactNode | null>(null);
    const [infoMsg,setInfoMessage] = useState<InfoMessage>({message:"",level:InfoLevel.GENERAL});
    useMount("PopupProvider")
    const openPopup = (content:ReactNode,onClose?:()=>void)=>{
        setPopup(content);
        if(onClose)onClose();
    }

    const closePopup = ()=>{
        setPopup(null);
    }

    const showInfo = (content:string,level:InfoLevel) =>{    
        setInfoMessage({message:content,level:level})
    }

    return <PopupContext.Provider value={{openPopup,showInfo,closePopup}}>
        {
            popup?createPortal(
                <div className="h-screen w-screen z-layer-9 bg-[#00000015] fixed top-0 left-0 flex justify-center items-center" >
                    <div className="absolute top-0 left-0 h-full w-full bg-transparent z-layer-background" onClick={closePopup}></div>
                    {popup}
                </div>,
                document.body
            ):<></>
            
        }
        <InfoPopup  info={infoMsg}  />
        {children}
    </PopupContext.Provider>
}


export function usePopup(){
    const context = useContext(PopupContext);
    if(!context)throw Error("usePopup must be used inside a PopupProvider");
    return context
}