const initialState = {
    ID: "",
    Name: "",
    Lastname: "",
    Online: false,
    isSelected: false,
    ProfileImage: ""
}

const SelectedConversationReducer = (state = initialState, {type, ID, Name, Lastname, Online, isSelected, ProfileImage}) => {
    switch(type){
        case "CHANGE_CONVERSATION":
            return {
                ...state,
                ID,
                Name,
                Lastname,
                Online,
                isSelected,
                ProfileImage
            }
        default:
            return state;       
    }
};

export default SelectedConversationReducer;