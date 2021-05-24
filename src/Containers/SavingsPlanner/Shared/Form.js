import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, Redirect } from 'react-router-dom';

import { Wizard } from '@patternfly/react-core';

import { Paths } from '../../../paths';

import useApi from '../../../Utilities/useApi';
import useForm from '../../../Utilities/useForm';

import { createPlan } from '../../../Api';

import Details from './Details';
import Tasks from './Tasks';
import Templates from './Templates';

const Form = ({ title, options }) => {
  const history = useHistory();
  const { hash } = useLocation();

  const [startStep, setStartStep] = useState(null);

  useEffect(() => {
    if (hash) {
      setStartStep(steps.find((step) => `#${step.id}` === hash).step_number);
    } else {
      history.replace({
        hash: 'details',
      });
      setStartStep(1);
    }
  }, []);

  const [{ isSuccess }, setData] = useApi({ meta: {}, items: [] });
  const { formData, setField } = useForm({
    name: '',
    category: 'system',
    description: '',
    manual_time: 240,
    hosts: 1,
    frequency_period: 'weekly',
    tasks: [],
    template_id: -2,
  });

  const onStepChange = (newStep) => {
    history.replace({
      hash: newStep.id,
    });
  };

  const onSave = () => {
    if (formData.template_id === -2) {
      delete formData.template_id;
    }

    formData.tasks = formData.tasks.map((task, index) => ({
      task,
      task_order: index + 1,
    }));

    setData(
      createPlan({
        params: {
          hourly_rate: 50,
          frequency_per_period: 1,
          ...formData,
        },
      })
    );
  };

  const steps = [
    {
      step_number: 1,
      id: 'details',
      name: 'Details',
      component: (
        <Details options={options} formData={formData} setField={setField} />
      ),
    },
    {
      step_number: 2,
      id: 'tasks',
      name: 'Tasks',
      component: <Tasks tasks={formData.tasks} setField={setField} />,
    },
    {
      step_number: 3,
      id: 'link_template',
      name: 'Link template',
      component: (
        <Templates
          templates={options?.data?.template_id}
          template_id={formData.template_id}
          setField={setField}
        />
      ),
      nextButtonText: 'Save',
    },
  ];

  return (
    <>
      {isSuccess && <Redirect to={Paths.savingsPlanner} />}
      <Wizard
        navAriaLabel={`${title} steps`}
        mainAriaLabel={`${title} content`}
        steps={steps}
        onGoToStep={onStepChange}
        onNext={onStepChange}
        onBack={onStepChange}
        onSave={onSave}
        startAtStep={startStep}
        height="calc(100vh - 285px)"
      />
    </>
  );
};

Form.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
};

export default Form;
