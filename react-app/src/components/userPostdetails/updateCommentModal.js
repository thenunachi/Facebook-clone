import React, { useState } from "react";
import { Modal } from '../../context/Modal'

import UpdateCommentForm from '../comments/updateCommentform'
import './updatecommentmodal.css'


function UpdatecommentModal({comment}) {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <button className="Update-comment" onClick={() => setShowModal(true)}><i class="fa-solid fa-pen-to-square"></i></button>
            {
                showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        < UpdateCommentForm  comment={comment} setShowModal={setShowModal} />
                    </Modal>
                )
            }
        </>
    )
}

export default UpdatecommentModal