const GET_ALL_USERS = 'session/GET_ALL_USERS';

const getAllUser =(payload)=>({
  type:GET_ALL_USERS,
  payload
})

// /Get All users
export const getUserList = ()=>async dispatch =>{
  const response = await fetch('/api/users/all/')
  if(response.ok){
    const data = await response.json();
    // console.log(data,"&&&&&data&&& of user")
    dispatch(getAllUser(data.users))
    return {...data}
  }
}


export default function friendReducer(state={},action){
    let newState={};
    switch(action.type){
        case GET_ALL_USERS:{
        
                    // console.log(action.payload,"payload of user")
                    action.payload.forEach(u=>{
            newState[u.id]=u
                    })
                    return{...newState}
                  } 
                  default:
      return state;
    }
}