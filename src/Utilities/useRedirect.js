import { Paths } from '../paths';
import { stringify } from 'query-string';

const useRedirect = (history, path) => (query) => {
    const search = stringify(query, { arrayFormat: 'bracket' });
    history.push({
        pathname: Paths[path],
        search
    });
};

export default useRedirect;
