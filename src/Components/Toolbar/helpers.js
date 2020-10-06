/**
 * Get comparator values if their key is in the item list
 */
export const handleCheckboxChips = (item, comparator) => {
    if (item && comparator) {
        return item.reduce((acc, i) => {
            Number.isInteger(parseInt(i)) ? (i = parseInt(i)) : i;

            comparator.forEach(cmpItem => {
                if (cmpItem.key === i) {
                    acc.push(cmpItem.value);
                }
            });

            return acc;
        }, []);
    }

    return [];
};

/**
 * Convert a list of objects to a list of the last value if defined
 */
export const handleSingleChips = (item, comparator) => {
    if (item && typeof item === 'string' && comparator) {
        let val;
        comparator.forEach(i => {
            if (i.key === item) {
                val = i.value;
            }
        });

        if (val !== undefined) {
            return [ val ];
        }
    }

    return [];
};

export const camelToSentence = str => {
    const result = str.replace(/([A-Z])/g, ' $1').toLowerCase();
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const sentenceToCamel = str => str.toLowerCase().replace(/\s+(.)/g, (match, group1) => group1.toUpperCase());
