import { useNavigate } from "react-router-dom";
import authApi from "../api/auth";
import JwtToken from "../entities/auth/JwtToken";
import LoginDetails from "../entities/auth/LoginDetails";
import SignUpDetails from "../entities/auth/SignUpDetails";
import Exception, { ExceptionType } from "../types/Exception";

const AuthService = {
    login: async (username:string,password:string,email?:string)=>{
        let details:LoginDetails = {
            username:username,
            password:password,
        };
        try{
            let token:JwtToken = await authApi.login(details);
            localStorage.setItem("token",token.token);
            window.location.href="/"
            return null;
        }catch(e: unknown){
                if(e instanceof Exception){      
                    if(e.type == ExceptionType.BAD_CREDENTIAL){
                        console.log("catching exception",e as Exception)
                        return {isError:true,Errors:{username:"Bad creadentials",password:"Bad credentials"}}                
                    }else {
                        console.error("Unknown error during login:", e);
                        return {isError:true,Errors:{unknown:"Unknown error during login"}}
                    }
            }else{console.log(e)}}
    },

    signUp: async (signUpDetails:SignUpDetails)=>{
        try{
            await authApi.signup(signUpDetails);
            window.location.href = "/login";
         }catch(e){
            console.warn("error on auth-service ",e);
        }
    },

    logout:() => {
        localStorage.removeItem('token');
        window.location.href = "/login";
    }
}


export default AuthService;