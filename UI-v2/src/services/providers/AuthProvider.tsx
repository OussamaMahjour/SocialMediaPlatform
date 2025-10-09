import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import User from "../../entities/user/User";
import UserService from "../user-service";
import { useTheme } from "./ThemeProvider";
import useMount from "../../hooks/useMount";


type AuthContextType = {
    user:User | null
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({children}:{children:ReactNode}){
    
    const [user,setUser] = useState<User | null>(null)
    const [loading,setLoading] = useState(true)
    const {theme} = useTheme();
    useMount("AuthProvider")
    useEffect(()=>{
        const initialUser = async ()=>{
            const loggedUser = await UserService.getLoggedUser();
            if(loggedUser){
                setUser(loggedUser)   
            }
            setLoading(false);
        }
        setTimeout(()=>{initialUser()},1000)
        
    },[])
    
    if(loading)return <div className="h-screen w-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark flex justify-center items-center">
            <img className="aspect-square w-15" src={`/icon-${theme}.svg`} />
            <h1 className="text-4xl text-text-light dark:text-text-dark font-bold">Cosmos</h1>
    </div>
    return <AuthContext.Provider value={{user}}>
        {children}
    </AuthContext.Provider>
}



export function useAuth(){
    const context = useContext(AuthContext);
    if(!context)throw Error("useAuth must be used within an AuthProvider")
    return context;
}