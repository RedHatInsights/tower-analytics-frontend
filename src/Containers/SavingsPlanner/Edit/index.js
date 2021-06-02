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

  const title = 'Edit plan';

  return (
    <>
      {options.isSuccess && (
        <Form title={title} options={options} data={data} />
      )}
    </>
  );
};

Edit.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Edit;
