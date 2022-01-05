import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, Redirect } from 'react-router-dom';

import {
  Button,
  ButtonVariant,
  Wizard,
  WizardFooter,
  WizardContextConsumer,
} from '@patternfly/react-core';

import { paths } from '../../index';
import useRequest from '../../../../Utilities/useRequest';
import usePlanData from '../usePlanData';

import { createPlan, updatePlan } from '../../../../Api/';

import AlertModal from '../../../../Components/AlertModal/AlertModal';
import ErrorDetail from '../../../../Components/ErrorDetail/ErrorDetail';

import Details from './Steps/Details';
import Tasks from './Steps/Tasks';
import Templates from './Steps/Templates';

const Form = ({ title, options, data = {} }) => {
  const history = useHistory();
  const { hash, pathname } = useLocation();
  const [startStep, setStartStep] = useState(null);

  const {
    result: apiResponse,
    isSuccess,
    error,
    request: setData,
  } = useRequest(
    async (requestPayload, id) => {
      if (requestPayload) {
        if (id) {
          return await updatePlan(id, requestPayload);
        } else {
          // Put the id inside the plan_created to match the update endpoint
          const { id, plan_created } = await createPlan(requestPayload);
          return {
            plan_created: {
              id,
              ...plan_created,
            },
          };
        }
      }

      return { plan_created: { id: 0 } };
    },
    {
      plan_created: {
        id: 0, // put zero to match the type
      },
    }
  );

  const { formData, requestPayload, dispatch } = usePlanData(data);
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
      canJumpTo: !!formData.name,
    },
    {
      step_number: 3,
      id: 'link_template',
      name: 'Link template',
      component: (
        <Templates template_id={formData.template_id} dispatch={dispatch} />
      ),
      canJumpTo: !!formData.name,
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
    setData(requestPayload, data?.id);
  };

  const onClose = () => {
    if (location.pathname.indexOf('/edit') !== -1) {
      history.push(paths.getDetails(data?.id));
    } else {
      history.push(paths.get);
    }
  };

  const reset = () => {
    setData();
  };

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack, onClose }) => {
          if (activeStep.step_number !== 3) {
            return (
              <>
                <Button
                  variant={ButtonVariant.primary}
                  type="submit"
                  onClick={onNext}
                  isDisabled={!formData.name}
                >
                  Next
                </Button>
                {activeStep.step_number !== 1 && (
                  <Button variant="secondary" onClick={onBack}>
                    Back
                  </Button>
                )}
                <Button variant="link" onClick={onClose}>
                  Cancel
                </Button>
              </>
            );
          }
          // Final step buttons
          return (
            <>
              <Button
                variant={ButtonVariant.primary}
                type="submit"
                onClick={onSave}
                isDisabled={!formData.name}
              >
                Save
              </Button>
              <Button variant="secondary" onClick={onBack}>
                Back
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

  return (
    <>
      {isSuccess && (
        <Redirect
          to={{
            pathname: paths.getDetails(apiResponse.plan_created.id),
            state: { reload: true },
          }}
        />
      )}
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
          footer={CustomFooter}
          startAtStep={startStep}
          height="calc(100vh - 240px)"
        />
      )}
      {error && (
        <AlertModal
          isOpen={!!error}
          onClose={() => reset()}
          title={'Error'}
          variant="error"
        >
          {'There was an error saving the plan.'}
          <ErrorDetail error={error?.error?.detail.name} />
        </AlertModal>
      )}
    </>
  );
};

Form.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  data: PropTypes.object,
};

export default Form;
