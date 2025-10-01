import Attachement from "../entities/chat/Attachement";
import authApi from "./api/auth";
import mediaApi from "./api/media";

const MediaService = {
    saveAttachment:async (attachment:Attachement)=> {
        try{
            const token:string = authApi.getJWTToken();
            const ids:string[] = await mediaApi.uploadFile(attachment.file,token);
            return ids[0];
        }catch(e){
            console.warn(e)
        }
    }
}


export default MediaService;