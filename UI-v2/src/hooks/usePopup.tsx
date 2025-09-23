import { useEffect, useState } from "react"
import { createPortal } from "react-dom";



export const PopupContainer = ()=>{
    const [popup,setPopup] = useState();

    useEffect(()=>{
        
    },[]) 

    return <>
       
        {createPortal(
            <div className="h-screen w-screen z-layer-front bg-[#00000001] fixed top-0 left-0" >
                {popup}
            </div>,
            document.body)}
    </>
}

export const usePopup = ()=>{

}