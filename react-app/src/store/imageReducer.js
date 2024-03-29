const GET_ALLIMAGES = 'Images/getAllImages'
const SET_IMAGE = 'Images/setImage'
const REMOVE_IMAGE = 'Images/removeImage'
const EDIT_IMAGE = 'Images/editImage'

const getAllImages = (images) => {
    return {
        type: GET_ALLIMAGES,
        images
    }

}
const setImage = (images) => {
    return {
        type: SET_IMAGE,
        images
    }
}
const editImage = (imageLoad) =>{
    return{
        type: EDIT_IMAGE,
        imageLoad
    }
}
const removeImage = (id) => {
    return {
        type: REMOVE_IMAGE,
        id
    }
}

export const allimagesThunk = (postId) => async dispatch => {
    const response = await fetch(`/api/posts/${postId}/images`)
    // console.log(response, "response")
    if (response.ok) {
        const data = await response.json();
        // console.log(data, "before data")
        dispatch(getAllImages(data))
        // console.log("data from get all images thunk", data)
        return { ...data }
    }
}

export const createImageThunk = (images,postId) =>async dispatch =>{
    // console.log(images,"images beftore in create thunk")
    // console.log(postId,"postId @@@@@@@@@@@@@@")
const response = await fetch(`/api/posts/${postId}/images`,{
    method: 'POST',
    headers:{ "Content-Type": "application/json"},
    body:JSON.stringify(images)
})
if (response.ok){
    // console.log(response,"response before")
    const newImage = await response.json();
    // console.log(newImage,"newImage *****************")
    dispatch(setImage(newImage.images));
    return newImage;
}
}

//UPDATE A POST 
export const updateImageThunk = (imageLoad) => async dispatch =>{
    console.log(imageLoad,"load")
    const response = await fetch(`/api/${imageLoad.id}`,{
        method : 'PUT',
        headers : { "Content-Type": "application/json" },
        body : JSON.stringify(imageLoad)
    })
    console.log(response,"updateResponse")
    if(response.ok){
        const updatedPost = await response.json();
        console.log(updatedPost,"up")
        dispatch(editImage(updatedPost.editedImage))
        return updatedPost;
    }
}

export const deleteImageThunk = (id)=> async dispatch =>{
    const response = await fetch(`/api/posts/${id}`,{
        method: "DELETE",
       // headers:{ "Content-Type": "application/json"},
    })
    console.log(response,"RESPONSE OF DELETE")
    if(response.ok){
        dispatch(removeImage(id))
    }

}

const imageReducer = (state = {}, action) => {
    let allimages = {}
    switch (action.type) {
        case GET_ALLIMAGES: {
            console.log("action.images", action.images)
            const groupedImages = action.images.images.reduce((acc, e) => {
                // console.log(e,"e")
                 acc[e.post_Id] = e || [];
                
                // acc[e.post_Id].push(e)
                return acc;
            }, {})
            // console.log(state,"state", groupedImages,"groupedImaes")
            return { ...state, ...groupedImages }
         
      
        }
        case SET_IMAGE:{
            const newState={};
            newState[action.images.id] = action.images;
            // console.log(newState,"State of createPostImage ^^^^")
            const newPostForm ={...state,...newState}
            console.log(newPostForm,"newPostForm");
            return newPostForm
         
        }
        case EDIT_IMAGE:{
            console.log(state,"stateImage")
            const newState = {...state}
            newState[action.payload.id]= action.payload;
            return newState;
        }
        case REMOVE_IMAGE:{
            const newState ={...state}
          delete newState[action.id]
          return newState;
        }
        
        default:
            return state;

    }
}
export default imageReducer