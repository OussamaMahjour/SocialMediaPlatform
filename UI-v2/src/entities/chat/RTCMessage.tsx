export type RTCMessage = {
    sender?:string;
    messageType:RTCMessageType;
    sdp?:any;
    candidate?:any;
}


export enum RTCMessageType {
    RECEIVER = "receiver",
    SENDER = "sernder",
    CREAT_OFFER="creatOffer",
    CREAT_ANSWER="creatAnswer",
    ICE_CONDIDATE="iceCondidate"
} 