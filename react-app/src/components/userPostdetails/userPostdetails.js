import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
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
import { deleteCommentThunk, getAllCommentsThunk, loadPostCommentsThunk, updateCommentThunk, createCommentThunk } from '../../store/commentReducer'
import { getAllPostsThunk, getPostsByUserIdThunk, removePostThunk, updatePostThunk, createPostThunk } from "../../store/postReducer";
import { allimagesThunk } from '../../store/imageReducer'
import chat from './chat.png'
import posticon from './posticon.png'
import './userPostdetail.css'
import AddPostModal from "./createPostModal";
import UpdatePostModal from "./updatePostModal";
import AddCommentModal from "./createcommentmodal";
import UpdatecommentModal from './updateCommentModal'
import { likesThunk, createThunk, removeThunk as removeLikeThunk } from '../../store/likeReducer'
const random = [random1, random2, random3,random4,random5,random6,random7,random8,random9]

export const UserSpotDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { userId } = useParams();


  let allPosts = useSelector(state => {
    //console.log("$$$$$$$$$$$$$$$$$$$", state.postState)
    return Object.values(state.postState)
  });

  const imageObject = {
    Demo: `${man}`,
    marnie: `${woman}`,
    bobbie: `${girl}`
  }

  // console.log(postIdKeys,"POSTIDKEYS")
  let allComments = useSelector(state => Object.values(state.commentState))
  console.log(allComments, "ALLCOMMENTS")//this works
  const likesPerPost = useSelector(state => (state.likeState))
  const imagesPerPost = useSelector(state => (state.imageState))
  let user = useSelector(state => state.session.user)
  // let ids = postId(allPosts)
  useEffect(async () => {
    const { posts } = await dispatch(getPostsByUserIdThunk(userId))//destructured because it had post key inside it
    // console.log(posts)
    posts.forEach((e) => {
      dispatch(getAllCommentsThunk(e.id))
      dispatch(likesThunk(e.id))
      dispatch(allimagesThunk(e.id))
    })
    // dispatch((allPosts.map((e)=>loadPostCommentsThunk(e.id))))
  }, [dispatch])

  return (
    <div>

      {/* <span className="profile">
      {profile(imageObject, user.username)}</span> */}

      <h1 className="personal">Welcome to {user.username}'s profile page </h1>




      {/* <div className="left">

        <div className="house">
          <i class="fa-solid fa-house"></i> Lives in Seattle </div>
        <div className="location"> <i class="fa-solid fa-location-dot"></i>   From India</div>
        <div className="heart"><i class="fa-solid fa-heart"></i> Married</div>
        <div className="clock"> <i class="fa-solid fa-clock"></i> Joined on September 2015</div>
      </div> */}
      <div className="right">
        <div className="addPost">
          <div className="innerDiv">

            {<AddPostModal />}
          </div>
        </div>
        <div className="allposts">{
          allPosts.sort((a, b) => b.id - a.id).map((post) => {
            // console.log(post, "post details")
            const likesForPost = likesPerPost[post.id] || [];
            const imageForPost = imagesPerPost[post.id] || [];
            // console.log(element, "%%%%%%%%%%%%%%%%%%%ELEMENT OF ALLPOST MAP FUNC")
            return (
              <div className="eachPost">
                <div className="postDetails">
                <span className="separateDiv">
                  {checkImage(imageObject, post.owner.username)}
                  <span className="username"> {post.owner.username}:</span>


                </span>
                <div className="postspan">
                  <span>
                    {/* <img className="posticon" src={posticon} /> */}
                  </span>
                  <span className="text">{post.longText}</span>
                  {isUserPostOwner(post, user) &&
                    <button className="deletePostButton" onClick={async (event) => {
                      event.preventDefault()

                      await dispatch(removePostThunk(post.id))
                      await dispatch((getPostsByUserIdThunk(userId)))
                      return history.push(`/users/${userId}/posts`)
                    }}>
                      <i class="fa-solid fa-trash"></i>

                    </button>}

                  {isUserPostOwner(post, user) &&
                    <UpdatePostModal post={post} />

                  }
                  {
                    images(imageForPost, user.id, post.id, dispatch, history)
                  }
                  {
                    likeButton(likesForPost, user.id, post.id, dispatch, history)

                  }
                   <div>count:{likesForPost.length}</div>
                  </div>
                </div>




                <div className="commentsDiv">{
                  //  allComments.sort((a,b)=>b.id - a.id)
                  allComments.sort((a, b) => b.id - a.id).map((element) => {

                    console.log(element, "details of comments")
                    return ((element.post_Id == post.id) &&
                      <div className="eachcomment">
                        <div className="trashbuttons">
                          <span className="commentUser">
                            {checkImage(imageObject, element.users.username)}
                            <span className="username">{element.users.username}:</span>
                          </span>
                          
                        </div>
                        <div className="tab">
                          {/* <span><img className="chat" src={chat} /></span> */}
                          <span>
                            {/* <i class="fa-brands fa-rocketchat"></i> */}
                            {element.commentText}</span>
                            {(element.user_Id == userId) && <span className="common-button">
                            <button className="deleteCommentButton" onClick={async (event) => {
                              event.preventDefault()
                              await dispatch(deleteCommentThunk(element.id))
                              await dispatch((loadPostCommentsThunk(element.post_Id)))
                              return history.push(`/users/${userId}/posts`)
                            }}>
                              <i class="fa-solid fa-trash"></i>

                            </button>
                          </span>}

                          <div className="editEachcomment">
                            {(element.user_Id == userId) &&
                              <span>

                                <UpdatecommentModal comment={element} />
                              </span>
                            }

                          </div>
                        </div>

                      </div>

                    )
                  })
                }


                </div>
                <div className="createComment">{

                  <div className="createEachcomment">
                    {
                      <div>
                        <AddCommentModal postId={post.id} />
                      </div>
                    }

                  </div>

                }
                </div>
              </div>
            )

          })

        }

        </div>


      </div>
    </div >
  )





}
const isUserPostOwner = (post, user) => post && user && post.owner_Id == user.id
const isUserCommentOwner = (comment, user) => comment && user && comment.user_Id == user.id
// const commentsPerPost = (comment,post)=> post  && comment.post_Id == post.id


const images = (imageObj, userId, postId, dispatch, history) => {
  // console.log(postId, "postId&&&&&&&&&&&&") //4,3,2,1
  // console.log(imagesArr, "imageArr ###############")
  // let imageOfPost = imagesArr.find((e) =>
  //   // console.log(e,"e  ****************")
  //   e.post_Id == postId
  // )
  // console.log(imageOfPost, "imageOfPost*********")
  // return (
  //   <div >
  //     {imageOfPost &&

  //       <div>
  //         <img className="images" src={imageOfPost.image_url} />
  //       </div>
  //     }
  //   </div>
  // )
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



