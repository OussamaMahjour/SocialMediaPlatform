import Account from "../entities/user/Account";
import User from "../entities/user/User";
import authApi from "./api/auth";
import mediaApi from "./api/media";
import { userApi } from "./api/users";
import MediaService from "./media-service";


const UserService = {
    getLoggedUser: async ()=>{
        let token = localStorage.getItem("token");
        if(!token)return null
        try{
            let user:User = await userApi.getUserFromToken(token);
            return user
        }catch(e){
            console.warn("error on user service",e)
        }   
        
    },
    getUser: async (username:string)=>{
        let token = localStorage.getItem("token");
        if(!token)return null
        try{
            const account:Account = await userApi.getUser(username,token);
            console.log(account)
            return account;
            
        }catch(e){
            console.warn("error getting user "+username);
        }
        
    },
    search:async (prefix:string)=>{
        let token = localStorage.getItem("token");
        if(!token)return null
        const users:Account[] = await userApi.getUsersByPrefix(prefix,token);
        return users;
    },
    
    updateProfile:async (file:File)=>{
        const user = await UserService.getLoggedUser()
        const token = authApi.getJWTToken();
        if(!user)return
        userApi.changeProfile(user.username,token,file) 
             
    }
}

export default UserService;