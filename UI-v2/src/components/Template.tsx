import { ReactNode, useRef } from "react";
import { useTheme } from "../services/providers/ThemeProvider";
import { useAuth } from "../services/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import ThemeButton from "./ui/ThemeButton";
import mediaApi from "../services/api/media";
import useMount from "../hooks/useMount";
import Img from "./ui/Img";
import UserService from "../services/user-service";
import { usePopup } from "../services/providers/PopupProvider";
import { InfoLevel } from "./ui/InfoPopup";

export default function Template({children}:{children:ReactNode}){
    const {theme} = useTheme()
    const {user} = useAuth()
    const navigate = useNavigate();
    const {showInfo} = usePopup()
    useMount("Template")

    const filePick = useRef<HTMLInputElement | null>(null)
    

    if(!user)return 
    return <div className="h-full w-full  flex flex-col">
                <div className="h-15 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark w-full flex justify-between px-4 items-center  border-b border-border-light dark:border-border-dark ">
                    <div onClick={()=>{navigate("/")}} className="flex items-center  justify-center cursor-pointer">
                        <img className="aspect-square w-10" src={`/icon-${theme}.svg`} />
                        <h1 className="text-2xl text-text-light dark:text-text-dark font-bold">Cosmos</h1>
                    </div>
                    <div className="flex h-full justify-between items-center gap-6 text-2xl mr-6">
                        <ThemeButton className="text-lg" />
                        <button onClick={()=>{navigate("/chat")}} className="cursor-pointer">
                            <i className="fa-solid fa-inbox"></i>
                        </button>
                        <button  className="cursor-pointer">
                            <i className="fa-solid fa-bell"></i>
                        </button>
                        <button className="aspect-square bg-accent-dark  rounded-full overflow-hidden cursor-pointer h-10" onClick={()=>{filePick.current?.click()}}>
                      
                                <Img   className="h-full w-full" id={user.profilePictureId}    />
                            
                            
                            <input ref={filePick} onChange={async (e)=>{
                                if(!e.target.files)return
                                let file = e.target.files[0]
                                await UserService.updateProfile(file);
                                showInfo("Profile Updated",InfoLevel.SUCCES)
                                }} accept="image/*" type="file" style={{display:"none"}}/>
                        </button>
                    </div>
                </div>
                <div className="flex-[1_1_0] overflow-scroll w-full ">
                {children}
                </div>
            </div>
}