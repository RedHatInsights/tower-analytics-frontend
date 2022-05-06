import React from 'react';
import { actions } from '../../constants';
import { Grid, GridItem, Radio, Title } from '@patternfly/react-core';
import { useFeatureFlag, ValidFeatureFlags } from '../../../../../FeatureFlags';
import { EmailDetailsProps, PdfDetailsProps, TypeValue } from '../../../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
      <Title size="md" headingLevel="h4">
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
            name="showExtraRows"
            label="Current page"
            id="current-radio"
            aria-label="current-radio"
          />
        </GridItem>
        {useFeatureFlag(ValidFeatureFlags.sendEmail) && (
          <GridItem>
            <Radio
              onChange={() =>
                dispatchReducer({
                  type: actions.SET_SHOW_EXTRA_ROWS,
                  value: true,
                })
              }
              isChecked={showExtraRows}
              name="showExtraRows"
              label={extraRowsLabel}
              id="extra-radio"
              aria-label="extra-radio"
            />
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default PdfDetails;
