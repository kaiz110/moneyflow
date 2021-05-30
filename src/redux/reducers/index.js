
// history = [{tag: ...,type: ...,amount:...}]
const initalState = {
    fund: 0,
    history: [],
    tags: ['Tiền ăn','Quần áo'],
}

const reducer = (state = initalState, action) => {
    switch(action.type){
        case 'FUND_CHANGE':
            return {...state, fund: state.fund + action.payload}
    }
}

export default reducer