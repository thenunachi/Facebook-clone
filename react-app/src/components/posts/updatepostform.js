import { use } from "chai";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {updatePostThunk} from '../../store/postReducer'


function UpdatePostForm(){
    const dispatch = useDispatch()
    const history = useHistory()

    const [longText ,setLongText]=useState("");
    const [validationError,setValidationError]=useState([])
    const updateLongText =(e)=> setLongText(e.target.value);


    const ownerObj = useSelector(state => state.session.user)
    const postObj = useSelector(state=> state.postState)
    let {postId} = useParams();
    // console.log(postObj,"POSTOBJ")
    // console.log(ownerObj)
    //useEffect
    useEffect(()=>{
        const errors=[]
        if(!longText.length) errors.push("LongText is required")
        setValidationError(errors)
    },[longText])
    //handleSubmit
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const payload={
            id:postId,longText
        }
        console.log(payload,"PAYLOAD of update post")
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

    return(
        <div className="mainDiv"> 
        <form className="newPost" onSubmit={handleSubmit}>
<input className="longText"
type ="text"
placeholder="What's on your mind?"
required
value={longText}
onChange={updateLongText}
/>
{!longText.length && <div className="errorHandling">Text is required</div>}
<button type="submit">Update Post</button>
<button type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i>Cancel</button>
        </form>
        
        
        </div>
    )







}
export default UpdatePostForm;