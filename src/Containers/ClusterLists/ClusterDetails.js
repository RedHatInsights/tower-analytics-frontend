import { DescriptionList } from '@patternfly/react-core/dist/dynamic/components/DescriptionList';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import PropTypes from 'prop-types';
import React from 'react';
// import React, { useEffect } from 'react';
import styled from 'styled-components';
// import { readDeployment } from '../../Api';
// import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
// import useRequest from '../../Utilities/useRequest';
import { PageDetail } from '../../framework/PageDetails/PageDetail';

const ClusterDetails = (id) => {
  const orientation = 'vertical';
  const numberOfColumns = 'multiple';
  const disablePadding = false;
  const isCompact = false;

  // Makes an API call to the deployments endpoint with the specific id passed
  // const {
  //   result: { deployment },
  //   isSuccess: dataSuccess,
  //   error: dataError,
  //   request: fetchEndpoints,
  // } = useRequest(readDeployment, {
  //   deployment: {},
  //   rbac: {
  //     perms: {},
  //   },
  // });

  // useEffect(() => {
  //   fetchEndpoints(id.id);
  // }, [id]);

  return (
    <>
      {/* {dataError && <ApiErrorState message={dataError.error} />} */}
      {/* {dataSuccess && ( */}
      <PageSectionStyled variant='light' padding={{ default: 'noPadding' }}>
        <DescriptionList
          orientation={{
            sm: orientation,
            md: orientation,
            lg: orientation,
            xl: orientation,
            '2xl': orientation,
          }}
          columnModifier={
            numberOfColumns === 'multiple'
              ? {
                  default: '1Col',
                  sm: '1Col',
                  md: '2Col',
                  lg: '2Col',
                  xl: '3Col',
                  '2xl': '3Col',
                }
              : numberOfColumns === 'two'
              ? {
                  default: '1Col',
                  sm: '1Col',
                  md: '2Col',
                  lg: '2Col',
                  xl: '3Col',
                  '2xl': '2Col',
                }
              : undefined
          }
          style={{ maxWidth: 1200, padding: disablePadding ? undefined : 24 }}
          isCompact={isCompact}
        >
          <PageDetail label={'Id'}>{id.id}</PageDetail>
        </DescriptionList>
      </PageSectionStyled>
      {/* )} */}
    </>
  );
};

const PageSectionStyled = styled(PageSection)`
  background-color: transparent;
`;

ClusterDetails.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ClusterDetails;
