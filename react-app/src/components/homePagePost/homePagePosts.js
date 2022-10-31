import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import "./homepage.css"
import {getAllPostsThunk} from '../../store/postReducer'

import {loadPostCommentsThunk,loadUserComments} from '../../store/commentReducer'
function AllPosts(){
    const dispatch = useDispatch()
    const history = useHistory();
    const postObj = useSelector(state => state.postState)
   // const postArr = Object.values(postObj.allPosts)
 //   console.log("POSTARR",postArr)
    console.log("postObj",postObj)
    const user = useSelector(state => state.session.user)
    console.log("postObj",postObj.allPosts)
    useEffect(()=>{
        dispatch(getAllPostsThunk())
        // dispatch(loadUserComments())
    },[dispatch])

return(
    <div>
        <div className="postdiv">
            
{
// postArr.forEach((post,idx)=>{
//    console.log("post.longText")//nu varanum but breaking
//     console.log("**********POST IN MAP***********",post)
   // console.log("index",idx)
    // console.log("&&&&&&&&&&&&&&&&&&&",post.id.longText)
    // console.log("&&&&",post[0].longText)
 
//
{/* }) */}
}
</div>

    </div>
)



}
export default AllPosts