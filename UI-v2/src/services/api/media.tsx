
const BASE_URL = "http://localhost:8080/api/v1/media"



const mediaApi = {
    getFileSrc:(fileId:string)=>{
        return BASE_URL+"/"+fileId;
    },
    uploadFile:async (file:File,token:string)=>{
            let formData = new FormData()
            formData.append("context", "message");
            formData.append("medias",file);
            let response = await fetch(BASE_URL,{
                method:"POST",
                body:formData,
                headers: {
                Authorization: `Bearer ${token}`,
            }
            })
            return await response.json()
        
    }
}



export default mediaApi;