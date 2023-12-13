import giphy from 'giphy-api';
import Sticker from './sticker';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import io from "socket.io-client";
// import * as io from 'socket.io-client' 
import { createNewMessage, allMessages } from "../../store/chatReducer"
import { getUserList } from '../../store/friendReducer'
import EmojiReaction from '../emoji'
import { useTheme } from '../../toggletheme';
import './chat.css'
// import { Socket } from "socket.io";
import GiphyReactions from '../Gify/giphy';
import man from './man.png'
import woman from './woman.png'
import girl from './girl.png'
import random1 from './random 1.png'
import random2 from './random 2.png'
import random3 from './random 3.png'
import random4 from './cleaner.png'
import random5 from './guarani.png'
import random6 from './nutritionist.png'
import random7 from './profile.png'
import random8 from './woman2.png'
import random9 from './woman3.png';
import { useLocation } from "react-router-dom";
import EmojiPicker from 'emoji-picker-react';

let endpoint = "http://localhost:5000";
// let socket; //connect with server using socket.io
// const random = [random1, random2, random3, random4, random5, random6, random7, random8, random9]
const commonId = (friendsList, userOnlineActiveId, checkImage, imgObj) => {
    // console.log(friendsList, "friendsList", userOnlineActiveId, "userOnlineActiveId");
    // console.log(imgObj, "imgObj");
    const filteredFriends = friendsList.filter((friend) =>
        userOnlineActiveId.includes(friend.id)
    );

    // console.log("Filtered Friends:", filteredFriends);

    return (
        <div>
            {filteredFriends.map((friend) => (
                <div key={friend.id}>
                    <p>{checkImage(imgObj, friend.username)}{friend.username}</p>
                </div>
            ))}
        </div>
    );
};
const loggedOutOffline =(logoutEvents,friendsList,checkImage,imgObj)=>{
    // console.log(logoutEvents,"logoutEvents")
    const loggedOut = friendsList.filter(frie => !logoutEvents.includes(frie.id));

//    console.log(loggedOut,"loggedOut")
return(
    <div>
        {loggedOut.map((friend) => (
            <div key={friend.id}>
                <p>{checkImage(imgObj, friend.username)}{friend.username}</p>
            </div>
        ))}
    </div>
)
}

