const CHANGE_STATUS = "CHANGE_STATUS";

const AsideStatus = (Status) => {
    return {
        type: CHANGE_STATUS,
        Status
    }
}

export { AsideStatus };