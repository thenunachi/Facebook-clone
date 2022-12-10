import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import io from "socket.io-client";
import { createNewMessage, allMessages } from "../../store/chatReducer"
import { getUserList } from '../../store/friendReducer'


let endpoint = "http://localhost:5000";
let socket; //connect with server using socket.io

function ChatForm() {
    // console.log(receiver_Id,"receiver_ID")
    const dispatch = useDispatch();
    const history = useHistory();


    // const [messages, setMessages] = useState([]); //array of messages
    const [messages, setMessages] = useState({});
    const [newmessage, setnewMessage] = useState("")//single message
    const [currentSocket, setCurrentSocket] = useState(null)
    console.log(currentSocket, "currentsocket details")
    console.log(messages.length, "messages is array")
    console.log(messages, "messages obj")
    const updateMessage = (e) => { setnewMessage(e.target.value) }

    const chatBtwTwo = useSelector(state => Object.values(state.chatState))
console.log(chatBtwTwo,"chatBtwTwo")
    const user = useSelector(state => state.session.user)
    let userName = user.username
    let updatedValue = {}

    const friendsList = useSelector(state => Object.values(state.friendState))
    console.log(friendsList, "friendlist arra")
    const { friendId } = useParams()
    let recipient
    let recipientMsg = {}



    useEffect(() => {
        let private_socket = io("http://localhost:5000/private");
        setCurrentSocket(private_socket)
        private_socket.emit('username', user.username)
        private_socket.on('new_private_msg', function (msg) {
            //setMessages([...messages, msg])
            // recipientMsg = { recipient: msg }
             updatedValue = { userName: msg }
            setMessages(messages => ({
                ...messages, ...updatedValue 

            }))
            //  alert(msg)
            //  setnewMessage("");

            console.log(messages, "messages")
            console.log(msg, "msg from private")
        })

        // socket = io.connect()
        // socket.connect("http://localhost:5000")//connect to backend
        // socket.on("connect", () => {
        //     console.log(socket.id, "socket id to be defined"); // ojIckSD2jqNzOqIrAGzL
        // });




        // socket.on("message", msg => {
        //     console.log("receiving message", msg)
        //     console.log(socket.sid, "what is socket.sid")
        //     setMessages([...messages, msg]);
        // });

        // socket.on("connection", socket => {
        //      socket.on("private message", (anotherSocketId, msg) => {
        //        socket.to(anotherSocketId).emit("private message", socket.id, msg);
        //      });
        //    }); 
        dispatch(allMessages())
        dispatch(getUserList())
        // return (() => {
        //     socket.disconnect()
        // })


    }, [messages]) //this will auto call when messaege length changes

    // const getMessages =()=>{ //this method when first time app render and every time the message.length chnages
    //     socket.on("message",msg =>{
    //         console.log("receiving message",msg)
    //         setMessages([...messages , msg]);
    //     });
    // };
    // console.log("GETMESSAGE FUNC",setMessages)
    const handleSubmitMessage = () => {


        if (newmessage !== "") {
            friendsList.forEach((e) => {
                console.log(e, "e")
                if (e.id === +friendId) {
                    // console.log
                    recipient = e.username
                    // console.log(reciepient,"success")

                }
            })
            console.log(recipient, "recipient", newmessage)
            currentSocket.emit('privatemsg', { username: recipient, 'message': newmessage })
            const msgdata = {
                sender_Id: user.id,
                receiver_Id: +friendId,
                message: newmessage,
                // socketId: socket.id
            }
            const newlyCreated = dispatch(createNewMessage(msgdata))
            // updatedValue = { username: newmessage }
            recipientMsg = { recipient: newmessage }
            setMessages(messages => ({
                ...messages, ...recipientMsg
            }))
        }

        else {
            alert("Please add a message")
        }
    }
    // const handleSubmitMessage = () => {
    //     // setSocketId(socket.id)
    //     if (newmessage !== "") {
    // const msgdata = {
    //     sender_Id: user.id,
    //     receiver_Id: +friendId,
    //     message:newmessage,
    //     socketId: socket.id
    // }

    // console.log(friendId.socket,"what is receiver'ids socket id ????")
    // console.log(msgdata.socketId, "Msgdata")
    // socket.emit("sendmessage",(message,socket.id))
    // io.local.emit('message',newmessage)
    // socket.emit('join', { "sender_Id": user.id, "room": socket.id ,"message":newmessage});
    // socket.emit('message', newmessage);

    // console.log(socket.id,"socket id")
    // console.log(socket,"SOCKET")
    //         const newlyCreated = dispatch(createNewMessage(msgdata))
    //         // console.log(newlyCreated)

    //         setnewMessage("");

    //     }
    //     else {
    //         alert("Please add a message")
    //     }

    // }
    return (
        <div>
            {/* <form> */}
            {/* {messages.length > 0 && messages.map(msg => (

                <div>

                    <span>{user.username}<p>{msg}</p>
                    </span>
                </div>
            ))} */}
            {
                // chatBtwTwo
            }{
                // chatMessage() &&
                Object.keys(messages).map(function (keyName, keyIndex) {
                    return(
<div>
                        <p>{keyName} :</p>
                        <p>{messages[keyName]}</p>
                    </div>
                    )
                    

                })
            }
            <input
                value={newmessage}
                name="message"
                onChange={updateMessage}
            />
            <button onClick={() => handleSubmitMessage()}> Send Message</button>
            {/* </form> */}
        </div>
    )
}
const chatMessage = (receiverId,senderId,userId,friendId) =>{
    if(((senderId === userId) ||(senderId === friendId)) && ((receiverId === userId) ||(receiverId === friendId)))
    return true
    }

export default ChatForm;