/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { actions } from '../../constants';
import { Grid, GridItem, Radio, Title } from '@patternfly/react-core';

const ExportOptions = ({ formData, dispatchReducer }) => {
  const { downloadType } = formData;

  return (
    <>
      <Title size="md" headingLevel="h4">
        {'Select export format:'}
      </Title>
      <Grid sm={2}>
        <GridItem>
          <Radio
            onChange={() =>
              dispatchReducer({
                type: actions.SET_DOWNLOAD_TYPE,
                value: 'pdf',
              })
            }
            isChecked={downloadType === 'pdf'}
            name="optionSelected"
            label="PDF"
            id="pdf-radio"
            aria-label="pdf-radio"
          />
        </GridItem>
        <GridItem>
          <Radio
            onChange={() =>
              dispatchReducer({
                type: actions.SET_DOWNLOAD_TYPE,
                value: 'email',
              })
            }
            isChecked={downloadType === 'email'}
            name="optionSelected"
            label="E-mail"
            id="email-radio"
            aria-label="email-radio"
          />
        </GridItem>
      </Grid>
    </>
  );
};

ExportOptions.propTypes = {
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
export default ExportOptions;
