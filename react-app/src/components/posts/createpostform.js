
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Redirect, useParams } from 'react-router-dom';
import { createPostThunk, getAllPostsThunk } from '../../store/postReducer'
import {createImageThunk } from "../../store/imageReducer";
import './createpostform.css'

function CreatePostForm({ setShowModal }) {
    const dispatch = useDispatch()
    const history = useHistory()

    const [longText, setLongText] = useState("");
    const [image_url,setImage_url]=useState("")
    const [validationError, setValidationError] = useState([])
    const updateLongText = (e) => setLongText(e.target.value);
    const updateUrl = (e) => setImage_url(e.target.value)
    const{userId}= useParams()

    const ownerObj = useSelector(state => state.session.user)
    // console.log(ownerObj)

    //useEffect
    useEffect(() => {
        const errors = []
        if (!longText.length) errors.push("LongText is required")
        if(longText.length > 2000)errors.push("Maximum 2000 characters")
        setValidationError(errors)
    }, [longText])


    //handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            owner_id: ownerObj.id, longText 
        }
        const imageLoad ={
            owner_id: ownerObj.id, longText , image_url
        }
        // console.log(url,"url")
        // console.log(payload, "PAYLOAD")
        let createdPost = await dispatch(createPostThunk(payload))
        console.log(createdPost,"createdPost %%%%%%%%%%%%%%%%")
        console.log(imageLoad,"imageLoad $$$$$$$$$$$$$$$$$$")
        let imageForCreatedPost = await dispatch (createImageThunk(imageLoad,createdPost.post.id))
        // console.log("CREATEDPOST ************", createdPost)
        console.log(imageForCreatedPost,"imageForPostCreate $$$$$$$$$$$$$$$")
        if (createdPost) {
            // if (imageForCreatedPost) {
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
             <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button>
            <form className="newPost" onSubmit={handleSubmit}>
                <h2 className="h2">Create a Post</h2>
            {!longText.length && <div className="errorHandling">Text is required</div>}
            {longText.length > 2000  && <div className="errorHandling">Maximum 2000 characters</div>}
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
               <input 
               label="url"
               placeholder="image link"
               type="url"
                value={image_url}
                onChange={updateUrl}
               />
                </div>
                <button className="addPostButton" type="submit">Post</button>
                {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
            </form>


        </div>
    )







}
export default CreatePostForm;