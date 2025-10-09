import Account from "../../../entities/user/Account"

const VideoCallButton = ({className,contact}:{className?:string,contact:Account})=>{
    return <button className={`flex text-2xl p-2 min-w-5 aspect-square cursor-pointer ${className}`}>
       <i className="fa-solid fa-video"></i>
    </button>
}


export default VideoCallButton