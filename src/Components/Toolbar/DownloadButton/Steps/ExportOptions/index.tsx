import React from 'react';
import { actions } from '../../constants';
import { Grid, GridItem, Radio, Title } from '@patternfly/react-core';
import { EmailDetailsProps, TypeValue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const ExportOptions = ({
  formData,
  dispatchReducer,
}: {
  formData: EmailDetailsProps;
  dispatchReducer: React.Dispatch<TypeValue>;
}) => {
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

export default ExportOptions;
