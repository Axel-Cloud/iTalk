const initialState = {
    Name: "",
    Lastname: "",
    ProfileImage: ""
};

const UserInfoReducer = (state = initialState, {type, Name, Lastname, ProfileImage}) => {
    switch(type){
        case "UPDATE_INFORMATION":
            return {
                ...state,
                Name,
                Lastname,
                ProfileImage
            };
        default:
            return state;
    }
};

export default UserInfoReducer;