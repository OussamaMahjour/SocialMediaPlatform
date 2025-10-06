import { ErrorBoundary } from "react-error-boundary"
import mediaApi from "../../services/api/media";

const Img = ({className,alt,id}:{className?:string,alt?:string,id:string})=>{
    return <ErrorBoundary fallback={<div className={className}>Error</div>}>
        <img alt="" src={mediaApi.getFileSrc(id)} className={className}></img>
    </ErrorBoundary>
}

export default Img;