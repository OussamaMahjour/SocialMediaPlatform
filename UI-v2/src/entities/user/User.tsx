
type User = {
    username:string;
    firstname:string;
    lastname:string;
    about:string;
    phone:number;
    email:string;
    profilePictureId:string;
    gender:Gender;
    birthday:Date;
}



export enum Gender {
    MALE="MALE",
    FEMALE="FEMALE"

}
export default User;