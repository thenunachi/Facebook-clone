import { use } from "chai";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { updatePostThunk } from '../../store/postReducer'
import './updatepostform.css'

function UpdatePostForm() {
    const dispatch = useDispatch()
    const history = useHistory()

    const [longText, setLongText] = useState("");
    const [validationError, setValidationError] = useState([])
    const updateLongText = (e) => setLongText(e.target.value);


    const ownerObj = useSelector(state => state.session.user)
    const postObj = useSelector(state => state.postState)
    let { postId } = useParams();
    // console.log(postObj,"POSTOBJ")
    // console.log(ownerObj)
    //useEffect
    useEffect(() => {
        const errors = []
        if (!longText.length) errors.push("LongText is required")
        setValidationError(errors)
    }, [longText])
    //handleSubmit


    const handleSubmit = async (e) => {
        console.log("IN HANDLESUBMIT FUNC")
        e.preventDefault();
        alert("after handlesubmit")
        const payload = {
            id: postId, longText
        }
        console.log(payload, "PAYLOAD of update post")
        let updatedPost = await dispatch(updatePostThunk(payload))
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

            </form>


        </div>
    )

}
export default UpdatePostForm;