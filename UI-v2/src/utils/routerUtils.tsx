import { ReactNode } from "react";
import NoneAuthenticatedRoute from "./NoneAuthenticatedRoute";
import AuthenticatedRoute from "./AuthenticatedRoute";


type Route = {
    path:string;
    element:ReactNode;
}


const routerUtils = {
    creatRoutes:(publicRoutes:Route[],noneAuthenticatedRoutes:Route[],authenticatedRoutes:Route[]) =>{
        noneAuthenticatedRoutes.forEach((e)=>{
            e.element = <NoneAuthenticatedRoute>{e.element}</NoneAuthenticatedRoute>
        })
        authenticatedRoutes.forEach((e)=>{
            e.element = <AuthenticatedRoute>{e.element}</AuthenticatedRoute>
        })
        return [...publicRoutes,...noneAuthenticatedRoutes,...authenticatedRoutes]
    }
}

export default routerUtils;