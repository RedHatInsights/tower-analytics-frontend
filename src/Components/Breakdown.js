import React from 'react';

const barContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
    maxWidth: "100%",
    height: "10px",
    marginTop: "1rem",
    marginBottom: "1rem",
};

const bar = {
    height: "100%"
};

const labelsContainer = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: "1rem"
};

const label = {
    paddingLeft: "2rem",
    display: "flex",
    alignItems: "center"
};

const square = {
    width: "10px",
    height: "10px",
    marginRight: ".5rem"
};

const Breakdown = ({categoryCount, categoryColor}) => {
    const barSpacing = .25 //Percentage of width
    let sortedCategories = [];
    let total = 0;

    for (const [k, v] of Object.entries(categoryCount)) {
        total += v;
    }
    for (const [k, v] of Object.entries(categoryCount)) {
        sortedCategories.push([k, v / total, categoryColor[k]]);
    }

    sortedCategories.sort((a, b) => {
        if (a[1] < b[1]) {
            return 1; // Normally should be -1, but we want descending order
        }
        if (a[1] > b[1]) {
            return -1;
        }
        return 0;
    });

    console.log(sortedCategories);
    let totalSpace = 1 - (sortedCategories.length * barSpacing / 100);

    return (
        <>
            <div style={barContainer}>
                {
                    sortedCategories.map((v, idx) => {
                        if (idx < sortedCategories.length - 1) {
                            return (
                                <>
                                    <div style={{...bar, backgroundColor: v[2], width:`${v[1] * totalSpace * 100}%`}}></div>
                                    <div style={{...bar, backgroundColor: "transparent", width:`${barSpacing}%`}}></div>
                                </>
                            )
                        } else {
                            return (
                                <div style={{...bar, backgroundColor: v[2], width:`${v[1] * totalSpace * 100}%`}}></div>
                            )
                        }
                    })
                }
            </div>
            <div style={labelsContainer}>
                {
                    sortedCategories.map((v, idx) => (
                        <div style={label}>
                            <div style={{...square, backgroundColor: v[2]}}></div>
                            <p>{v[0]}</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Breakdown;