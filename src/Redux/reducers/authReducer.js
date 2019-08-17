const reducer = (state = {}, action) => {
    switch(action.type){
        case 'UPDATE_USER' : {
            return {...state, user: action.user}
        }
        case 'REMOVE_USER' : {
            return {...state, user: null}
        }
        case 'CHAT_OBJ' : {
            return {...state, chatRoomObj: action.chatRoomObj}
        }
        case 'REMOVE_CHAT_OBJ' : {
            return {...state, chatRoomObj: null}
        }
        default: {
            return state
        }
    }
}

export default reducer