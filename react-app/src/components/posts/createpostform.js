
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Redirect, useParams } from 'react-router-dom';
import { createPostThunk, getAllPostsThunk } from '../../store/postReducer'
import './createpostform.css'

function CreatePostForm({ setShowModal }) {
    const dispatch = useDispatch()
    const history = useHistory()

    const [longText, setLongText] = useState("");
    const [validationError, setValidationError] = useState([])
    const updateLongText = (e) => setLongText(e.target.value);
    const{userId}= useParams()

    const ownerObj = useSelector(state => state.session.user)
    console.log(ownerObj)
    //useEffect
    useEffect(() => {
        const errors = []
        if (!longText.length) errors.push("LongText is required")
        setValidationError(errors)
    }, [longText])
    //handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            owner_id: ownerObj.id, longText
        }
        console.log(payload, "PAYLOAD")
        let createdPost = await dispatch(createPostThunk(payload))
        console.log("CREATEDPOST ************", createdPost)
        if (createdPost) {
            setShowModal(false)   
            return <Redirect to={`/users/${userId}/posts`} />;   
        }
        // if(longText.length >0){
        //     setShowModal(false)
        // }
    }
    const handleCancelClick = (e) => {
        e.preventDefault();
        // history.push('/')
        console.log("CANCEL CLICK")
        // e.style.display = 'none'

    };

    return (
        <div className="mainDiv">
             {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
            <form className="newPost" onSubmit={handleSubmit}>
            {!longText.length && <div className="errorHandling">Text is required</div>}
              
                <div>
      <textarea
                    className='post-textbox'
                    rows="5"
                    cols="51"
                    placeholder="What's on your mind?"
                     required
                    value={longText}
                    onChange={updateLongText}>
                </textarea>
                </div>
                <button className="addPostButton" type="submit">Post</button>
                {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
            </form>


        </div>
    )







}
export default CreatePostForm;