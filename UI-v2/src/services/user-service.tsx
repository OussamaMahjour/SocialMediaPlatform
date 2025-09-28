import Account from "../entities/user/Account";
import User from "../entities/user/User";
import { userApi } from "./api/users";

const UserService = {
    getLoggedUser: async ()=>{
        // let token = localStorage.getItem("token");
        // if(!token)return null
        // try{
        //     let user:User = await userApi.getUserFromToken(token);
        //     return user
        // }catch(e){
        //     console.warn("error on user service",e)
        // }   
        return {
            username:"os11"
        }
    },
    getUser: async (username:string)=>{
        let token = localStorage.getItem("token");
        if(!token)return null
        try{
            const account:Account = await userApi.getUser(username,token);
            return account;
        }catch(e){
            console.warn("error getting user "+username);
        }
        
    }
}

export default UserService;