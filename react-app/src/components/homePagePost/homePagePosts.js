import { useCallback, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, Link } from "react-router-dom";
import "./homepage.css"
import { getAllPostsThunk, removePostThunk, getPostsByUserIdThunk } from '../../store/postReducer'
import chat from './chat.png'
import posticon from './posticon.png'
import man from './man.png'
import woman from './woman.png'
import girl from './girl.png'
import random1 from './random 1.png'
import random2 from './random 2.png'
import random3 from './random 3.png'
import random4 from './cleaner.png'
import random5 from './guarani.png'
import random6 from './nutritionist.png'
import random7 from './profile.png'
import random8 from './woman2.png'
import random9 from './woman3.png'
import { loadPostCommentsThunk, loadUserComments, getAllCommentsThunk, deleteCommentThunk } from '../../store/commentReducer'
import AddPostModal from '../userPostdetails/createPostModal.js'
import AddCommentModal from "../userPostdetails/createcommentmodal";
import UpdatecommentModal from "../userPostdetails/updateCommentModal";
import UpdatePostModal from "../userPostdetails/updatePostModal";
import '../userPostdetails/createpostmodal.css'
import '../userPostdetails/updatepostmodal.css'
import { likesThunk, createThunk, removeThunk as removeLikeThunk } from '../../store/likeReducer'
import { allimagesThunk, deleteImageThunk } from '../../store/imageReducer'
import { getUserList } from '../../store/friendReducer'
import ChatForm from "../chat/chatForm";
import { allMessages, createNewMessage } from '../../store/chatReducer'
const random = [random1, random2, random3, random4, random5, random6, random7, random8, random9]

function AllPosts() {
  const dispatch = useDispatch()
  const history = useHistory();



  const postArr = useSelector(state => Object.values(state.postState))
  const commentArr = useSelector(state => Object.values(state.commentState))
  const likesPerPost = useSelector(state => (state.likeState))
  const imagesPerPost = useSelector(state => (state.imageState))
  console.log(imagesPerPost,"whatisImage")
  // console.log(typeof imagesPerPost,"typeIm")
  const user = useSelector(state => state.session.user)
  const friendsList = useSelector(state => Object.values(state.friendState))
  const [imageObject, setImageObject] = useState({
    Demo: `${man}`,
    marnie: `${woman}`,
    bobbie: `${girl}`
  })

  // const imageObject = {
  //   Demo: `${man}`,
  //   marnie: `${woman}`,
  //   bobbie: `${girl}`
  // }
  // console.log(imageObject, "imageObject")



  // console.log(random, "random")
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

  const onClickChat = useCallback((friend) => {
     console.log(friend, "obj")
    return history.push({
      pathname: `/chat/${friend.id}`,
      state: { imageObject }
    });
  }, [imageObject]
  )

  return (
    <div>
      <h1 className="title">Welcome to {user.username}'s Home Page</h1>
      <div className="createpostDiv">
        <div className="rightlist">
          <h2> FriendList</h2>
          {friendsList.map((friend) => {
            // console.log("friend", friend)
            return (
              <div className="chatform" onClick={() => onClickChat(friend)

                //   () => {
                //   return history.push({
                //     pathname: `/chat/${friend.id}`,
                //     // state:{receiver_Id : friend.id}
                //   })
                // }
              }>{checkImage(imageObject, friend.username)}
                <span className="Friendname">{friend.username}</span>

              </div>
            )
          })}
        </div>
        <div className="leftlist">
          <div className="addPost">
            <div className="innerDivPost">

              {<span>
               
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
              
              return (
                <div className="singlepost">
                  <div>
                    {postperuser(post, dispatch, history, user, likesForPost.length, imageForPost, imageObject)}

                    {
                      likeButton(likesForPost, user.id, post.id, dispatch, history)

                    }

                  </div>



                  <div className="singleComment"> {
                    commentArr.sort((a, b) => b.id - a.id).map((comment) => {
                      //console.log(comment,"comment insided nested func")
                      return ((comment.post_Id == post.id) &&
                        <div className="perComment">
                          <span className="showButton">

                            {checkImage(imageObject, comment.users.username)}
                            <span>{comment.users.username}: <span className="commenttext">{comment.commentText} </span>
                         
                            
                            </span>

                            {(comment.user_Id == user.id) && deleteUpdateComment(comment, dispatch, history)}
                          </span>


                          

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
  //  .log("show chat form")
  return (
    <ChatForm friendId={id} />
  )
}
const deleteUpdateComment = (comment, dispatch, history) => {
  return (
    <div className="icondiv">
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
const postdeleteUpdate = (post, dispatch, history, userId,imagesPerPost) => {
  return (
    <span className="divbuttons">
      <span><button className="deletePostButton" onClick={async (event) => {
        event.preventDefault()

        await dispatch(removePostThunk(post.id))
        await dispatch(deleteImageThunk(post.id))
        await dispatch((getPostsByUserIdThunk(userId)))
        
      }}>
        <i class="fa-solid fa-trash"></i>

      </button>
      </span>
      <span>
        {
        <UpdatePostModal post={post} imagesPerPost={imagesPerPost} />
        }
      </span></span>
  )

}

const postperuser = (post, dispatch, history, user, likesCount, imageForPost, imageObject) => {
console.log(imageObject,"imageObject")
console.log(post,"ownername")

  return (
    <div className="perPost">

      <span className="user">
        {checkImage(imageObject, post.owner.username)}
        <span className="username">   {post.owner.username} :</span>

      </span>

      <div className="posttext">
      

        <span className="leftE">{post.longText}  </span>
        <span className="rightE">{post.owner_Id == user.id && postdeleteUpdate(post, dispatch, history, post.owner_Id,imageForPost)}</span>

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
const images = (imageObj, userId, postId, dispatch, history) => {

  let imageOfPost = null;
 
    if(imageObj.post_Id == postId){    
      imageOfPost = imageObj;
    }
  if(imageOfPost){
    return(
      <div>
             <img className="images" src={imageOfPost.image_url} />
           </div>
    )
  }
  else{
    return null;
  }
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

const checkImage = (imageObject, username) => {
  // console.log(imageObject, username, "%%%%%%%username")
  const isUsernameNotInObjectKeys = Object.keys(imageObject).indexOf(username) === -1;
  for (const key in imageObject) {
    if (key == username) {
      return (
        <span>
          <img className="logoPic" src={imageObject[key]} />
        </span>
      )
    }
    else {
      let image = randomImage(random)

      if (isUsernameNotInObjectKeys) {
        // console.log(username,isUsernameNotInObjectKeys,"isUsernamenotin keys")
        imageObject[username] = image
        // console.log(imageObject, "objectImage")
        return (
          <span>
            <img className="logoPic" src={imageObject[username]} />
          </span>
        )
      }
    }
  }
}

const randomImage = (obj) => {
  if (obj === undefined || obj === null) {
    return null;
  }
  let keys = Object.keys(obj)

  return obj[keys[keys.length * Math.random() << 0]];
}

export default AllPosts