/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import PropTypes from 'prop-types';
import { actions } from '../../constants';
import { Grid, GridItem, Radio, Title } from '@patternfly/react-core';
import { useFeatureFlag, ValidFeatureFlags } from '../../../../../FeatureFlags';

const PdfDetails = ({ options, formData, dispatchReducer }) => {
  const { showExtraRows } = formData;
  const { totalCount } = options;

  const extraRowsLabel =
    totalCount <= 100
      ? `Download all ${totalCount} items as PDF`
      : `Download top 100 of ${totalCount} items as PDF`;

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
PdfDetails.propTypes = {
  options: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  dispatchReducer: PropTypes.func.isRequired,
};
export default PdfDetails;
