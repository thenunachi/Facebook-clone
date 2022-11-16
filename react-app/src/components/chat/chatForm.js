import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams,Redirect } from "react-router-dom";
import io from "socket.io-client";
 import {createNewMessage} from "../../store/chatReducer"

let endpoint = "http://localhost:5000";
let socket = io.connect(); //connect with server using socket.io

function ChatForm(){
    const dispatch = useDispatch();
    const history = useHistory();

const [messages,setMessages] = useState([]); //array of messages
const [message,setMessage] = useState("")//single message
console.log("MESSAGES ARR",messages)

const updateMessage =(e)=>{setMessage(e.target.value)}

const user = useSelector(state=>state.session.user)

useEffect(()=>{
    getMessages();
},[messages.length]) //this will auto call when messaege length changes

const getMessages =()=>{ //this method when first time app render and every time the message.length chnages
    socket.on("message",msg =>{
        setMessages([...messages , msg]);
    });
};
// console.log("GETMESSAGE FUNC",setMessages)

const handleSubmitMessage =()=>{
    if(message !== ""){
        const msgdata={sender_Id:user.id,message}
        console.log(msgdata,"Msgdata")
        socket.emit('sendmessage',message,socket.id);   
        console.log(socket.id,"socket id")
        console.log(socket,"SOCKET")
         const newlyCreated =  dispatch(createNewMessage(msgdata))
        console.log(message)
        setMessage("");

    }
    else{
        alert("Please add a message")
    }
    // socket.on('connect',()=>{
    //     socket.emit('join',{sender_Id:user.id})
    // })
}
return(
    <div>
{messages.length > 0 && messages.map(msg=>(
 
    <div>
        <p>{msg}</p>
    </div>
))}
<input 
value={message}
name="message"
onChange={updateMessage}
/>
<button onClick={()=>handleSubmitMessage()}> Send Message</button>
    </div>
)
}

export default ChatForm;