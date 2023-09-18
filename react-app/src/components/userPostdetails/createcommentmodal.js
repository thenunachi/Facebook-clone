import React,{useState} from "react";
import {Modal} from '../../context/Modal'
import CommentForm from '../comments/createCommentForm'
import './createcommentmodal.css'



function AddCommentModal({postId}){
    const [showModal,setShowModal] = useState(false);
    return(
        <>
        <button className="create-comment" onClick={()=> setShowModal(true)}>Write a comment...</button>
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