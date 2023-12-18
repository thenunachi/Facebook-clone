import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadUserComments, updateCommentThunk, loadPostCommentsThunk,getAllCommentsThunk  } from "../../store/commentReducer";
import { Redirect } from 'react-router-dom';
import { useTheme } from '../../toggletheme';

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

  const { theme, toggleTheme } = useTheme();
  /***************************************useEffect******************************************** */
  useEffect(() => {
    // dispatch(loadUserComments(postId))
    //dispatch((getAllCommentsThunk (comment.post_Id)));

  }, [dispatch]);

  useEffect(() => {
    const errors = [];
    if (!commentText.length) errors.push("Review text is required");
    if(commentText.length > 2000)errors.push("Maximum 2000 characters")
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
    setShowModal(false)   
    return <Redirect to={`/users/${user.id}/posts`} />; 
    // console.log("NEW REVIEW " , newReview)
    // if(newReview){
    //     onCancel()
    // }
  }
  const handleCancelClick = (e) => {
    e.preventDefault();
    setShowModal(false);
    

};

  /***************************************render func******************************************** */
  return (
    <div style={{ backgroundColor: theme.body, color: theme.text }}>
    {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
    <form className="create-review-text" onSubmit={(e)=>handleSubmit(e)}>
    <h2 className="h2">Update a Comment</h2>
    {!commentText.length && <div className="errorHandling">Text is required</div>}
    {commentText.length > 2000  && <div className="errorHandling">Maximum 2000 characters</div>}
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
      <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button>

    </form>
    </div>
  )
}
export default UpdateCommentForm