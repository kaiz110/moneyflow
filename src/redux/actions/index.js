

export const moneyIn = (amount) => {
    return {
        type: 'MONEY_IN',
        payload: amount
    }
}

export const moneyOut = (amount) => {
    return {
        type: 'MONEY_OUT',
        payload: amount
    }
}

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

export const historySave = (object) => {
    return {
        type: 'HISTORY_SAVE',
        payload: object
    }
}