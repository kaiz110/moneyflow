
// history = [{tag: ...,type: ...,amount:...,time:...,note:...}]
const initalState = {
    history: [],
    tags: ['Tiền ăn','Quần áo'],
}

const reducer = (state = initalState, action) => {
    switch(action.type){
        case 'ADD_TAG':
            return {...state, tags: [...state.tags, action.payload]}
        case 'EDIT_TAG':
            return {...state, tags: state.tags.map(val => {
                if(val === action.payload.oldname){
                    return action.payload.name
                } else {
                    return val
                }
            })}
        case 'DEL_TAG':
            return {...state, tags: state.tags.filter(val => val !== action.payload)}
        case 'HISTORY_SAVE':
            return {...state, history: [...state.history, action.payload]}
        case 'REHYDRATE_STATE':
            return {history: action.payload.history, tags: action.payload.tags}
        default:
            return state
    }
}

export default reducer