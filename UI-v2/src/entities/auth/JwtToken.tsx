import User from "../user/User";

type JwtToken = {
    token:string;
    expiresIn:number;
    user:User
}


export default JwtToken;