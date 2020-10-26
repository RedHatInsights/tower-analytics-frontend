import React from 'react';
import PropTypes from 'prop-types';
import { Main } from '@redhat-cloud-services/frontend-components';
import {
    Card,
    CardBody,
    CardTitle,
    Title
} from '@patternfly/react-core';

const floatToStringWithCommas = (total) =>
    total
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const TotalSavings = ({ totalSavings = 0 }) => (
    <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
        <Card style={ { borderTop: '3px solid #2B9AF3' } }>
            <CardTitle style={ { paddingBottom: '0' } }>
                Total savings
            </CardTitle>
            <CardBody>
                <Title
                    headingLevel="h3"
                    size="4xl"
                    style={ { color: 'var(--pf-global--success-color--200)' } }
                >
                    { floatToStringWithCommas(totalSavings) }
                </Title>
            </CardBody>
        </Card>
    </Main>
);

TotalSavings.propTypes = {
    totalSavings: PropTypes.number
};

export default TotalSavings;
