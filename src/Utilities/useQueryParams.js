import { useReducer } from 'react';
import moment from 'moment';

export const useQueryParams = initial => {
    const paramsReducer = (state, action) => {
        switch (action.type) {
            case 'SET_STARTDATE':
                return { ...state, startDate: action.startDate };
            case 'SET_ENDDATE':
                return { ...state, endDate: action.endDate };
            case 'SET_ID':
                return { ...state, id: action.id };
            case 'SET_ORDERBY':
                return { ...state, orderBy: action.order };
            default:
                throw new Error();
        }
    };

    const [ queryParams, dispatch ] = useReducer(
        paramsReducer,
        { ...initial }
    );

    return {
        queryParams,
        dispatch,
        setEndDate:
            () => {
                const endDate = moment.utc().format('YYYY-MM-DD');
                dispatch({ type: 'SET_ENDDATE', endDate });
            },
        setId:
            id => dispatch({ type: 'SET_ID', id }),
        setStartDate:
            days => {
                const startDate = moment.utc()
                .subtract(days, 'days')
                .format('YYYY-MM-DD');
                dispatch({ type: 'SET_STARTDATE', startDate });
            },
        setOrderBy:
            order => dispatch({ type: 'SET_ORDERBY', order })
    };
};
