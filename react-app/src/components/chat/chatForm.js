import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import io from "socket.io-client";
import { createNewMessage, allMessages } from "../../store/chatReducer"
import { getUserList } from '../../store/friendReducer'
import EmojiReaction from '../emoji'
import './chat.css'

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
    const [showEmoji, setShowEmoji] = useState(false);


    console.log(currentSocket, "currentsocket details")
 
    console.log(messages.length, "messages is array")
    console.log(messages, "messages obj")
    const updateMessage = (e) => { setnewMessage(e.target.value) }

    const chatBtwTwo = useSelector(state => Object.values(state.chatState))
    console.log(chatBtwTwo, "chatBtwTwo")
    const user = useSelector(state => state.session.user)
    let updatedValue = {}

    const friendsList = useSelector(state => Object.values(state.friendState))
    console.log(friendsList, "friendlist arra")
    const { friendId } = useParams()
    let recipient
    let recipientMsg = {}
//    console.log(io.sockets.clients(),"active")


    useEffect(async () => {
        await dispatch(allMessages())
        const userResponse = await dispatch(getUserList())
        const chatPartner = userResponse.users.find(user => user.id == friendId).username
        let private_socket = io("http://localhost:5000/private");
 
        setCurrentSocket(private_socket);

        private_socket.emit('username', user.username)
        private_socket.on('new_private_msg', function (msg) {
            //setMessages([...messages, msg])

            updatedValue = { [chatPartner]: msg }
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
       private_socket.on('response',function(active){
        console.log("reaching here")
        console.log(active,"active")
       })




        // socket.on("message", msg => {
        //     console.log("receiving message", msg)
        //     console.log(socket.sid, "what is socket.sid")
        //     setMessages([...messages, msg]);
        // });

        
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
            const userName = user.username;

            recipientMsg = { [userName]: newmessage }
            setMessages(messages => ({
                ...messages, ...recipientMsg
            }))
            setnewMessage("");
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
            <h1 className="messenger">Messenger</h1>
            <div className="leftside">
                <h2> FriendList</h2>
                <div>
                    <h3>Owner of Account</h3>
                    {user.username}
                </div>
                <div>
                    <h3>Connected users</h3>
                {friendsList.map((ele) => {
                    console.log(ele, "ele")
                    return (
                        <div>{ele.username}</div>
                    )
                })}
                </div>

            </div>
            <div className="rightside">
                <h2>Chat</h2>
                {

                    chatBtwTwo.map((e) => {
                        console.log(e, "e from chat")
                        // console.log(e.users.username,"username")
                        return (
                            <div className="message">
                                {e.users.id != +friendId && <div className="leftmsg">{e.users.username}: {e.message} </div>}
                                {e.users.id == +friendId && <div className="rightmsg">{e.users.username}: {e.message}</div>}
                            </div>

                        )


                    })

                }{

                    Object.keys(messages).map(function (keyName, keyIndex) {
                        return (
                            <div>
                                <p>{keyName} :</p>
                                <p>{messages[keyName]}</p>
                            </div>
                        )


                    })
                }
                <input className="textbox"
                    value={newmessage}
                    name="message"
                    onChange={updateMessage}

                />

                {/* <i onClick={() => { setShowEmoji(true) }} class="fa-regular fa-face-smile"></i>
            {showEmoji && <EmojiReaction userId={user.id} friendId={+friendId} />} */}
                <button className="penbutton" onClick={() => handleSubmitMessage()}> <i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    )
}


export default ChatForm;