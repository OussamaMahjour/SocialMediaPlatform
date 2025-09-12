const ControlPannel = () =>{
    
    
    
    
    
    return <div className="h-full w-full flex justify-center gap-5 items-center ">

            <button className="aspect-square h-3/5 rounded-full bg-red-600 cursor-pointer">
                    <i className="fa-solid fa-x text-white"></i>
            </button>
            
            <button className="aspect-square h-3/5 rounded-full text-text-dark bg-background-dark dark:bg-background-light dark: cursor-pointer">
                    <i className="fa-solid fa-volume-xmark"></i>
            </button>
            
            <button className="aspect-square h-3/5 rounded-full text-text-dark bg-background-dark dark:bg-background-light dark: cursor-pointer ">
                    <i className="fa-solid fa-microphone-slash"></i>
            </button>
            
            <button className="aspect-square h-3/5 rounded-full text-text-dark bg-background-dark dark:bg-background-light dark: cursor-pointer">
                    <i className="fa-solid fa-video-slash"></i>
            </button>
    </div>
}


export default ControlPannel;