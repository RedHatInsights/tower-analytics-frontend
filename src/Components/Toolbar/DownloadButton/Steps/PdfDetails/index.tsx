import { Radio } from '@patternfly/react-core/dist/dynamic/components/Radio';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import React from 'react';
import { EmailDetailsProps, PdfDetailsProps, TypeValue } from '../../../types';
import { actions } from '../../constants';

const PdfDetails = ({
  options,
  formData,
  dispatchReducer,
}: {
  options: PdfDetailsProps;
  formData: EmailDetailsProps;
  dispatchReducer: React.Dispatch<TypeValue>;
}) => {
  const { showExtraRows } = formData;
  const { totalPages, pageLimit } = options;

  const extraRowsLabel =
    totalPages <= Math.ceil(100 / pageLimit)
      ? `All ${totalPages.toString()} pages`
      : `Top ${Math.ceil(100 / pageLimit)} of ${totalPages.toString()} pages`;

  return (
    <>
      <Title size='md' headingLevel='h4'>
        {'Select details:'}
      </Title>
      <Grid md={4}>
        <GridItem>
          <Radio
            onChange={() =>
              dispatchReducer({
                type: actions.SET_SHOW_EXTRA_ROWS,
                value: false,
              })
            }
            isChecked={!showExtraRows}
            name='showExtraRows'
            label='Current page'
            id='current-radio'
            aria-label='current-radio'
          />
        </GridItem>
        <GridItem>
          <Radio
            onChange={() =>
              dispatchReducer({
                type: actions.SET_SHOW_EXTRA_ROWS,
                value: true,
              })
            }
            isChecked={showExtraRows}
            name='showExtraRows'
            label={extraRowsLabel}
            id='extra-radio'
            aria-label='extra-radio'
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default PdfDetails;
