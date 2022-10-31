import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadUserComments, updateCommentThunk, loadPostCommentsThunk } from "../../store/commentReducer";



/*********************************************************************************** */
function UpdateCommentForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  /*****************************************useState****************************************** */
  const [commentText, setCommentText] = useState("");
  const [validations, setValidations] = useState([])
  //   const [show, setShow] = useState(false);

  const updateComments = (e) => setCommentText(e.target.value);

  let { commentId } = useParams();

  let allPost = useSelector(state => Object.values(state.postState));
 //console.log(allPost,"ALL POST IN UPDATE PFORM")
  let allComments = useSelector(state => Object.values(state.commentState));
//console.log(allComments,"ALLCOMMENTS")
//console.log(allComments[0].EditedComment.post_Id,"ALLCOMMENTS")
  //console.log(allComments[0].EditedComment.post_Id, "Allcomments")

  let user = useSelector(state => state.session.user);

  //let postId = allComments[0].EditedComment.post_Id;

  const commentofUser = allComments.find(comment => user && comment.userId === user.id)

  // const post = allPost.find(post => post.id === +postId)

  
  /***************************************useEffect******************************************** */
  useEffect(() => {
    // dispatch(loadUserComments(postId))
    //dispatch((loadPostCommentsThunk(postId)));

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
    const payload = { id: commentId, commentText };
    let newComment = await dispatch(updateCommentThunk(payload))
    //dispatch(loadPostCommentsThunk(postId))
    // console.log("NEW REVIEW " , newReview)
    // if(newReview){
    //     onCancel()
    // }
  }

  /***************************************render func******************************************** */
  return (
    <form className="create-review-text" onSubmit={handleSubmit}>
      <ul className="errorsReview">
        {
          validations.map((error, index) => (
            <li key={index}>{error}</li>
          ))
        }
      </ul>
      <input id="reviewInput"
        type="text"
        placeholder="Write a review"
        required
        value={commentText}
        onChange={updateComments}
      />


      <button className="editButton" type="submit">Submit comment</button>
      {/* <button className="cancelEdit" type="button" onClick={onCancel}>Cancel</button> */}

    </form>
  )
}
export default UpdateCommentForm