import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
  padding: 7.5px 15px;
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
    font-size: 15px;
    margin-left: 20px;
`;

const Switch = styled(PFSwitch)`
  margin-left: 20px;

  svg {
    display: none;
  }
`;

class Legend extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(_isChecked, { target: { value }}) {
        const { onToggle } = this.props;
        const selectedId = parseFloat(value);
        onToggle(selectedId);
    };
    render() {
        const { data, selected, height } = this.props;
        return (
            <Container height={ height }>
                { data.map(
                    ({ name, value, id, count }, index) => (
                        <LegendDetail key={ index }>
                            <Wrapper>
                                <Color color={ value } />
                                <Title>{ name }</Title>
                            </Wrapper>
                            { count && (
                                <SubTitle>{ count }%</SubTitle>
                            ) }
                            { selected && (
                                <Switch
                                    isChecked={ selected.some(selection => selection === id) }
                                    onChange={ this.handleChange }
                                    aria-label={ name }
                                    value={ id }
                                    id={ `${name}-${id}` }
                                />
                            ) }
                        </LegendDetail>
                    )) }
            </Container>
        );
    }
}

Legend.propTypes = {
    data: PropTypes.array,
    selected: PropTypes.array,
    onToggle: PropTypes.func,
    height: PropTypes.string
};

export default Legend;
