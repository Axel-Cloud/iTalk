const initialState = {
    ID: "",
    Name: "",
    Lastname: "",
    Online: false,
    ProfileImage: ""
}

const SelectedConversationReducer = (state = initialState, {type, ID, Name, Lastname, Online, ProfileImage}) => {
    switch(type){
        case "CHANGE_CONVERSATION":
            return {
                ...state,
                ID,
                Name,
                Lastname,
                Online,
                ProfileImage
            }
        default:
            return state;       
    }
};

export default SelectedConversationReducer;