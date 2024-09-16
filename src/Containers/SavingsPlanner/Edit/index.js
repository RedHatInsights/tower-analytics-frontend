import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { readPlanOptions } from '../../../Api/';
import { createUrl } from '../../../QueryParams/';
import useRequest from '../../../Utilities/useRequest';
import Form from '../Shared/Form';
import { paths } from '../index';

const Edit = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (isSuccess && !canWrite) navigate(createUrl(paths.getDetails(id)));
  }, [canWrite]);

  const renderContent = () => {
    if (!isSuccess) return null;
    return <Form title='Edit plan' options={options} data={data} />;
  };

  return renderContent();
};

Edit.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Edit;
