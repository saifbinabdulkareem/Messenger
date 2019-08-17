
const updateuser = (user) => {
    return {
        type : 'UPDATE_USER',
        user
    }
}

const removeUser = () => {
    return {
        type : 'REMOVE_USER',
        user : null
    }
}
const objForChat = (chatRoomObj) => {
    return {
        type : 'CHAT_OBJ',
        chatRoomObj
    }
}
const removeObjForChat = () => {
    return {
        type : 'REMOVE_CHAT_OBJ',
        chatRoomObj: null
    }
}
export {
    updateuser,
    removeUser,
    objForChat,
    removeObjForChat
}