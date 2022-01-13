const initialState = {
    Name: "",
    Lastname: "",
    Email: "",
    ProfileImage: ""
};

const UserInfoReducer = (state = initialState, {type, Name, Lastname, Email, ProfileImage}) => {
    switch(type){
        case "UPDATE_INFORMATION":
            return {
                ...state,
                Name,
                Lastname,
                Email,
                ProfileImage
            };
        default:
            return state;
    }
};

export default UserInfoReducer;