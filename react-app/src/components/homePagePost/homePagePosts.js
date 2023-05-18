import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, Link } from "react-router-dom";
import "./homepage.css"
import { getAllPostsThunk, removePostThunk, getPostsByUserIdThunk } from '../../store/postReducer'
import chat from './chat.png'
import posticon from './posticon.png'
import { loadPostCommentsThunk, loadUserComments, getAllCommentsThunk, deleteCommentThunk } from '../../store/commentReducer'
import AddPostModal from '../userPostdetails/createPostModal.js'
import AddCommentModal from "../userPostdetails/createcommentmodal";
import UpdatecommentModal from "../userPostdetails/updateCommentModal";
import UpdatePostModal from "../userPostdetails/updatePostModal";
import '../userPostdetails/createpostmodal.css'
import '../userPostdetails/updatepostmodal.css'
import { likesThunk, createThunk, removeThunk as removeLikeThunk } from '../../store/likeReducer'
import { allimagesThunk } from '../../store/imageReducer'
import { getUserList } from '../../store/friendReducer'
import ChatForm from "../chat/chatForm";
import { allMessages, createNewMessage } from '../../store/chatReducer'

function AllPosts() {
  const dispatch = useDispatch()
  const history = useHistory();



  const postArr = useSelector(state => Object.values(state.postState))
  const commentArr = useSelector(state => Object.values(state.commentState))
  const likesPerPost = useSelector(state => (state.likeState))
  const imagesPerPost = useSelector(state => (state.imageState))
  console.log(imagesPerPost, "imagesPerPost 1")

  const user = useSelector(state => state.session.user)

  const friendsList = useSelector(state => Object.values(state.friendState))
  
  useEffect(async () => {

    dispatch(getUserList())
    const { posts } = await dispatch(getAllPostsThunk())
  
    posts.forEach((e) => {
      dispatch(getAllCommentsThunk(e.id))
      dispatch(likesThunk(e.id))
      dispatch(allimagesThunk(e.id))
    }
    )

  }, [dispatch])


  return (
    <div>
      <h1 className="title">Welcome to {user.username}'s Home Page</h1>
      <div className="createpostDiv">
        <div className="rightlist">
          <h2> FriendList</h2>
          {friendsList.map((friend) => {
            // console.log("user information", friend.id)
            return (
              <div className="chatform" onClick={() => {
                return history.push({
                  pathname: `/chat/${friend.id}`,
                  // state:{receiver_Id : friend.id}
                })
              }}>{friend.username}
              </div>
            )
          })}
        </div>
        <div className="leftlist">
          <div className="addPost">
            <div className="innerDivPost">

              {<span>
                {/* <img className="posticon" src={posticon} /> */}
                <AddPostModal />
              </span>}
            </div>
          </div>
        </div>
        <div className="postdiv">
          {
            postArr.sort((a, b) => b.id - a.id).map((post, idx) => {
            // postArr.sort((a, b) => a.id - b.id).map((post, idx) => {
              const likesForPost = likesPerPost[post.id] || [];
              const imageForPost = imagesPerPost[post.id] || [];
              //  console.log(imageForPost,"post per image")
              //  console.log(post.id,"post.id ^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
              // console.log(postArr,"postArr")
              return (
                <div className="singlepost">
                  <div>
                    {postperuser(post, dispatch, history, user, likesForPost.length,imageForPost)}

                    {
                      likeButton(likesForPost, user.id, post.id, dispatch, history)

                    }
                    {/* {
                      images(imageForPost, user.id, post.id, dispatch, history)
                    } */}
                  </div>



                  <div className="singleComment"> {
                    commentArr.sort((a, b) => b.id - a.id).map((comment) => {
                      //console.log(comment,"comment insided nested func")
                      return ((comment.post_Id == post.id) &&
                        <div className="perComment">
                          <span className="showButton">{comment.users.username}:
                            {(comment.user_Id == user.id) && deleteUpdateComment(comment, dispatch, history)}
                          </span>


                          <div className="commenttext">
                            <span><img className="chat" src={chat} />  </span>
                            <span>{comment.commentText} </span>
                          </div>

                        </div>)


                    })
                  }</div>

                  <div className="comment">
                    {
                      <div>
                        <AddCommentModal postId={post.id} />
                      </div>
                    }

                  </div>
                </div>

              )


            })}

        </div>
      </div>

    </div>
  )



}

