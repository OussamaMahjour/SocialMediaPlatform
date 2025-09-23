import { useState } from "react"
import SignUpDetails from "../entities/auth/SignUpDetails"
import Card from "../components/ui/Card";
import ButtonInverse from "../components/ui/ButtonInverse";
import { useTheme } from "../services/providers/ThemeProvider";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/ui/FormInput";
import { Gender } from "../entities/user/User";
import AuthService from "../services/auth-service";
import { usePopup } from "../services/providers/PopupProvider";
import { InfoLevel } from "../components/ui/InfoPopup";
import ThemeButton from "../components/ui/ThemeButton";

type SignUpErrors = {
            username?:string,
            firstname?:string,
            lastname?:string,
            password?:string,
            confirmPassword?:string,
            email?:string,
            phone?:string,
            gender?:string,
            birthDay?:string
}

export default function SignUp(){
    const [signUpDetails,setSignUpDetails] = useState<SignUpDetails>({
            username:"",
            firstname:"",
            lastname:"",
            password:"",
            confirmPassword:"",
            email:"",
            phone:0,
            gender:Gender.MALE,
            birthdate:new Date()
    });
    const [signUpErrors,setSignUpErrors] = useState<SignUpErrors | null>(null);
    const [loading,setLoading] = useState(false);
    const {theme} = useTheme()
    const {showInfo} = usePopup()
    const navigate = useNavigate();

    const handleSignUp = async ()=>{
        setLoading(true)
        let errors = AuthService.validateSignUpDetails(signUpDetails);
        if(!errors){
            errors = await AuthService.signUp(signUpDetails);
        }
        setSignUpErrors(errors)
        if(!errors){
            showInfo("Account created successfully",InfoLevel.SUCCES);
            navigate("/login")
        }
        setLoading(false)

    }
    return <div className="w-full h-full flex justify-center items-center">
        <ThemeButton className="w-10 absolute top-10 left-10"/>
        
        <Card className="min-w-fit w-100 max-h-300 h-fit min-h-100  gap-6 px-13 py-10 flex flex-col items-center">
            <div className="flex items-center w-full justify-center">
                <img className="aspect-square w-15" src={`/icon-${theme}.svg`} />
                <h1 className="text-4xl text-text-light dark:text-text-dark font-bold">Cosmos</h1>
            </div>
            <div className="w-full gap-4 flex flex-col">
                <div className="flex gap-2">
                    <FormInput placeholder="First Name" id="firstname" errorMessage={signUpErrors?.firstname} className="w-1/2" onChange={(e)=>{setSignUpDetails(details=>{details.firstname=e.target.value;return details;}) }} />
                    <FormInput placeholder="Last Name" id="lastname" errorMessage={signUpErrors?.lastname}  onChange={(e)=>{setSignUpDetails(details=>{details.lastname=e.target.value;return details}) }} className="w-1/2"/>
            
                </div>
                   
                
                <FormInput errorMessage={signUpErrors?.email} placeholder="Email" id="email" type="email" onChange={(e)=>{setSignUpDetails(user=>{user.email=e.target.value;return user}) }} className="w-full"/>
                <FormInput errorMessage={signUpErrors?.username} placeholder="Username" id="username" onChange={(e)=>{setSignUpDetails(details=>{details.username=e.target.value;return details}) }} className=" w-full"/>
                <FormInput errorMessage={signUpErrors?.birthDay} placeholder="BirthDate" id="birthdate" type="date" onChange={(e)=>{setSignUpDetails(details=>{if(e.target.valueAsDate)details.birthdate=e.target.valueAsDate;return details}) }} className=" w-full  "/>
                <FormInput errorMessage={signUpErrors?.phone} placeholder="phone" id="phone" type="number" onChange={(e)=>{setSignUpDetails(details=>{details.phone=e.target.valueAsNumber;return details}) }} className=" w-full  "/>

                <select onChange={(e)=>{
                    setSignUpDetails(details=>{details.gender=e.target.value as Gender;return details})
                    }}
                    className="p-3 focus:outline-hidden dark:border-border-dark dark:focus:border-border-light focus:border-border-dark w-full  border border-border-light rounded  text-text-light dark:text-text-dark">
                        <option value={Gender.MALE}>Male</option>
                        <option  value={Gender.FEMALE}>Female</option>
                </select>

                <FormInput type="password" errorMessage={signUpErrors?.password} placeholder="Password" id="password" onChange={(e)=>{setSignUpDetails(details=>{details.password = e.target.value;return details}) }} className="w-full " />
                <FormInput type="password" errorMessage={signUpErrors?.confirmPassword} placeholder="Confirm Password" id="confim-password" onChange={(e)=>{setSignUpDetails(details=>{details.confirmPassword = e.target.value;return details}) }} className="w-full " />
            </div>
    
            <ButtonInverse onClick={()=>handleSignUp()} className="p-3 w-1/3 max-w-40 " >
                        {
                            !loading?
                            <h1>Sign Up</h1>:
                            <svg className=" size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        }
                        
            </ButtonInverse>
            <h1 className="dark:text-text-dark text-text-light">
                Already have an account?  
                <a className="text-[#6db7f0] hover:underline cursor-pointer pl-2" onClick={()=>navigate("/login")}>Login</a>
            </h1>
            
        </Card>
    </div>
}