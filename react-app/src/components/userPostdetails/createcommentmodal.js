import React,{useState} from "react";
import {Modal} from '../../context/Modal'
import CommentForm from '../comments/createCommentForm'
import './createcommentmodal.css'
import { useTheme } from '../../toggletheme';


function AddCommentModal({postId}){
    const [showModal,setShowModal] = useState(false);
    const { theme, toggleTheme } = useTheme();
    return(
        <>
        <button className="create-comment" style={{ backgroundColor: theme.body, color: theme.text }} onClick={()=> setShowModal(true)}>Write a comment...</button>
   {
    showModal && (
        <Modal onClose={() => setShowModal(false)}>
< CommentForm postId={postId} setShowModal={setShowModal}/>
        </Modal>
    )
   }     
        </>
    )
}

export default AddCommentModal