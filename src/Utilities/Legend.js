import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Switch as PFSwitch } from '@patternfly/react-core';

import styled from 'styled-components';

const Container = styled.div`
  margin-top: 20px;
  overflow: auto;
  min-width: 25%;
`;

const LegendDetail = styled.div`
  display: flex;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
`;

const Color = styled.div.attrs(props => ({
    color: props.color || 'black'
}))`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
`;

const Title = styled.span`
  font-size: 12px;
  display: inline-block;
  margin: 0 30px 0 10px;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const Switch = styled(PFSwitch)`
  --pf-c-switch--Height: 15px;

  svg {
    display: none;
  }
`;

class Legend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: true
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(_isChecked, { target: { value }}) {
        const { onToggle } = this.props;
        const selectedId = parseFloat(value);
        onToggle(selectedId);
    };
    render() {
        const { data, selected } = this.props;
        return (
            <Container>
                { data.map(
                    ({ name, value, id }, index) => (
                        <LegendDetail key={ index }>
                            <Color color={ value } />
                            <Title>{ name }</Title>
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
    onToggle: PropTypes.func
};

export default Legend;
