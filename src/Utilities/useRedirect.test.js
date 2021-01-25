import useRedirect from './useRedirect';

describe('Utilities/useRedirect', () => {
    let history = null;

    beforeEach(() => {
        history = {
            push: jest.fn()
        };
    });

    afterEach(() => {
        history = null;
    });

    it('should redirect without query', () => {
        const redirect = useRedirect(history, 'jobExplorer');
        redirect();
        expect(history.push).toHaveBeenCalledWith({
            pathname: '/job-explorer',
            search: ''
        });
    });

    it('should redirect with a query', () => {
        const redirect = useRedirect(history, 'jobExplorer');
        redirect({
            status: [ 'a', 'b' ],
            quickDateOption: 'a'
        });
        expect(history.push).toHaveBeenCalledWith({
            pathname: '/job-explorer',
            search: 'quickDateOption=a&status[]=a&status[]=b'
        });
    });
});
