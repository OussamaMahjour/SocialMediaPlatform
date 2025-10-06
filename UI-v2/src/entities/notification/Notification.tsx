export enum NotificationType {
    CHAT_NOTIFICATION = "CHAT_NOTIFICATION",
    POST_NOTIFICATION = "POST_NOTIFICATION",
}

interface Notification  {
    type:NotificationType
} 

export default Notification;