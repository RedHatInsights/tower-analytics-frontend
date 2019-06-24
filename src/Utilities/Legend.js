import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Switch as PFSwitch } from '@patternfly/react-core';

import styled from 'styled-components';

const Container = styled.div`
  flex-basis: 20%;
  /* border: 1px solid black; */
  /* overflow: auto; */
`;

const LegendDetail = styled.div`
  display: flex;
  padding: 5px 10px;
  /* border: 1px solid red; */
  justify-content: center;
  align-items: center;
`;

const Color = styled.div.attrs(props => ({
    color: props.color || 'black'
}))`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: ${props => props.color};
`;

const Title = styled.span`
  font-size: 12px;
  display: inline-block;
  margin: 0 30px 0 10px;
`;

const Switch = styled(PFSwitch)`
  --pf-c-switch--Height: 20px;

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
        this.handleChange = isChecked => {
            this.setState({ isChecked });
        };
    }

    render() {
        const { data } = this.props;
        const { isChecked } = this.state;
        return (
            <Container>
                { data.map(
                    ({ name, value }) => (
                        <LegendDetail key={ name }>
                            <Switch
                                isChecked={ isChecked }
                                onChange={ this.handleChange }
                                aria-label={ name }
                            />
                            <Title>{ name }</Title>
                            <Color color={ value } />
                        </LegendDetail>
                    )) }
            </Container>
        );
    }
}

Legend.propTypes = {
    data: PropTypes.array
};

export default Legend;
