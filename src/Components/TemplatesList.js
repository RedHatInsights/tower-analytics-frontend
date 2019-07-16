import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
    Badge,
    DataList,
    DataListItem as PFDataListItem,
    DataListCell
} from '@patternfly/react-core';

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 15px;
`;

const DataCellEnd = styled(DataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TemplatesList = ({ templates }) => (
    <DataList aria-label="Top Templates">
        <DataListItem aria-labelledby="top-templates-header">
            <DataListCell>
                <h3>Top Templates</h3>
            </DataListCell>
            <DataCellEnd>
                <h3>
                    <strong>Type</strong>
                </h3>
            </DataCellEnd>
        </DataListItem>
        { templates.map(({ name, type }) => (
            <DataListItem aria-labelledby="top-templates-detail" key={ name }>
                <DataListCell>
                    { /*TODO: add pop up modal for template details view*/ }
                    <span>{ name }</span>
                </DataListCell>
                <DataCellEnd>
                    <Badge isRead>{ type }</Badge>
                </DataCellEnd>
            </DataListItem>
        )) }
    </DataList>
);

TemplatesList.propTypes = {
    templates: PropTypes.array
};

export default TemplatesList;
