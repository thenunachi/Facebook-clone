import React, { useState } from "react";
import { Modal } from '../../context/Modal'
//import CreatePostForm from '../posts/createpostform';
import UpdatePostForm from '../posts/updatepostform'
import './updatepostmodal.css'


function UpdatePostModal({post}) {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <button className="Update-Post" onClick={() => setShowModal(true)}>Edit Post</button>
            {
                showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        < UpdatePostForm post={post} setShowModal={setShowModal} />
                    </Modal>
                )
            }
        </>
    )
}

export default UpdatePostModal