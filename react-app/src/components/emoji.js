import React, { useState ,useEffect} from 'react';
import {Emoji, EmojiStyle} from 'emoji-picker-react';
import EmojiPicker from 'emoji-picker-react';
const EmojiReaction = () => {
  const [chosenEmoji, setChosenEmoji] = useState("");
  
  const [inputStr, setInputStr] = useState('')

  const onEmojiClick = (emojiObject,event ) => {
    setChosenEmoji(emojiObject.unified);
    // console.log(chosenEmoji,"chosenEmoji")
    console.log(emojiObject,"emojiObject")
  };
  useEffect(() => {
    console.log(typeof chosenEmoji)
    
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