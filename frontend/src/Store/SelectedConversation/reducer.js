const initialState = {
    ID: "",
    Name: "",
    Lastname: "",
    Online: false,
    ProfileImage: ""
}

export default (state = initialState, {type, ID, Name, Lastname, Online, ProfileImage}) => {
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
}