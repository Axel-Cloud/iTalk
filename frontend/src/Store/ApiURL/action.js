const CHANGE_URL = "CHANGE_URL";

const ApiURL = (URL) => {
    return {
        type: CHANGE_URL,
        URL
    }
}

export { ApiURL };