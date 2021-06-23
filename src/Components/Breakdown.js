import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0.5rem;
`;

const whiteSpace = 0.15; // Currently in percent of total bar width

function title(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

const Breakdown = ({ categoryCount = {}, categoryColor }) => {
  const totalCount = Object.values(categoryCount).reduce(
    (accumulated, currentVal) => accumulated + currentVal
  );

  const sortedCategories = Object.keys(categoryCount)
    .filter((category) => categoryCount[category] > 0)
    .sort((category) => {
      if (categoryCount[category] < categoryCount[category]) {
        return 1; // Normally should be -1, but we want descending order
      }
      if (categoryCount[category] > categoryCount[category]) {
        return -1;
      }
      return 0;
    })
    .map((category) => {
      return {
        name: category,
        barSpacing: categoryCount[category] / totalCount,
        color: categoryColor[category],
      };
    });

  const remainingSpace = 1 - ((sortedCategories.length - 1) * whiteSpace) / 100;

  return (
    <>
      <BarContainer>
        {sortedCategories.map(({ barSpacing, color }, idx) => {
          if (idx < sortedCategories.length - 1) {
            return (
              <React.Fragment key={idx}>
                <Bar
                  style={{
                    backgroundColor: color,
                    width: `${barSpacing * 100 * remainingSpace}%`,
                  }}
                />
                <Bar
                  style={{
                    backgroundColor: 'transparent',
                    width: `${whiteSpace}%`,
                  }}
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={idx}>
                <Bar
                  style={{
                    backgroundColor: color,
                    width: `${barSpacing * 100 * remainingSpace}%`,
                  }}
                />
              </React.Fragment>
            );
          }
        })}
      </BarContainer>
      <LabelsContainer>
        {sortedCategories.map(({ name, color }) => (
          <Label key={`label-${name}`}>
            <Square style={{ backgroundColor: color }} />
            <p>{title(name)}</p>
          </Label>
        ))}
      </LabelsContainer>
    </>
  );
};

Breakdown.propTypes = {
  categoryColor: PropTypes.object,
  categoryCount: PropTypes.object,
};

export default Breakdown;
