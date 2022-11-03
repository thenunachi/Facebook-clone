import React,{useState} from "react";
import {Modal} from '../../context/Modal'
import CommentForm from '../comments/createCommentForm'


function AddCommentModal({postId}){
    const [showModal,setShowModal] = useState(false);
    return(
        <>
        <button className="Add-Post" onClick={()=> setShowModal(true)}>Write a comment...</button>
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