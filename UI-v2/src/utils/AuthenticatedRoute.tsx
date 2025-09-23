import { ReactNode } from "react";
import { useAuth } from "../services/providers/AuthProvider";
import { Navigate } from "react-router-dom";
import Template from "../components/Template";

export default function AuthenticatedRoute({children}:{children:ReactNode}){
    const {user} = useAuth();
    if(!user)return <Navigate to="/login" />
    return <>
        <Template>
            {children} 
        </Template>
    </>
}