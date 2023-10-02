import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams,Redirect } from "react-router-dom";
import { createCommentThunk, loadUserComments, loadPostCommentsThunk } from "../../store/commentReducer";
import { useTheme } from '../../toggletheme';
import './createCommentForm.css'


/*********************************************************************************** */
function CommentForm({setShowModal,postId}) {
  const dispatch = useDispatch();
  const history = useHistory();

  /*****************************************useState****************************************** */
  const [commentText, setCommentText] = useState("");
  const [validations, setValidations] = useState([])
  //   const [show, setShow] = useState(false);

  const updateComments = (e) => setCommentText(e.target.value);

  let allPost = useSelector(state => Object.values(state.postState));
  let allComments = useSelector(state => Object.values(state.commentState));
  let user = useSelector(state => state.session.user);

  const commentofUser = allComments.find(comment => user && comment.userId === user.id)
  const post = allComments.find(c => c.post_Id === +postId)

  const { theme, toggleTheme } = useTheme();
  // console.log(post, "CHECK POST.ID is same as params")//2
  // console.log("PRODUCT",product)
  /***************************************useEffect******************************************** */
  useEffect(() => {
    // dispatch(loadUserComments())
    dispatch((loadPostCommentsThunk(postId)));

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
    const payload = { id: postId, commentText };
    // console.log(payload, "PAYLOAD ISIDE CREACRE")
    let newComment = await dispatch(createCommentThunk(payload))
    await dispatch(loadPostCommentsThunk(postId))

    if(newComment){
      setShowModal(false)   
            return <Redirect to={`/users/${user.id}/posts`} />;
    }
    //dispatch(loadPostCommentsThunk(post.id))
    // console.log("NEW REVIEW " , newReview)
    // if(newReview){
    //     onCancel()
    // }
  }
  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push('/')
    // console.log("CANCEL CLICK")
    // e.style.display = 'none'

};
  /***************************************render func******************************************** */
  return (
    <div style={{ backgroundColor: theme.body, color: theme.text }}>
    {/* <button className="cancelButton" type="button" onClick={handleCancelClick}><i class="fa-solid fa-xmark"></i></button> */}
    <form className="create-review-text" onSubmit={handleSubmit}>
      {/* <div className="errorsReview">
        {
          validations.map((error, index) => (
            <li key={index}>{error}</li>
          ))
        }
      </div> */}
      <h2 className="htag">Create a Comment</h2>
       {!commentText.length && <div className="CerrorHandling">Text is required</div>}
       {commentText.length > 2000  && <div className="CerrorHandling">Maximum 2000 characters</div>}
      <div>
        <textarea
          className='review-textbox'
          rows="5"
          cols="51"
          placeholder="Write a comment"
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
export default CommentForm