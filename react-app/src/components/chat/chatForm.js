import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams,Redirect } from "react-router-dom";
import io from "socket.io-client";
 import {createNewMessage,allMessages} from "../../store/chatReducer"
 import { getUserList } from '../../store/friendReducer'


let endpoint = "http://localhost:5000";
 let socket ; //connect with server using socket.io

function ChatForm(){
    // console.log(receiver_Id,"receiver_ID")
    const dispatch = useDispatch();
    const history = useHistory();

const [messages,setMessages] = useState([]); //array of messages
const [message,setMessage] = useState("")//single message
console.log("MESSAGES ARR",messages)

const updateMessage =(e)=>{setMessage(e.target.value)}

const user = useSelector(state=>state.session.user)
const friendsList = useSelector(state => Object.values(state.friendState))
const {friendId} = useParams()
useEffect(()=>{
    socket = io.connect()
    socket.connect("http://localhost:5000")//connect to backend

    socket.on("message",msg =>{
        console.log("receiving message",msg)
        setMessages([...messages , msg]);
    });
    dispatch(allMessages())
    dispatch(getUserList())
    return (() => {
        socket.disconnect()
    })

},[]) //this will auto call when messaege length changes

// const getMessages =()=>{ //this method when first time app render and every time the message.length chnages
//     socket.on("message",msg =>{
//         console.log("receiving message",msg)
//         setMessages([...messages , msg]);
//     });
// };
// console.log("GETMESSAGE FUNC",setMessages)

const handleSubmitMessage =()=>{
    if(message !== ""){
        const msgdata={sender_Id:user.id, 
             receiver_Id:+friendId,
            message}
        console.log(msgdata,"Msgdata")
        // socket.emit("sendmessage",(message,socket.id))
        socket.emit('message',message);   
        // console.log(socket.id,"socket id")
        // console.log(socket,"SOCKET")
         const newlyCreated =  dispatch(createNewMessage(msgdata))
        console.log(newlyCreated)
        // onUserNameSelection(msg)
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

// const onUserNameSelection = (username)=>{
//     socket.auth = {username};
//     socket.connect()
// }
export default ChatForm;