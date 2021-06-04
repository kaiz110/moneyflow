
// history = [{tag: ...,type: ...,amount:...,time:...,note:...}]
const initalState = {
    fund: {in: 0, out: 0},
    history: [
        {
            type: 'IN',
            amount: 10,
            note: '',
            time: '2021-05-07T19:12:13+07:00',
            tag: []
        },
        {
            type: 'OUT',
            amount: 10,
            note: '',
            time: '2021-05-31T19:12:13+07:00',
            tag: []
        },
        {
            type: 'OUT',
            amount: 10,
            note: '',
            time: '2021-06-01T19:12:13+07:00',
            tag: []
        },
    ],
    tags: ['Tiền ăn','Quần áo'],
}

const reducer = (state = initalState, action) => {
    switch(action.type){
        case 'MONEY_IN':
            return {...state, fund: {...state.fund, in: state.fund.in + action.payload}}
        case 'MONEY_OUT':
            return {...state, fund: {...state.fund, out: state.fund.out + action.payload}}
        case 'HISTORY_SAVE':
            return {...state, history: [...state.history, action.payload]}
        default:
            return state
    }
}

export default reducer