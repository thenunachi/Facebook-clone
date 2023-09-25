import React, { useState } from "react";
import { Modal } from '../../context/Modal'
//import CreatePostForm from '../posts/createpostform';
import UpdatePostForm from '../posts/updatepostform'
import './updatepostmodal.css'


function UpdatePostModal(props) {
    const { post } = props;
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <button className="Update-Post" onClick={() => setShowModal(true)}><i class="fa-solid fa-pen-to-square"></i></button>
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