/************************************************ACTION TYPES********************************************************************************** */
const GET_ALL_POSTS = 'Posts/getAllPosts'
const GET_POST_BY_ID = 'Posts/getPostsById'
const ADD_POST = 'Posts/addOnePost'
const EDIT_POST = 'Posts/editPost'
const DELETE_POST = 'Posts/removePost'


/************************************************ACTION********************************************************************************** */

const getAllPosts = payload => {
    console.log(payload, "rrrrr")
    return {
        type: GET_ALL_POSTS,
        payload
    }

}


const getPostsById = payload => {
    return {
        type: GET_POST_BY_ID,
        payload
    }
}


const addOnePost = payload => {
    return {
        type: ADD_POST,
        payload
    }
}

const editPost = payload => {
    return {
        type: EDIT_POST,
        payload
    }
}

const removePost = (id) => {
    return {
        type: DELETE_POST,
        id
    }
}


/*************************************************THUNK********************************************************************************* */
// GET ALL POSTS
export const getAllPostsThunk = () => async dispatch => {
    const response = await fetch('/api/posts/')
    console.log(response, "eeeeee")
    if (response.ok) {
        const data = await response.json()
        console.log(data, "DATA")
        dispatch(getAllPosts(data.posts_with_images))
        return { ...data }
    }

}
//GET POSTS BY OWNERID

export const getPostsByUserIdThunk = (ownerId) => async dispatch => {
    const response = await fetch(`/api/posts/${ownerId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getPostsById(data.posts_with_images))

        return { ...data };
    }
}

//CREATE A POST

export const createPostThunk = (data) => async dispatch => {
    console.log("DATA**********", data)
    const response = await fetch(`/api/posts/`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    console.log(response, "CREATED POST THUNK RESPONSE")
    if (response.ok) {
        const postResponse = await response.json();
        console.log(postResponse, "postResponse")
        dispatch(addOnePost(postResponse.images))
        return postResponse;
    }
}

//UPDATE A POST 
export const updatePostThunk = (payload) => async dispatch => {
    console.log(payload,"payloadfromupdatepost")
    const response = await fetch(`/api/posts/${payload.id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const updatedPost = await response.json();
        dispatch(editPost(updatedPost.editedPost))
        return updatedPost;
    }
}


//DELETE A POST 
export const removePostThunk = (id) => async dispatch => {
    // console.log("ID OF DELETE POST ^^^^^^^^^^^^",id)
    const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        // headers:{ "Content-Type": "application/json"},
    })
    console.log(response, "RESPONSE OF DELETE")
    if (response.ok) {
        dispatch(removePost(id))
    }
}



/**********************************************REDUCER************************************************************************************ */

const postReducer = (state = {}, action) => {
    let allPosts = {}
    switch (action.type) {
        case GET_ALL_POSTS: {
            console.log(action.payload, "ACTION")
            action.payload.forEach(post => {
                allPosts[post.id] = post //assigning post to post's id
            })
            // const newState ={ ...state,allPosts} //initiall state will be empty{} spreading it out first then allPosts
            // console.log("NEWSTATE from GETALLPOSTS**************",newState)
            return { ...allPosts }
        }
        /******************************************************************************* */
        case GET_POST_BY_ID: {
            // const newState ={};
            // newState[action.payload] = action.payload
            // console.log("NEWSTATE from GETAPOSTS**************",newState)
            // return newState
            action.payload.forEach(post => {
                allPosts[post.id] = post //assigning post to post's id
                // console.log(allPosts,"Find the allposts type")//4:{id: 4, likes: 0, longText: 'I went on a ride in Testla', owner: {…}, owner_Id: 3}

            })
            //console.log(action.payload,"post of owner^^^")
            // return action.payload
            return { ...allPosts }

        }
        /******************************************************************************* */
        case ADD_POST: {
            const newState = {};
            newState[action.payload.post_Id] = action.payload
            console.log(newState, "State of createPost")
            const newPostForm = { ...state, ...newState }
            return newPostForm
        }
        /******************************************************************************* */
        case EDIT_POST: {
            const newState = { ...state }
            newState[action.payload.id] = action.payload;
            return newState;
        }
        /******************************************************************************* */
        case DELETE_POST: {
            const newState = { ...state }
            delete newState[action.id]
            return newState;
        }
        default:
            return state
    }
}

export default postReducer




















/********************************************************************************************************************************** */