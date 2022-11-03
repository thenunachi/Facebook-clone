
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { updatePostThunk,getPostsByUserIdThunk } from '../../store/postReducer'
import './updatepostform.css'

function UpdatePostForm({ setShowModal,post }) {
    const dispatch = useDispatch()
    const history = useHistory()

    const{userId}= useParams()

    const ownerObj = useSelector(state => state.session.user)
    const postObj = useSelector(state => Object.values(state.postState))
    console.log(postObj,"postObj")
    const [longText, setLongText] = useState(post.longText);
    const [validationError, setValidationError] = useState([])
    const updateLongText = (e) => setLongText(e.target.value);

    useEffect(() => {
        const errors = []
        if (!longText.length) errors.push("LongText is required")
        setValidationError(errors)
    }, [longText])
   


    const handleSubmit =  async(e) => {
        console.log("IN HANDLESUBMIT FUNC")
         e.preventDefault();
       
        alert("after handlesubmit")
        const payload = {
            id: post.id, longText
        }
        console.log(payload, "PAYLOAD of update post")
        let updatedPost = await dispatch(updatePostThunk(payload))
        dispatch(getPostsByUserIdThunk(userId))
        // console.log("CREATEDPOST ************",createdPost)
        // if(updatedPost){
        //     history.push(`/`)
        // }

    }
    const handleCancelClick = (e) => {
        e.preventDefault();
      
        history.push('/')
        console.log("CANCEL CLICK")
        // e.style.display = 'none'

    };

    return (
        <div className="mainDiv">
            <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button>
            <form className="newPost" onSubmit={(e)=>handleSubmit(e)}>
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

                <input className="addPostButton" type="submit"/>
                {/* <button className="addPostButton" type="submit">Update Spot</button> */}
            </form>


        </div>
    )

}
export default UpdatePostForm;