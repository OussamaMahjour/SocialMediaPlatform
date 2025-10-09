import User from "../../entities/user/User";

const BASE_URL = "http://localhost:8080/api/v1/users"


export const userApi = {
    getUser: async (username:string,token:string)=>{
        const response = await fetch(`${BASE_URL}/${username}`,{
            headers:{
                 Authorization: `Bearer ${token}`
            }
        })
        return response.json();
    },

    getUserFromToken:async (token:string) =>{
        const response = await fetch(BASE_URL,{
            method:"GET",
            headers:{
                 Authorization: `Bearer ${token}`
            }
        });
        return response.json()
    },
    
    updateUser: async (username:string,userData:User,token:string)=>{
        const response = await fetch(BASE_URL,{
            method:'PUT',
            body:JSON.stringify(userData),
            headers:{
                 Authorization: `Bearer ${token}`
            }
        });
        return response.json()
    },

    deleteUser:async (username:string,token:string)=>{
        const response = await fetch(BASE_URL+"/"+username,{
            method:'DELETE',
            headers:{
                 Authorization: `Bearer ${token}`
            }
        })
        return response.json();
    },

    changeProfile:async (username:string,token:string,file:File)=>{
        const formData = new FormData();
        formData.append("context", "profile");
        formData.append("medias", file);
        let response  = await fetch(`${BASE_URL}/${username}/profile`,{
            method: "PUT",
            body:formData,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.json()
    },
    
    getUsersByPrefix:async (prefix:string,token:string)=>{
        let response = await fetch(`${BASE_URL}/search/${prefix}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.json()
    }

}