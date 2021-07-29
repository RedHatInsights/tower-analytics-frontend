import React, { useCallback, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { readPlanOptions } from '../../../Api/';
import { Paths } from '../../../paths';

import Form from '../Shared/Form';
import useRequest from '../../../Utilities/useRequest';

const Edit = ({ data }) => {
  const { id } = useParams();

  const {
    result: options,
    isSuccess,
    request: fetchPlanOptions,
  } = useRequest(
    useCallback(() => readPlanOptions(), []),
    {}
  );

  useEffect(() => {
    fetchPlanOptions();
  }, [fetchPlanOptions]);

  const canWrite =
    isSuccess &&
    (options?.meta?.rbac?.perms?.write === true ||
      options?.meta?.rbac?.perms?.all === true);

  const showEdit = () => (
    <>
      <Form title="Edit plan" options={options} data={data} />
    </>
  );

  if (isSuccess) {
    return canWrite ? (
      showEdit()
    ) : (
      <Redirect to={`${Paths.savingsPlanner}/${id}`} />
    );
  }
  return null;
};

Edit.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Edit;
