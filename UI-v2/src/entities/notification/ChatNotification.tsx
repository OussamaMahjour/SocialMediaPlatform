interface ChatNotification extends Notification {
    senderUsername:string;
    recipientUsername:string;
    MessageType:ChatNotificationType;
    message:string;
}


export enum ChatNotificationType {
    CHAT_MESSAGE="CHAT_MESSAGE",
    VIDEO_CALL="VIDEO_CALL",
    VOICE_CALL="VOICE_CALL",
}

export default ChatNotification