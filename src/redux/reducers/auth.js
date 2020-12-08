import { auth } from '../actions/';

const AUTH = auth.types.AUTH;

export default (state = {
    authorized: false,
    pending: true,
    error: ''
}, action) => {
    switch (action.type) {
        case `${AUTH}_PENDING`:
            return { ...state,
                authorized: false,
                error: '',
                pending: true
            };
        case `${AUTH}_FULFILLED`:
            return {
                ...state,
                pending: false,
                authorized: true,
                error: ''
            };
        case `${AUTH}_REJECTED`:
            return {
                ...state,
                authorized: false,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
};
