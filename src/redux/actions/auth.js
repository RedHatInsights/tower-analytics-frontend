import { preflightRequest } from '../../Api';

export const types = {
    AUTH: 'AUTH'
};

export const fetchUser = () => ({
    type: types.AUTH,
    payload: window.insights.chrome.auth.getUser()
    .then(() => preflightRequest())
});

export default {
    types,
    fetchUser
};
