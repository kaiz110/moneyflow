

export const fundChange = (amount) => {
    return {
        type: 'FUND_CHANGE',
        payload: amount
    }
}

export const historySave = (object) => {
    return {
        type: 'HISTORY_SAVE',
        payload: object
    }
}