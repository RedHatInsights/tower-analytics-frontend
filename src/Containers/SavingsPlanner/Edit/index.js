import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import useApi from '../../../Utilities/useApi';

import { readPlanOptions } from '../../../Api';

import Form from '../Shared/Form';

const Edit = ({ data }) => {
  const [options, setOptions] = useApi({});

  useEffect(() => {
    setOptions(readPlanOptions());
  }, []);

  const canWrite = (options.isSuccess && (options.data.meta.rbac.perms.write === true || options.data.meta.rbac.perms.all === true));

  const showEdit = () => (
    <>
      <Form title="Edit plan" options={options} data={data} />
    </>
  )

  if (options.isSuccess) {
    return canWrite ? showEdit() : <Redirect to={Paths.savingsPlanner} />;
  }
  return null;
};

Edit.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Edit;
