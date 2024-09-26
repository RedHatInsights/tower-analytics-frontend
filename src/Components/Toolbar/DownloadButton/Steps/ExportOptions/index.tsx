import { Radio } from '@patternfly/react-core/dist/dynamic/components/Radio';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import React from 'react';
import { ValidFeatureFlags, useFeatureFlag } from '../../../../../FeatureFlags';
import { EmailDetailsProps, TypeValue } from '../../../types';
import { actions } from '../../constants';

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
      <Title size='md' headingLevel='h4'>
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
            name='optionSelected'
            label='PDF'
            id='pdf-radio'
            aria-label='pdf-radio'
          />
        </GridItem>
        {useFeatureFlag(ValidFeatureFlags.sendEmail) && (
          <GridItem>
            <Radio
              onChange={() =>
                dispatchReducer({
                  type: actions.SET_DOWNLOAD_TYPE,
                  value: 'email',
                })
              }
              isChecked={downloadType === 'email'}
              name='optionSelected'
              label='E-mail'
              id='email-radio'
              aria-label='email-radio'
            />
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default ExportOptions;
