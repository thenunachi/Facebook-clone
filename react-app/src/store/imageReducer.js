const GET_ALLIMAGES = 'Images/getAllImages'
const SET_IMAGE = 'Images/setImage'
const REMOVE_IMAGE = 'Images/removeImage'


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

const removeImage = (id) => {
    return {
        type: REMOVE_IMAGE,
        id
    }
}

export const allimagesThunk = (postId) => async dispatch => {
    const response = await fetch(`/api/posts/${postId}/images`)
    console.log(response, "response")
    if (response.ok) {
        const data = await response.json();
        // console.log(data, "before data")
        dispatch(getAllImages(data))
        console.log("data from get all images thunk", data)
        return { ...data }
    }
}

const imageReducer = (state = {}, action) => {
    let allimages = {}
    switch (action.type) {
        case GET_ALLIMAGES: {
            console.log("action.images", action.images)
            const groupedImages = action.images.images.reduce((acc, e) => {
                acc[e.post_Id] = acc[e.post_Id] || [];
                acc[e.post_Id].push(e)
                return acc;
            }, {})
            console.log(state,"state", groupedImages,"groupedImaes")
            return { ...state, ...groupedImages }
        }
        
        default:
            return state;

    }
}
export default imageReducer