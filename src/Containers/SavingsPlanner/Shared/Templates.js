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

const TemplateRow = styled(DataListItemRow)`
  align-items: center;
`;

const Templates = ({ templates = [], templateId, setTemplateId }) => {
  return (
    <Form>
      <>
        <FormGroup
          label="Link a template to this plan."
          fieldId="template-link-field"
        >
          <DataList aria-label="draggable data list example" isCompact>
            {templates.map(({ key, value }) => (
              <DataListItem aria-labelledby={`cell-${key}`} id={key} key={key}>
                <TemplateRow>
                  <DataListControl>
                    <Radio
                      isChecked={templateId === key}
                      name={`radio-${key}`}
                      onChange={() => setTemplateId(key)}
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
  templateId: PropTypes.number.isRequired,
  setTemplateId: PropTypes.func.isRequired,
};

Templates.defaultProps = {
  templates: [],
};

export default Templates;
