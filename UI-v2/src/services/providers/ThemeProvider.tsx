import { createContext, ReactNode, useContext,  useState } from "react"



type ThemeContextType = {
    theme:string | null;
    toggleTheme:()=>void ;
   
}

export const ThemeContext = createContext<ThemeContextType | null>(null)



export default function ThemeProvider ({children}:{children:ReactNode}){
    
    const [theme,setTheme] = useState<string | null>(()=>localStorage.getItem("theme"));

    const toggleTheme = ()=>{
        if(theme=="light"){
            setTheme(()=>{
                localStorage.setItem("theme","dark")
                return "dark"
            })
        }else{
            setTheme(()=>{
                localStorage.setItem("theme","light")
                return "light"
            })
        }
        
    }
    
    return <ThemeContext.Provider value={{theme,toggleTheme}}>
        <div className={`${theme}  h-full w-full relative `}>
            {children}
        </div>
    </ThemeContext.Provider>
}



export function useTheme(){
    const context = useContext(ThemeContext);
    if(!context)throw Error("useTheme must be using within a ThemeProvider")
    return context;
}

