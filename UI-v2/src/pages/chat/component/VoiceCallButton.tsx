const VoiceCallButton = ({className}:{className?:string})=>{
    return <button className={`flex text-2xl p-2 ${className}`}>
        <i className="fa-solid fa-phone"></i>
    </button>
}


export default VoiceCallButton;