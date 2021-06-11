
export const addTag = (name) => {
    return {
        type: 'ADD_TAG',
        payload: name
    }
}

export const editTag = (name,oldname) => {
    return {
        type: 'EDIT_TAG',
        payload: {name,oldname}
    }
}

export const delTag = (name) => {
    return {
        type: 'DEL_TAG',
        payload: name
    }
}

export const historySave = (object) => {
    return {
        type: 'HISTORY_SAVE',
        payload: object
    }
}

export const rehydrateState = (stateObject) => {
    return {
        type: 'REHYDRATE_STATE',
        payload: stateObject
    }
}