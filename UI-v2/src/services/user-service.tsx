import User from "../entities/user/User";
import { userApi } from "./api/users";

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
    }
}

export default UserService;