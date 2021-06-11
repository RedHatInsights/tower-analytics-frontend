import React from 'react';
import styled from 'styled-components';

const BarContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    max-width: 100%;
    height: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

const Bar = styled.div`
    height: 100%;
`;

const LabelsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 1rem;
`;

const Label = styled.div`
    padding-left: 2rem;
    display: flex;
    align-items: center;
`;

const Square = styled.div`
    width: .75rem;
    height: .75rem;
    margin-right: .5rem
`;

function title (str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

const Breakdown = ({categoryCount, categoryColor}) => {
    console.log(categoryCount)
    if (typeof(categoryCount) !== 'object' || categoryCount == null) {
        return;
    }
    const barSpacing = .25 //Percentage of width
    let sortedCategories = [];
    let total = 0;

    for (const [k, v] of Object.entries(categoryCount)) {
        total += v;
    }
    for (const [k, v] of Object.entries(categoryCount)) {
        if (v != 0) {
            sortedCategories.push([k, v / total, categoryColor[k]]);
        }   
    }
    console.log(sortedCategories)

    sortedCategories.sort((a, b) => {
        if (a[1] < b[1]) {
            return 1; // Normally should be -1, but we want descending order
        }
        if (a[1] > b[1]) {
            return -1;
        }
        return 0;
    });

    let totalSpace = 1 - (sortedCategories.length * barSpacing / 100);

    return (
        <>
            <BarContainer>
                {
                    sortedCategories.map((v, idx) => {
                        if (idx < sortedCategories.length - 1) {
                            return (
                                <React.Fragment key={`bars-${idx}`}>
                                    <Bar style={{backgroundColor: v[2], width:`${v[1] * totalSpace * 100}%`}}/>
                                    <Bar style={{backgroundColor: "transparent", width:`${barSpacing}%`}}/>
                                </React.Fragment>
                            )
                        } else {
                            return (
                                <React.Fragment key={`bars-${idx}`}>
                                    <Bar style={{backgroundColor: v[2], width:`${v[1] * totalSpace * 100}%`}}/>
                                </React.Fragment>
                            )
                        }
                    })
                }
            </BarContainer>
            <LabelsContainer>
                {
                    sortedCategories.map((v, idx) => (
                        <Label key={`label-${idx}`}>
                            <Square style={{backgroundColor: v[2]}} />
                            <p>{title(v[0])}</p>
                        </Label>
                    ))
                }
            </LabelsContainer>
        </>
    )
}

export default Breakdown;