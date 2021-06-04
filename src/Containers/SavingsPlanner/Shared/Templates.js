import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  DataList,
  DataListItem,
  DataListCell,
  DataListItemRow,
  DataListControl,
  DataListItemCells,
  Form,
  FormGroup,
  Radio,
} from '@patternfly/react-core';

import { actions } from './constants';

const TemplateRow = styled(DataListItemRow)`
  align-items: center;
`;

const Templates = ({ templates = [], template_id, dispatch }) => {
  return (
    <Form>
      <>
        <FormGroup
          label="Link a template to this plan:"
          fieldId="template-link-field"
        >
          <DataList aria-label="draggable data list example" isCompact>
            {templates.map(({ key, value }) => (
              <DataListItem aria-labelledby={`cell-${key}`} id={key} key={key}>
                <TemplateRow>
                  <DataListControl>
                    <Radio
                      isChecked={template_id === key}
                      name={`radio-${key}`}
                      onChange={() =>
                        dispatch({ type: actions.SET_TEMPLATE_ID, value: key })
                      }
                      aria-label={`Radio selector for template ${key}.`}
                      id={`radio-${key}`}
                      value={key}
                    />
                  </DataListControl>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key={key}>
                        <span id={`cell-${key}`}>{value}</span>
                      </DataListCell>,
                    ]}
                  />
                </TemplateRow>
              </DataListItem>
            ))}
          </DataList>
        </FormGroup>
      </>
    </Form>
  );
};

Templates.propTypes = {
  templates: PropTypes.array,
  template_id: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

Templates.defaultProps = {
  templates: [],
};

export default Templates;
