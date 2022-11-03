import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadUserComments, updateCommentThunk, loadPostCommentsThunk,getAllCommentsThunk  } from "../../store/commentReducer";



/*********************************************************************************** */
function UpdateCommentForm({setShowModal,comment}) {
  const dispatch = useDispatch();
  const history = useHistory();

  /*****************************************useState****************************************** */
 
  //   const [show, setShow] = useState(false);

  const updateComments = (e) => setCommentText(e.target.value);

  let allPost = useSelector(state => Object.values(state.postState));

  let allComments = useSelector(state => Object.values(state.commentState));


  let user = useSelector(state => state.session.user);
  const [commentText, setCommentText] = useState(comment.commentText);
  const [validations, setValidations] = useState([])
  //let postId = allComments[0].EditedComment.post_Id;

  const commentofUser = allComments.find(comment => user && comment.userId === user.id)

  // const post = allPost.find(post => post.id === +postId)

  
  /***************************************useEffect******************************************** */
  useEffect(() => {
    // dispatch(loadUserComments(postId))
    //dispatch((getAllCommentsThunk (comment.post_Id)));

  }, [dispatch]);

  useEffect(() => {
    const errors = [];
    if (!commentText.length) errors.push("Review text is required");

    setValidations(errors)
  }, [commentText]);




  /***************************************handleSubmit and onCancel func******************************************** */
  // const onCancel = ()=>{
  // setShow(false)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { id: comment.id, commentText };
    let newComment = await dispatch(updateCommentThunk(payload))
    dispatch(loadPostCommentsThunk(comment.post_Id))
    // console.log("NEW REVIEW " , newReview)
    // if(newReview){
    //     onCancel()
    // }
  }
  const handleCancelClick = (e) => {
    e.preventDefault();
  
    history.push('/')
    console.log("CANCEL CLICK")
    // e.style.display = 'none'

};

  /***************************************render func******************************************** */
  return (
    <div>
    <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button>
    <form className="create-review-text" onSubmit={(e)=>handleSubmit(e)}>
    {!commentText.length && <div className="errorHandling">Text is required</div>}
      {/* <ul className="errorsReview">
        {
          validations.map((error, index) => (
            <li key={index}>{error}</li>
          ))
        }
      </ul> */}
      {/* <input id="reviewInput"
        type="text"
        placeholder="Write a review"
        required
        value={commentText}
        onChange={updateComments}
      /> */}
<div>
      <textarea
                    className='post-textbox'
                    rows="5"
                    cols="51"
                    placeholder="Write a comment.."
                     required
                    value={commentText}
                    onChange={updateComments}>
                </textarea>
                </div>

      <button className="editButton" type="submit">Submit comment</button>
      {/* <button className="cancelEdit" type="button" onClick={onCancel}>Cancel</button> */}

    </form>
    </div>
  )
}
export default UpdateCommentForm