import User from "../types/User";

export const userApi = {
    getUser: async (username:string,token:string)=>{
        const response = await fetch(`http://localhost:8080/api/v1/users/${username}`)
        return response.json();
    },
    
    updateUser: async (username:string,userData:User,token:string)=>{
        const response = await fetch(`http://localhost:8080/api/v1/users`,{
            method:'PUT',
            body:JSON.stringify(userData),
            headers:{
                 Authorization: `Bearer ${token}`
            }
        });
        return response.json()
    },

    deleteUser:async (username:string,token:string)=>{
        const response = await fetch(`http://localhost:8080/api/v1/users`,{
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
        let response  = await fetch(`http://localhost:8080/api/v1/users/${username}/profile`,{
            method: "PUT",
            body:formData,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.json()
    }

}