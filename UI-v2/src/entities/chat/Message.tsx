type Message = {
    body:string;
    owner:string;
    seen:boolean;
    type:MessageType;
    sentAt:Date;
}

export enum MessageType {
    AUDIO="AUDIO",
    VIDEO="VIDEO",
    IMAGE="IMAGE",
    TEXT="TEXT",
    DOCUMENT="DOCUMENT"
}

export default Message;