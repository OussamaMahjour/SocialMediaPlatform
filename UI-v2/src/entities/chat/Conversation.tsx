import Account from "../user/Account";
import Message from "./Message";

type Conversation = {
    contact:Account;
    messages:Message[];
}

export default Conversation;