import React, { useState } from "react";
import { Modal } from '../../context/Modal'
import CreatePostForm from '../posts/createpostform';
import { useTheme } from '../../toggletheme';
import './createpostmodal.css'
import posticon from './posticon.png'
import sign from './signature.png'
import images from './picture.png'
function AddPostModal() {
    const [showModal, setShowModal] = useState(false);
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <button className="Add-Post" style={{ backgroundColor: theme.body, color: theme.text }} onClick={() => setShowModal(true)}>
                <div className="iconsOfPostModal">
                    What's on your mind?
                    
                <span className="iconsOfPost" >
                    <span className="sign">
                    Post <img  className="icon" src={sign} />
                    </span>
           <span className="img">  Images <img  className="icon" src={images} /></span> 
              </span>
                </div>
            </button>
            {
                showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        < CreatePostForm setShowModal={setShowModal} />
                    </Modal>
                )
            }
        </>
    )
}

export default AddPostModal