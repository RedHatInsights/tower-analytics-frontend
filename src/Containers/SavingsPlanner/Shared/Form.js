import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, Redirect } from 'react-router-dom';

import { Wizard } from '@patternfly/react-core';

import { Paths } from '../../../paths';

import useApi from '../../../Utilities/useApi';
import usePlanData from './usePlanData';

import { createPlan, updatePlan } from '../../../Api';

import Details from './Details';
import Tasks from './Tasks';
import Templates from './Templates';

const Form = ({ title, options, data = {} }) => {
  const history = useHistory();
  const { hash, pathname } = useLocation();

  const [startStep, setStartStep] = useState(null);

  const [{ isSuccess }, setData] = useApi({ meta: {}, items: [] });
  const { formData, formatPayload, dispatch } = usePlanData(data);

  const steps = [
    {
      step_number: 1,
      id: 'details',
      name: 'Details',
      component: (
        <Details options={options} formData={formData} dispatch={dispatch} />
      ),
    },
    {
      step_number: 2,
      id: 'tasks',
      name: 'Tasks',
      component: <Tasks tasks={formData.tasks} dispatch={dispatch} />,
    },
    {
      step_number: 3,
      id: 'link_template',
      name: 'Link template',
      component: (
        <Templates
          templates={options?.data?.template_id}
          template_id={formData.template_id}
          dispatch={dispatch}
        />
      ),
      nextButtonText: 'Save',
    },
  ];

  useEffect(() => {
    if (pathname.indexOf('/add') === -1 && hash) {
      setStartStep(steps.find((step) => `#${step.id}` === hash).step_number);
    } else {
      history.replace({
        hash: 'details',
      });
      setStartStep(1);
    }
  }, []);

  const onStepChange = (newStep) => {
    history.replace({
      hash: newStep.id,
    });
  };

  const onSave = () => {
    const payload = formatPayload(formData);

    data?.id
      ? setData(
          updatePlan({
            id: data?.id,
            params: payload,
          })
        )
      : setData(
          createPlan({
            params: payload,
          })
        );
  };

  const onClose = () => {
    history.push({
      pathname: Paths.savingsPlanner,
    });
  };

  return (
    <>
      {isSuccess && <Redirect to={Paths.savingsPlanner} />}
      {startStep && (
        <Wizard
          navAriaLabel={`${title} steps`}
          mainAriaLabel={`${title} content`}
          steps={steps}
          onGoToStep={onStepChange}
          onNext={onStepChange}
          onBack={onStepChange}
          onSave={onSave}
          onClose={onClose}
          startAtStep={startStep}
          height="calc(100vh - 285px)"
        />
      )}
    </>
  );
};

Form.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  data: PropTypes.object,
};

Form.defaultProps = {
  data: {},
};

export default Form;
