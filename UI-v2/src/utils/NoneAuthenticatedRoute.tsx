import { ReactNode } from "react";
import { useAuth } from "../services/providers/AuthProvider";
import { Navigate } from "react-router-dom";

export default function NoneAuthenticatedRoute({children}:{children:ReactNode}){
    const {user} = useAuth();
    if(user) return  <Navigate to="/" />
    return children
}