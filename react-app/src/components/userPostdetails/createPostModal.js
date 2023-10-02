import React,{useState} from "react";
import {Modal} from '../../context/Modal'
import CreatePostForm from '../posts/createpostform';
import { useTheme } from '../../toggletheme';
import './createpostmodal.css'


function AddPostModal(){
    const [showModal,setShowModal] = useState(false);
    const { theme, toggleTheme } = useTheme();
    return(
        <>
        <button className="Add-Post"  style={{ backgroundColor: theme.body, color: theme.text }} onClick={()=> setShowModal(true)}>What's on your mind?</button>
   {
    showModal && (
        <Modal onClose={() => setShowModal(false)}>
< CreatePostForm setShowModal={setShowModal}/>
        </Modal>
    )
   }     
        </>
    )
}

export default AddPostModal