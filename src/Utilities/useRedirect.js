import { Paths } from '../paths';
import { formatQueryStrings } from './formatQueryStrings';

const useRedirect = (history, path) => (query) => {
    const { strings, stringify } = formatQueryStrings(query);
    const search = stringify(strings);
    history.push({
        pathname: Paths[path],
        search
    });
};

export default useRedirect;
