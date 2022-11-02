import React,{useState} from "react";
import {Modal} from '../../context/Modal'
import CreatePostForm from '../posts/createpostform';

import './createpostmodal.css'


function AddPostModal(){
    const [showModal,setShowModal] = useState(false);
    return(
        <>
        <button className="Add-Post" onClick={()=> setShowModal(true)}>What's on your mind?</button>
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