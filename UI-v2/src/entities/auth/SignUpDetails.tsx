import { Gender } from "../user/User";

type SignUpDetails = {
    username:string;
    firstname:string;
    lastname:string
    password:string;
    confirmPassword:string;
    email:string;
    phone:number;
    gender:Gender
    birthdate:Date;
}


export default SignUpDetails;