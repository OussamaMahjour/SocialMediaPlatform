type Attachement = {
    file:File;
    type:AttachementType
}


export enum AttachementType  {
    IMAGE="IMAGE",
    VIDEO="VIDEO",
    AUDIO="AUDIO",
    DOCUMENT="DOCUMENT"
}

export default Attachement;