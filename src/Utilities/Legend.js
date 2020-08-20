import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Switch as PFSwitch } from '@patternfly/react-core';

import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  overflow: auto;
  width: 100%;
  height: ${props => props.height};
`;

const LegendDetail = styled.div`
  display: flex;
  padding: 5px 10px;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: auto;
`;

const Color = styled.div.attrs(props => ({
    color: props.color || 'black'
}))`
  min-width: 12px;
  height: 12px;
  background: ${props => props.color};
  margin-right: 20px;
`;

const Title = styled.span`
  font-size: 12px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const SubTitle = styled.span`
    font-size: 12px;
    margin-left: 20px;
`;

const Switch = styled(PFSwitch)`
  margin-left: 20px;

  svg {
    display: none;
  }
`;

const Legend = ({
    data = [],
    selected = [],
    setSelected = () => {},
    height = 100,
    defaultSelectedNum = 7
}) => {
    const handleChange = (_isChecked, { target: { value }}) => {
        const selectedId = parseFloat(value);
        let sel = selected;
        if (sel.indexOf(selectedId) === -1) {
            sel = [ ...sel, selectedId ];
        } else if (sel.includes(selectedId)) {
            sel = [ ...sel ].filter(s => s !== selectedId);
        }

        setSelected(sel);
    };

    const setDefaultSelected = num => {
        let sel = [];
        data.forEach(({ id }, index) => {
            if (index <= num) {
                sel.push(id);
            }
        });
        setSelected(sel);
    };

    useEffect(() => {
        if (selected && selected.length === 0) {
            setDefaultSelected(defaultSelectedNum);
        }
    }, []);

    return (
        <Container height={ height + 'px' }>
            { data.map(
                ({ name, value, id, count }, index) => (
                    <LegendDetail key={ index }>
                        <Wrapper>
                            <Color color={ value } />
                            <Title>{ name }</Title>
                        </Wrapper>
                        { count && (
                            <SubTitle>{ count }</SubTitle>
                        ) }
                        { selected && (
                            <Switch
                                isChecked={ selected.some(selection => selection === id) }
                                onChange={ handleChange }
                                aria-label={ name }
                                value={ id }
                                id={ `${name}-${id}` }
                            />
                        ) }
                    </LegendDetail>
                )) }
        </Container>
    );
};

Legend.propTypes = {
    data: PropTypes.array,
    selected: PropTypes.array,
    setSelected: PropTypes.func,
    height: PropTypes.number,
    defaultSelectedNum: PropTypes.number
};

export default Legend;
