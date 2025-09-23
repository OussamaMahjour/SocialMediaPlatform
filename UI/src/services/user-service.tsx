import { userApi } from "../api/users";
import User from "../entities/user/User";

const UserService = {
    getLoggedUser: async ()=>{
        let token = localStorage.getItem("token");
        if(!token)throw Error("no user is logged in");
        try{
            let user:User = await userApi.getUserFromToken(token);
            return user
        }catch(e){
            console.warn("error on user service",e)
        }
        return null
            
    }
}

export default UserService;