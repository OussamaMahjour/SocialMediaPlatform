import { Gender } from "./User";

type SignUpDetails = {
    username:string;
    firstName:string;
    lastName:string
    password:string;
    confirmPassword:string;
    email:string;
    phone:number;
    gender:Gender
}


export default SignUpDetails;