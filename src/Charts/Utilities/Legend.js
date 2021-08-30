import PropTypes from 'prop-types';
import React from 'react';
import { Switch } from '@patternfly/react-core';

import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  overflow: auto;
  width: 100%;
  height: ${(props) => props.height};
`;

const LegendDetail = styled.div`
  display: flex;
  padding: 7.5px 15px;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: auto;
`;

const Color = styled.div.attrs((props) => ({
  color: props.color || 'black',
}))`
  min-width: 12px;
  height: 12px;
  background: ${(props) => props.color};
  margin-right: 20px;
`;

const Title = styled.span`
  font-size: 15px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const SubTitle = styled.span`
  font-size: 15px;
  margin-left: auto;
  margin-right: 0;
  padding-right: 10px;
`;

const Legend = ({ data, selected, height, onToggle, chartName }) => {
  return (
    <Container height={height}>
      {data.map(({ name, value, id, count }, index) => (
        <LegendDetail key={index}>
          <Wrapper>
            <Color color={value} />
            <Title>{name}</Title>
          </Wrapper>
          {count && <SubTitle>{count}</SubTitle>}
          {selected && (
            <Switch
              isChecked={selected.some((selection) => selection === id)}
              onChange={() => onToggle(id)}
              aria-label={`${chartName}-${name}`}
              value={id}
              key={index}
            />
          )}
        </LegendDetail>
      ))}
    </Container>
  );
};

Legend.propTypes = {
  data: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  height: PropTypes.string.isRequired,
  chartName: PropTypes.string.isRequired,
};

export default Legend;
