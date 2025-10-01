import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Account from "../../../entities/user/Account";
import UserService from "../../../services/user-service";

const ContactSearch = ({onContactSelect}:{onContactSelect:(contact:Account)=>void})=>{
    const [username,setUsername] =  useState<string>("");
    const [contacts,setContacts] = useState<Account[]>([]);

    useEffect(()=>{
        const search = async()=>{
            if(username === ""){
                setContacts([]);
                return 
            }
            const users = await UserService.search(username);
            setContacts(users);
        }
        search()
    },[username])



    return<Card className="w-90 h-120  rounded-2xl bg-background-light dark:bg-background-dark z-layer-front flex flex-col justify-start overflow-hidden">
            <div className="h-20 w-full border-b border-border-light dark:border-border-dark flex  justify-center items-center p-4">
                <Input autoFocus value={username} id="search_contact" placeholder="@ username" className="w-full " onChange={(e)=>{setUsername(e.target.value)}}/>
            </div>
            <div className=" flex-1  w-full  overflow-y-scroll">
                    {contacts.map((contact,index)=>(
                        <div onClick={()=>{onContactSelect(contact)}} key={index} className="w-full border-b border-border-light dark:border-border-dark flex p-2 cursor-pointer">
                            <img src={`http://localhost:8080/api/v1/media/${contact.profileId}`} className="w-14 aspect-square rounded-full " />
                            <div className="flex-1 h-full ml-3 ">
                                <h1 className="font-semibold">{contact.username}</h1>
                            </div>
                            
                        </div> 
                        ))}
            </div>
    </Card> 
}

export default ContactSearch;