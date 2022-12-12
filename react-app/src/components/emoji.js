import React, { useState ,useEffect} from 'react';
import {Emoji, EmojiStyle} from 'emoji-picker-react';
import EmojiPicker from 'emoji-picker-react';
import { createNewMessage, allMessages } from "../store/chatReducer"
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";


const EmojiReaction = ({userId,friendId}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [chosenEmoji, setChosenEmoji] = useState("");
  console.log(chosenEmoji,"chosenEmoji")
  console.log(setChosenEmoji,"chosenEmoji")
  const [inputStr, setInputStr] = useState('')

  const onEmojiClick = (emojiObject,event ) => {
    setChosenEmoji(emojiObject.unified);
    // console.log(chosenEmoji,"chosenEmoji")
    console.log(emojiObject,"emojiObject")
    const msgdata = {
      sender_Id: userId,
      receiver_Id: friendId,
      message:  chosenEmoji
      
      // socketId: socket.id
  }
    const newlyCreated = dispatch(createNewMessage(msgdata))
  };
  useEffect(() => {
    console.log(typeof chosenEmoji)
    // dispatch(allMessages())
  }, [chosenEmoji]);

  return (
    <div>
      {chosenEmoji && 
         <Emoji unified={chosenEmoji} size="25" />
        
      }
      <EmojiPicker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiReaction