import { useEffect, useRef, useState } from "react"

type AlertContextType = {
    openAlertDialogue:(alert:string)=>void;
    
}


export function AlertProvider({children}:{children:}){
    const [alertMessage,setAlert]  = useState<{message:string,timeout:number}>({message:"",timeout:0})
    const alertRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                setAlert({message:"",timeout:0})
            } 
            });
        });
    
        if (alertRef.current) {
            observer.observe(alertRef.current);
        }
    
        return () => {
            if (alertRef.current) {
            observer.unobserve(alertRef.current);
            }
        };
    }, []);

    const openAlertDialogue = (alert:string)=>{
        setAlert({message:alert,timeout:2000})
    }

    return <div>

    </div>
}