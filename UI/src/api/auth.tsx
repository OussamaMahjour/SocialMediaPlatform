import LoginDetails from "../entities/auth/LoginDetails";
import SignUpDetails from "../entities/auth/SignUpDetails";
import Exception from "../types/Exception";

const BASE_URL = "http://localhost:8080/api/v1/auth";

const authApi = {
    login: async (loginDetails:LoginDetails)=>{
        const response = await fetch(BASE_URL+"/login",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(loginDetails)
        });
        if (!response.ok){
            const exception:Exception = await response.json()
            console.log("throwing exception",exception)
            throw new Exception(exception.error,exception.type);
        }
        return response.json()

    },

    signup: async (signUpDetails:SignUpDetails)=>{
        const response = await fetch(BASE_URL+"/signup",{
            method:"POST",
            body:JSON.stringify(signUpDetails)
        })
        return response.json();
    }



}


export default authApi;