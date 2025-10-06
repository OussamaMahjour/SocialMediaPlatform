import JwtToken from "../entities/auth/JwtToken";
import LoginDetails from "../entities/auth/LoginDetails";
import SignUpDetails from "../entities/auth/SignUpDetails";
import authApi from "./api/auth";
import Exception, { ExceptionType } from "../exceptions/Exception";
import { usePopup } from "./providers/PopupProvider";


type SignUpErrors = {
            username:string,
            firstname:string,
            lastname:string,
            password:string,
            confirmPassword:string,
            email:string,
            phone:string,
            gender:string,
            birthDay:string
}

const AuthService = {
    login: async (username:string,password:string,email?:string)=>{
        let details:LoginDetails = {
            username:username,
            password:password,
        };
        try{
            let token:JwtToken = await authApi.login(details);
            localStorage.setItem("token",token.token);
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
            let signupErrors:SignUpErrors | null = await authApi.signup(signUpDetails);
            return signupErrors;            
            
         }catch(e){
            console.warn("error on auth-service ",e);
        }
        return null;
    },

    logout:() => {
        localStorage.removeItem('token');
        window.location.href = "/login";
    },

    validateSignUpDetails:(signUpDetails:SignUpDetails)=>{
        let error = false;
        let signUpErrors:SignUpErrors = {
            username:"",
            firstname:"",
            lastname:"",
            password:"",
            confirmPassword:"",
            email:"",
            phone:"",
            gender:"",
            birthDay:""
        };
        if(!signUpDetails.email.includes("@")) signUpErrors.email = "Invalid Email"
        if(signUpDetails.password.length < 8) signUpErrors.password = "password must be atleast 8 charachters"
        if(signUpDetails.password !== signUpDetails.confirmPassword){
            signUpErrors.password = "Password does not match";
            signUpErrors.confirmPassword = "Password does not match";
        }
        if(signUpDetails.birthdate.getDate() === Date.now())signUpErrors.birthDay = "Invalid Date"
        let fields = Object.keys(signUpDetails)
        fields.forEach((field)=>{
            let prop = field as keyof typeof signUpDetails
            if(!signUpDetails[prop]){
                let errorField = field as keyof typeof signUpErrors
                signUpErrors[errorField] = "This field can't be empty"
            }
        })
        
        Object.keys(signUpErrors).forEach((e)=>{
            if(signUpErrors[e as keyof typeof signUpErrors]){
                error = true;
            }
        })
        if(error)return signUpErrors;

        return null
    }
}


export default AuthService;