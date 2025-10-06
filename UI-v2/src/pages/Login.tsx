import { useState } from "react"
import LoginDetails from "../entities/auth/LoginDetails"
import Card from "../components/ui/Card"
import ThemeButton from "../components/ui/ThemeButton"
import FormInput from "../components/ui/FormInput"
import ButtonInverse from "../components/ui/ButtonInverse"
import AuthService from "../services/auth-service"
import { useTheme } from "../services/providers/ThemeProvider"
import { useNavigate } from "react-router-dom"


type LoginErrors = {username:string,password:string}

export default function Login(){
    const [LoginDetails,setLoginDetails] = useState<LoginDetails>({username:"",password:""}) 
    const [loginErrors,setLoginErrors] = useState<LoginErrors| null>(null)
    const [loading,setLoading] = useState(false);
    const {theme} = useTheme()
    const navigate = useNavigate();
    const handleLogin  = async ()=>{
        setLoading(true);
        const error = await AuthService.login(LoginDetails.username,LoginDetails.password);
        if(error?.isError ){
            if(error.Errors.password || error.Errors.password)
            setLoginErrors({username:error.Errors.username,password:error.Errors.password})
        
        }else{
            window.location.href = "/"

          
        }
        
        setLoading(false)

    }
    
    
    
    
    
    return <div className="w-full h-full flex justify-center items-center">
        <ThemeButton className="w-10 absolute top-10 left-10"/>
        
        <Card className="min-w-fit w-100 max-h-300 h-fit min-h-100  gap-10 px-13 py-10 flex flex-col items-center">
            <div className="flex items-center w-full justify-center">
                <img className="aspect-square w-15" src={`/icon-${theme}.svg`} />
                <h1 className="text-4xl text-text-light dark:text-text-dark font-bold">Cosmos</h1>
            </div>
            <div className="w-full gap-4 flex flex-col">
                <FormInput id="username" placeholder="Username" errorMessage={loginErrors?.username} className="w-full"  onChange={(e)=>{setLoginDetails((details)=>{details.username = e.target.value;return details})}} ></FormInput>
                <FormInput id="password" placeholder="Password"   errorMessage={loginErrors?.password} type="password" className="w-full"  onChange={(e) => setLoginDetails((details)=>{details.password = e.target.value;return details})} ></FormInput>
            </div>
            
            <ButtonInverse onClick={()=>handleLogin()} className="p-3 w-1/3 max-w-40 " >
                        {
                            !loading?
                            <h1>Connect</h1>:
                            <svg className=" size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        }
                        
            </ButtonInverse>
            <h1 className="dark:text-text-dark text-text-light">
                don't have an account?  
                <a className="text-[#6db7f0] hover:underline cursor-pointer pl-2" onClick={()=>navigate("/signup")}>Signup</a>
            </h1>
            
        </Card>
    </div>
    
   
}