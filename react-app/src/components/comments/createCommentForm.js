import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createCommentThunk,loadUserComments,loadPostCommentsThunk } from "../../store/commentReducer";



/*********************************************************************************** */
function CommentForm  ()  {
  const dispatch = useDispatch();
  const history = useHistory();

  /*****************************************useState****************************************** */
  const [commentText, setCommentText] = useState("");
  const [validations, setValidations] = useState([])
//   const [show, setShow] = useState(false);

  const updateComments = (e) => setCommentText(e.target.value);
  
  let { postId } = useParams();
  console.log(postId,"POST ID FROM PARAMS")
  let allPost = useSelector(state => Object.values(state.postState));
  console.log(allPost,"AL POST")
  // console.log("ALLPRODUCTS" ,allProducts)
  let allComments = useSelector(state => Object.values(state.commentState));
  let user = useSelector(state => state.session.user);

  const commentofUser = allComments.find(comment => user && comment.userId === user.id)
  const post = allComments.find(c => c.post_Id === +postId)
  console.log(post,"CHECK POST.ID is same as params")//2
  // console.log("PRODUCT",product)
  /***************************************useEffect******************************************** */
  useEffect(() => {
    dispatch(loadUserComments())
    dispatch((loadPostCommentsThunk(postId)));

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
    const payload = { id:postId,commentText };
    console.log(payload,"PAYLOAD ISIDE CREACRE")
    let newComment = await dispatch(createCommentThunk(payload))
    dispatch(loadPostCommentsThunk(post.id))
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
        placeholder="Write a comment"
        required
        value={commentText}
        onChange={updateComments}
      />

     
      <button className="editButton" type="submit">Submit comment</button>
      {/* <button className="cancelEdit" type="button" onClick={onCancel}>Cancel</button> */}

    </form>
  )
}
export default CommentForm