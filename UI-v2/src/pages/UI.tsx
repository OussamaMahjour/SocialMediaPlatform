import { ReactNode } from "react";
import Card from "../components/ui/Card";
import ThemeButton from "../components/ui/ThemeButton";
import FormInput from "../components/ui/FormInput";
import Button from "../components/ui/Button";
import ButtonInverse from "../components/ui/ButtonInverse";
import Input from "../components/ui/Input";
import { usePopup } from "../services/providers/PopupProvider";
import { InfoLevel } from "../components/ui/InfoPopup";


const UI = ():ReactNode=>{

    const {showInfo,openPopup} = usePopup()
    

    return <div className="grid grid-flow-row gap-4  grid-cols-4 grid-rows-4  h-screen w-screen p-4 overflow-y-auto relative">
            
            <Card className=" w-fit h-fit absolute bottom-3 right-0 ">
                <ThemeButton />
             </Card> 
            
            <Card className="p-2 w-full h-fit  ">
                <FormInput placeholder="Form Input" id="forminput" type="text" className="w-full " />
             </Card>
            
             <Card className="p-2 w-full h-fit  ">
                <FormInput placeholder="Invalid Form Input" id="invalidforminput" type="text" className="w-full invalid " errorMessage="Invalid Form Input" />
             </Card>
            
             <Card className="p-2 w-full h-fit">
               <Button className="w-full">
                    Button
               </Button>
             </Card>
            
             <Card className="p-2 w-full h-fit">
               <ButtonInverse  className="w-full">
                    ButtonInverse
               </ButtonInverse>
             </Card> 
            
            <Card className="p-2 w-full h-fit  ">
                <Input placeholder="Normal Input" id="test" type="text" className="w-full invalid "  />
            </Card>
             
             <Card className="p-2 w-full h-fit">
               <ButtonInverse onClick={()=>{showInfo("This is an info message",InfoLevel.GENERAL)}} className="w-full">
                    Click for Info Message
               </ButtonInverse>
             </Card> 
             <Card className="p-2 w-full h-fit">
               <ButtonInverse onClick={()=>{openPopup(
                        <div className="text-2xl w-1/2 h-1/2 z-layer-front bg-background-light rounded-2xl dark:bg-background-dark text-text-light dark:text-text-dark flex justify-center items-center">
                            <h1>
                                This is a pop up 
                            </h1>
                    </div>
               )}} className="w-full">
                    Click to open Pop up
               </ButtonInverse>
             </Card> 

             
            
                           
    </div>
}

export default UI;