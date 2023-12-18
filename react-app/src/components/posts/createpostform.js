
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Redirect, useParams } from 'react-router-dom';
import { createPostThunk, getAllPostsThunk ,getPostsByUserIdThunk} from '../../store/postReducer'
import { createImageThunk } from "../../store/imageReducer";
import './createpostform.css'
import { useTheme } from '../../toggletheme';
function CreatePostForm({ setShowModal }) {
    const dispatch = useDispatch()
    const history = useHistory()
    // const defaultImageUrl = 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm8lMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60';
                            
    // const [image_url, setImage_url] = useState(imagesPerPost.image_url || defaultImageUrl);
    const [longText, setLongText] = useState("");
    const [image_url, setImage_url] = useState("")
    const [validationError, setValidationError] = useState([])
    const updateLongText = (e) => setLongText(e.target.value);
    const updateUrl = (e) => setImage_url(e.target.value)
    const { userId } = useParams()

    const ownerObj = useSelector(state => state.session.user)
    // console.log(ownerObj)
    const postObj = useSelector(state => Object.values(state.postState))
    // console.log(postObj, "postvarutha")
    const { theme, toggleTheme } = useTheme();
    //useEffect
    useEffect(() => {
        const errors = []
        if (!longText.length) errors.push("LongText is required")
        if (longText.length && longText.length > 2000) errors.push("Maximum 2000 characters")
        if (!image_url.length) errors.push("Link is required")
        setValidationError(errors)
    }, [longText])


    //handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e,"??")
        const payload = {
           owner_id: ownerObj.id, longText, image_url
        }
     
        let createdPost = await dispatch(createPostThunk(payload))
        dispatch(getAllPostsThunk())
        setShowModal(false)
        if (createdPost ) {    
            
            history.push(`/`)
        }
        
    }
    const handleCancelClick = (e) => {
        e.preventDefault();
        setShowModal(false);
    }
 

    return (
        <div  className="mainDiv" style={{ backgroundColor: theme.body, color: theme.text }} >
            {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
            <form className="newPost" onSubmit={(e)=>handleSubmit(e)}>
                <h2 className="h2">Create post</h2>
                <div className="error">
                    {!longText.length && <div className="errorHandling">Text is required</div>}
                    {/* {!image_url.length && <div className="errorHandling">Image link is required</div>} */}
                    {longText.length > 2000 && <div className="errorHandling">Maximum 2000 characters</div>}
                </div>
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
                <input className="addPostButton" type="submit"/>
                <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button>
            </form>


        </div>
    )







}
export default CreatePostForm;