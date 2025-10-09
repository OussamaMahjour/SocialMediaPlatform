import { ErrorBoundary } from "react-error-boundary"
import mediaApi from "../../services/api/media";

const Img = ({className,alt,id,...rest}:{className?:string,alt?:string,id:string})=>{
    return <img alt="" className={className} src={mediaApi.getFileSrc(id)} {...rest}></img>
   
}

export default Img;