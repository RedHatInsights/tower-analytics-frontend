import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, Redirect } from 'react-router-dom';

import { Wizard } from '@patternfly/react-core';

import { Paths } from '../../../paths';

import useApi from '../../../Utilities/useApi';

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

  const [name, setName] = useState('');
  const [category, setCategory] = useState('system');
  const [description, setDescription] = useState('');
  const [manualTime, setManualTime] = useState(240);
  const [hosts, setHosts] = useState(1);
  const [frequencyPeriod, setFrequencyPeriod] = useState('weekly');
  const [tasks, setTasks] = useState([]);
  const [templateId, setTemplateId] = useState(-2);

  const onStepChange = (newStep) => {
    history.replace({
      hash: newStep.id,
    });
  };

  const onSave = () => {
    setData(
      createPlan({
        params: {
          name,
          category,
          description,
          manual_time: manualTime,
          hosts,
          frequency_period: frequencyPeriod,
          tasks: tasks.map((task, index) => ({
            task,
            task_order: index + 1,
          })),
          template_id: templateId,
          hourly_rate: 50,
          frequency_per_period: 1,
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
        <Details
          options={options}
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          description={description}
          setDescription={setDescription}
          manualTime={manualTime}
          setManualTime={setManualTime}
          hosts={hosts}
          setHosts={setHosts}
          frequencyPeriod={frequencyPeriod}
          setFrequencyPeriod={setFrequencyPeriod}
        />
      ),
    },
    {
      step_number: 2,
      id: 'tasks',
      name: 'Tasks',
      component: <Tasks tasks={tasks} setTasks={setTasks} />,
    },
    {
      step_number: 3,
      id: 'link_template',
      name: 'Link template',
      component: (
        <Templates
          templates={options?.data?.template_id}
          templateId={templateId}
          setTemplateId={setTemplateId}
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