function ChatForm() {

    let location = useLocation();
    // console.log(location.state, "state"); //use tjhis
    // let imageObject = location.state;
    const dispatch = useDispatch();
    const history = useHistory();
    // console.log(Socket.client(),"socket from io")

    // const [messages, setMessages] = useState([]); //array of messages
    const [messages, setMessages] = useState({});
    const [newmessage, setnewMessage] = useState("")//single message
    const [currentSocket, setCurrentSocket] = useState(null)

    const [activeSocket, setActiveSocket] = useState(null)
    const [uniqueChars, setUniquechars] = useState([])
    // const [gif, setGif] = useState(false)
    // const [profilePicObj, setProfilePicObj] = useState({})
    const { theme, toggleTheme } = useTheme();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // const [showGiphyPicker, setShowGiphyPicker] = useState(false);
    // const [selectedGiphy, setSelectedGiphy] = useState(null);
    // const Giphy = giphy({ apiKey: '2qo2Fm1rH0oWXOMxeyZonYDePjeroAwN' });

    const [usersOnline, setUsersOnline] = useState([])
    const [logoutEvents, setLogoutEvents] = useState([]);
    const updateMessage = (e) => { setnewMessage(e.target.value) }
    const chatBtwTwo = useSelector(state => Object.values(state.chatState))
    const user = useSelector(state => state.session.user)
    let updatedValue = {}
    const friendsList = useSelector(state => Object.values(state.friendState))
    // console.log(friendsList, "FRIENDS LIST")
    let friendArr = []
    friendsList.forEach((e) => {
        friendArr.push(e.username)
    })
    const { friendId } = useParams()
    let recipient
    let recipientMsg = {}
    let activeUserCount
    let countOfUsersOnline


    useEffect(async () => {
        await dispatch(allMessages())
        const userResponse = await dispatch(getUserList())
        const chatPartner = userResponse.users.find(user => user.id == friendId).username

        let private_socket = io("http://localhost:5000/private");
        let activeUsers = io("http://localhost:5000/online")

        setCurrentSocket(private_socket);
        setActiveSocket(activeUsers)

        private_socket.emit('username', user.username)
        private_socket.on('new_private_msg', function (msg) {
            //setMessages([...messages, msg])

            updatedValue = { [chatPartner]: msg }
            setMessages(messages => ({
                ...messages, ...updatedValue
            }))
            //  alert(msg)
            //  setnewMessage("");

            dispatch(allMessages())
            // console.log(messages, "messages")
            // console.log(msg, "msg from private")
        })

        activeUsers.on('users', function (countOfUsersOnline) {
            // console.log("active")
            activeUserCount = countOfUsersOnline.user_count;
            console.log(activeUserCount, "activeusercount")
        })

        activeUsers.emit('active', { username: user.username })
        // socket.emit('offline', 'user1');
        activeUsers.emit('offline', user.username)
        activeUsers.on('activeUsers', function (activeUsers) {
            console.log(activeUsers, "activeUsers")

            setUniquechars([...new Set(activeUsers)])
        })

        // activeUsers.emit('offline', user.username)

        activeUsers.emit('login', { userId: user.id });


        // *******************************************************************//
        // console.log(io.sockets.sockets,"sockets list")
        // activeSocket.set('nickname', 'Guest');   
        // for (let socketId in activeSocket.sockets) {
        //     io.sockets.sockets[socketId].get('nickname', function(err, nickname) {
        //         console.log(nickname);
        //     });
        // }

    }, [messages]) //this will auto call when messaege length changes

    useEffect(() => {
        // Establish a WebSocket connection when the component mounts
        const socket = io('http://localhost:5000');
        // console.log(socket,"socket")
        // Emit login event when the user logs in
        socket.emit('login', { userId: user.id });


        // Listen for updates on the number of active users
        socket.on('users', ({ user_count }) => {
            console.log(`Number of active users: ${user_count}`, "chat online");
            // console.log()
        });
        // Listen for 'usersNames' event
        socket.on('usersNames', ({ users }) => {
            console.log('List of user names:', users);
            setUsersOnline(users);
        });
        //   console.log(usersOnline, "usersOnline")
        // Cleanup: Emit logout event when the component is unmounted
        return () => {
            // Emit the array of logout events to the server
            socket.emit('logout', { userId: user.id });
//             setLogoutEvents(prevLogoutEvents => [...prevLogoutEvents, user.id]);
// console.log("LOGOUT",logoutEvents)
        };

        // Dependencies: The effect runs when the component mounts and when user changes
    }, [user]);



    const handleSubmitMessage = () => {


        if (newmessage !== "") {
            friendsList.forEach((e) => {
                // console.log(e, "e")
                if (e.id === +friendId) {
                    // console.log
                    recipient = e.username
                    // console.log(reciepient,"success")

                }
            })
            // console.log(recipient, "recipient", newmessage)
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
            dispatch(allMessages())
        }

        else {
            alert("Please add a message")
        }
    }
    // console.log(uniqueChars, "uniqueChars")
    const filteredUsers = friendArr.filter((o) => user.username !== o && uniqueChars.indexOf(o) === -1);

    const onlineUsersAvailable = uniqueChars.filter((e) => e != user.username)
    // console.log(onlineUsersAvailable,"onl")

    return (
        <div style={{ backgroundColor: theme.body, color: theme.text }}>
            <div className="messenger">Messenger</div>
            <div className="leftside" style={{ backgroundColor: theme.body, color: theme.text }}>
                <h2> FriendList</h2>
                <div>
                    <h3>Owner of Account</h3>
                    {checkImage(location.state.imageObject, user.username)}{user.username}
                </div>
                <div>
                    <h4  >Online Users</h4>
                    <div className='onlineusers'>
                        {commonId(friendsList, usersOnline, checkImage, location.state.imageObject)}
                    </div>


                    <h4>Offline Users</h4>

                    <div className="offlineusers">
                          {loggedOutOffline(usersOnline, friendsList, checkImage, location.state.imageObject)}
                        {/* <div>
                            {filteredUsers.map((name, index) => (
                                <div >{checkImage(location.state.imageObject, name)} <span>{name}</span> </div>
                            ))}
                        </div> */}

                        {/* {     
                         
                            // friendArr.filter((o) =>
                            //     // console.log(o,"o")
                            //     uniqueChars.indexOf(o) === -1 && checkImage(location.state.imageObject, o)


                            // )
                         
                        } */}

                    </div>

                </div>


            </div>
            <div className="rightside" style={{ backgroundColor: theme.body, color: theme.text }}>
                <h2>Chat</h2>
                {

                    chatBtwTwo.map((e) => {

                        return (

                            <div className="message">
                                {e && e.users && e.users.id != +friendId && <div className="leftmsg" style={{ backgroundColor: theme.body, color: theme.text }}>{checkImage(location.state.imageObject, e.users.username)}{e.users.username}: {e.message} </div>}
                                {e && e.users && e.users.id == +friendId && <div className="rightmsg" style={{ backgroundColor: theme.body, color: theme.text }}>{checkImage(location.state.imageObject, e.users.username)}{e.users.username}: {e.message}</div>}
                                {/* history.push(`/chat/${friendId}`) */}
                                {/* dispatch(allMessages()) */}
                            </div>

                        )


                    })

                }
                {/* { 

                    Object.keys(messages).map(function (keyName, keyIndex) {
                        return (
                            <div>
                                <p>{keyName} :</p>
                                <p>{messages[keyName]}</p>
                            </div>
                        )


                    })
               } */}
                <input className="textbox" style={{ backgroundColor: theme.body, color: theme.text }}
                    value={newmessage}
                    name="message"
                    onChange={updateMessage}
                // placeholder={<i class="fa-solid fa-gif"></i>}
                />
                <button style={{ backgroundColor: theme.body, color: theme.text }}
                    className="emoji-button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    <i className="fa-regular fa-face-smile" ></i>

                </button>
                {/* <button style={{ backgroundColor: theme.body, color: theme.text }}
                    className="gipfySticker-button"
                    onClick={() => setshowGiphySticker(!showGiphySticker)}
                >
                    <i class="fa-solid fa-note-sticky"></i>
                   
                </button> */}
                {showEmojiPicker && (
                    <EmojiPicker
                        onEmojiClick={(emoji, event) => {
                            const emojiUnicode = emoji.emoji;
                            setnewMessage((prevMessage) => prevMessage + emojiUnicode);
                            setShowEmojiPicker(false); // Hide the emoji picker
                        }}
                    />
                )}

                {/* --------------------------------------------------- */}
                {/* Button to toggle Giphy picker */}
                {/* <button onClick={toggleGiphyPicker}>Giphy</button>

{/* Render the Giphy picker if showGiphyPicker is true */}
                {/* {showGiphyPicker && (
  <Sticker onGiphySelect={handleGiphySelect} />
)} */}

                {/* Display the selected Giphy if available */}
                {/* {selectedGiphy && (
  <div>
    <img src={selectedGiphy} alt="Selected Giphy" />
  </div>
)} 
                 {/* _________________________________________________ */}
                <button className="penbutton" style={{ backgroundColor: theme.body, color: theme.text }} onClick={() => handleSubmitMessage()}>
                    <i className="fa-solid fa-paper-plane"></i>
                </button>
                {/* <div><Sticker /></div> */}





                {/* <button className="penbutton" onClick={() => handleSubmitMessage()}> <i class="fa-solid fa-paper-plane"></i></button> */}
            </div>
        </div>
    )
}


const checkImage = (imageObject, username) => {
    // console.log(imageObject, "the")
    // console.log(username,"name")
    for (const key in imageObject) {
        if (key == username) {
            return (
                <span>
                    <img className="logoPic" src={imageObject[key]} />
                </span>
            )
        }

    }


}


export default ChatForm;