const showChat = (id) => {
  // console.log("show chat form")
  return (
    <ChatForm friendId={id} />
  )
}
const deleteUpdateComment = (comment, dispatch, history) => {
  return (
    <div>
      <span className="common-button">
        <button className="deleteCommentButton" onClick={async (event) => {
          event.preventDefault()
          await dispatch(deleteCommentThunk(comment.id))
          await dispatch((loadPostCommentsThunk(comment.post_Id)))
          return history.push(`/`)
        }}>
          <i class="fa-solid fa-trash"></i>

        </button>
      </span>

      <span className="editEachcomment">
        {
          <span>

            <UpdatecommentModal comment={comment} />
          </span>
        }

      </span>
    </div>);
};
// const isUserPostOwner = (post, user) => post && user && post.owner_Id == user.id 
const postdeleteUpdate = (post, dispatch, history, userId) => {
  return (
    <span className="divbuttons">
      <span><button className="deletePostButton" onClick={async (event) => {
        event.preventDefault()

        await dispatch(removePostThunk(post.id))
        // await dispatch((getPostsByUserIdThunk(userId)))
        return history.push(`/`)
      }}>
        <i class="fa-solid fa-trash"></i>

      </button>
      </span>
      <span>
        {
          <UpdatePostModal post={post} />
        }
      </span></span>
  )

}

const postperuser = (post, dispatch, history, user, likesCount,imageForPost) => {
  return (
    <div className="perPost">

      <span className="user">{post.owner.username}:
        {post.owner_Id == user.id && postdeleteUpdate(post, dispatch, history, post.owner_Id)}
      </span>
      <div className="posttext">
        <span>
          <img className="posticon" src={posticon} />
        </span>

        <span>{post.longText}  </span>

      </div>
      <div>
      {
                      images(imageForPost, user.id, post.id, dispatch, history)
                    }
      </div>
      <div>count:{likesCount}</div>

    </div >
  )
}
const images = (imagesArr, userId, postId, dispatch, history) => {
  // console.log(postId, "postId&&&&&&&&&&&&") //4,3,2,1
  // console.log(imagesArr, "imageArr ###############")
  let imageOfPost = imagesArr.find((e) =>
    // console.log(e,"e  ****************")
    e.post_Id == postId
  )
  // console.log(imageOfPost, "imageOfPost*********")
  return (
    <div className="images">
      {imageOfPost &&
     
        <div>
          <img src={imageOfPost.image_url} />
        </div>
      }
    </div>
  )
}
const likeButton = (likeArr, userId, postId, dispatch, history) => {
  let idOfLike = likeArr.find(e => e.user_Id == userId)
  // console.log(idOfLike, "idOfLike")
  // console.log(likeArr, "likeArr from like button func")
  if (!idOfLike) {
    // console.log(like,"likeArr from likes func")
    return (


      <button className="like" onClick={async (event) => {
        // console.log(post, "post of like button")
        event.preventDefault()
        const payload = { user_Id: userId, post_Id: postId }
        // console.log(payload, "payload for likes thunk")
        await dispatch(createThunk(payload))
        await dispatch(likesThunk(postId))
        // console.log(dispatch(likesThunk(payload)), "get all likes of post")

      }
      } >
        <i class="fa-solid fa-thumbs-up"></i>
      </button>

    )
  }
  else {
    return (
      <div>
        {idOfLike &&
          <button className="like" onClick={async (event) => {
            event.preventDefault()
            await dispatch(removeLikeThunk(idOfLike.id))
            await dispatch(likesThunk(idOfLike.post_Id))
            history.push(`/`)
          }} ><i class="fa-solid fa-thumbs-down"></i></button>
        }
      </div>
    )
  }
}


export default AllPosts