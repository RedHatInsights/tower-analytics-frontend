import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { readPlanOptions } from '../../../Api/';
import { paths } from '../index';

import Form from '../Shared/Form';
import useRequest from '../../../Utilities/useRequest';
import redirectWithQueryParams from '../../../QueryParams/redirectWithQueryParams';

const Edit = ({ data }) => {
  const { id } = useParams();

  const {
    result: options,
    isSuccess,
    request: fetchPlanOptions,
  } = useRequest(readPlanOptions, {
    meta: {
      rbac: {
        perms: {},
      },
    },
  });

  const canWrite =
    options.meta.rbac.perms?.write === true ||
    options.meta.rbac.perms?.all === true;

  useEffect(() => {
    fetchPlanOptions({});
  }, []);

  useEffect(() => {
    if (isSuccess && !canWrite) redirectWithQueryParams(paths.getDetails(id));
  }, [canWrite]);

  const renderContent = () => {
    if (!isSuccess) return null;
    return <Form title="Edit plan" options={options} data={data} />;
  };

  return renderContent();
};

Edit.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Edit;
