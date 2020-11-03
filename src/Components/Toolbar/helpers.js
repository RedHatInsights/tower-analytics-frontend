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
