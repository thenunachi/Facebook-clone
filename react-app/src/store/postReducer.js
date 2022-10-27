/************************************************ACTION TYPES********************************************************************************** */
const GET_ALL_POSTS = 'Posts/getAllPosts'
const GET_POST_BY_ID = 'Posts/getPostsById'
const ADD_POST = 'Posts/addOnePost'
const EDIT_POST = 'Posts/editPost'
const DELETE_POST = 'Posts/removePost'


/************************************************ACTION********************************************************************************** */

const getAllPosts = payload =>{
    return{
        type:GET_ALL_POSTS,
        payload
    }
}


const getPostsById = payload =>{
    return{
        type:GET_POST_BY_ID,
        payload
    }
}


const addOnePost = payload =>{
    return {
        type:ADD_POST,
        payload
    }
}

const editPost = payload =>{
    return{
        type: EDIT_POST,
        payload
    }
}

const removePost = (id)=>{
    return{
        type:DELETE_POST,
        id
    }
}


/*************************************************THUNK********************************************************************************* */
// GET ALL POSTS
export const getAllPostsThunk =() => async dispatch =>{
    const response = await fetch('/api/posts/')
    if(response.ok){
        const data = await response.json()
        dispatch(getAllPosts(data.posts))
    }
    return response
}
//GET POSTS BY OWNERID

export const getPostsByIdThunk =(ownerId) =>async dispatch =>{
const response = await fetch(`/api/posts/${ownerId}`);
if(response.ok){ 
    const data = await response.json();
    dispatch(getPostsById(data.onePost))
    return { ... data};
   }
}

//CREATE A POST

export const createPostThunk = (data) => async dispatch =>{
    const response = await fetch(`/api/posts/`,{
        method : 'POST',
        headers : { "Content-Type": "application/json" },
        body : JSON.stringify(data)
    })
    if(response.ok){
        const postResponse = await response.json();
        dispatch(addOnePost(postResponse.post))
        return postResponse;
    }
}

//UPDATE A POST 
export const updatePostThunk = (payload) => async dispatch =>{
    const response = await fetch(`/api/posts/${payload.id}`,{
        method : 'PUT',
        headers : { "Content-Type": "application/json" },
        body : JSON.stringify(payload)
    })
    if(response.ok){
        const updatedPost = await response.json();
        dispatch(editPost(updatedPost.editedPost))
        return updatedPost;
    }
}


//DELETE A POST 
export const removePostThunk = (id)=> async dispatch =>{
    const response = await fetch(`/api/posts/${id}`,{
        method: DELETE_POST,
        headers:{ "Content-Type": "application/json"},
    })
    if(response.ok){
        dispatch(removePost(id))
    }
}



/**********************************************REDUCER************************************************************************************ */

  const postReducer = (state={},action)=>{
    switch(action.type){
        case GET_ALL_POSTS:{
            const allPosts={}
            action.payload.forEach(post =>{
                allPosts[post.id] = post //assigning post to post's id
            })
            const newState ={ ...state,allPosts} //initiall state will be empty{} spreading it out first then allPosts
            console.log("NEWSTATE from GETALLPOSTS**************",newState)
            return newState
        }
        /******************************************************************************* */
        case GET_POST_BY_ID:{
            const newState ={};
            newState[action.payload.ownerId] = action.payload
            console.log("NEWSTATE from GETAPOSTS**************",newState)
            return newState
        }
        /******************************************************************************* */
        case ADD_POST:{
            const newState={};
            newState[action.payload.id] = action.payload
            const newPostForm ={...state,...newState}
            return newPostForm
        }
         /******************************************************************************* */
         case EDIT_POST:{
            const newState={...state}
            newState[action.payload.id] = action.payload;
            return newState;
         }
         /******************************************************************************* */
         case DELETE_POST:{
          const newState ={...state}
          delete newState[action.id]
          return newState;
         }
        default:
            return state
    }
}

export default postReducer




















/********************************************************************************************************************************** */