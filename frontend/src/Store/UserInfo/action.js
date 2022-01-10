const UPDATE_INFORMATION = "UPDATE_INFORMATION";

const UpdateUserInfo = ({Name, Lastname, ProfileImage}) => {
    return {
        type: UPDATE_INFORMATION,
        Name,
        Lastname,
        ProfileImage
    }
}

export { UpdateUserInfo };