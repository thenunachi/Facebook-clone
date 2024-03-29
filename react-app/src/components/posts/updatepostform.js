
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import { updatePostThunk, getPostsByUserIdThunk,getAllPostsThunk } from '../../store/postReducer'
import './updatepostform.css'
import { updateImageThunk } from '../../store/imageReducer'
import { useTheme } from '../../toggletheme';
function UpdatePostForm({ setShowModal, post}) {
    
    
    const dispatch = useDispatch()
    const history = useHistory()

    const { userId } = useParams()

    const ownerObj = useSelector(state => state.session.user)
    const postObj = useSelector(state => Object.values(state.postState))
        const [longText, setLongText] = useState(post.longText);
       const [image_url, setImage_url] = useState(post.image_url || "" );

    const [validationError, setValidationError] = useState([])
    const updateLongText = (e) => setLongText(e.target.value);
    const updateUrl = (e) => setImage_url(e.target.value)
    const { theme, toggleTheme } = useTheme();
    useEffect(() => {
        const errors = []
        if (!longText.length) errors.push("LongText is required")
        if (longText.length > 2000) errors.push("Maximum 2000 characters")
        if (!image_url.length) errors.push("Link is required")
        setValidationError(errors)
    }, [longText])



    const handleSubmit = async (e) => {
        // console.log("IN HANDLESUBMIT FUNC")
        e.preventDefault();

        // alert("after handlesubmit")
        // console.log(image_url,"imageDefault")
        const payload = {
            id: post.id, longText, image_url
        }
        console.log(payload,"PAYLOADUPDATE")
      
        let updatedPost = await dispatch(updatePostThunk(payload));
        // let updatedImagePost = await dispatch(updateImageThunk(imageLoad))
        dispatch(getPostsByUserIdThunk(post.owner_Id))
        dispatch(getAllPostsThunk());
        setShowModal(false)
        //  return <Redirect to={`/users/${userId}/posts`} />;         
        // console.log("CREATEDPOST ************",createdPost)
        if (updatedPost) {
            history.push(`/`)
        }

    }
    const handleCancelClick = (e) => {
        e.preventDefault();
        setShowModal(false);
    }
 
 
    return (

        <div className="mainDiv" style={{ backgroundColor: theme.body, color: theme.text }}>
            {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
            {/* <h1>Update the post</h1> */}
            <form className="newPost" onSubmit={(e) => handleSubmit(e)}>
                <h2 className="h2">Update a Post</h2>
                {!longText.length && <div className="errorHandling">Text is required</div>}
                {longText.length && longText.length > 2000 && <div className="errorHandling">Maximum 2000 characters</div>}
                {/* {!image_url.length && <div className="errorHandling">Image link is required</div>} */}
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
                    <input className="urlInput"
                        label="url"
                        placeholder="image link "
                        type="url"
                        value={image_url}
                        onChange={updateUrl}
                    />
                </div>

                <input className="addPostButton" type="submit" />
                <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button>
            </form>


        </div>
    )

}
export default UpdatePostForm;