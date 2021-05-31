

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

export const historySave = (object) => {
    return {
        type: 'HISTORY_SAVE',
        payload: object
    }
}