const UPDATE_INFORMATION = "UPDATE_INFORMATION";

const UpdateUserInfo = ({Name, Lastname, Email, ProfileImage}) => {
    return {
        type: UPDATE_INFORMATION,
        Name,
        Lastname,
        Email,
        ProfileImage
    }
}

export { UpdateUserInfo };