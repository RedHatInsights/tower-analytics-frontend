import {
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from '@patternfly/react-core/deprecated';
import { ButtonVariant } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { createPlan, updatePlan } from '../../../../Api/';
import AlertModal from '../../../../Components/AlertModal/AlertModal';
import ErrorDetail from '../../../../Components/ErrorDetail/ErrorDetail';
import useRequest from '../../../../Utilities/useRequest';
import usePlanData from '../usePlanData';
import Details from './Steps/Details';
import Tasks from './Steps/Tasks';
import Templates from './Steps/Templates';

const Form = ({ title, options, data = {} }) => {
  const navigate = useNavigate();
  const { hash } = useLocation();
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
    },
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
    if (hash) {
      setStartStep(steps.find((step) => `#${step.id}` === hash).step_number);
    } else {
      window.history.pushState(
        null,
        null,
        window.location.pathname + '#details',
      );
      setStartStep(1);
    }
  }, []);

  const onStepChange = (newStep) => {
    window.history.pushState(
      null,
      null,
      window.location.pathname + `#${newStep.id}`,
    );
  };

  const onSave = () => {
    setData(requestPayload, data?.id);
  };

  const onClose = () => {
    if (location.pathname.indexOf('/edit') !== -1) {
      navigate('../savings-planner/' + data?.id);
    } else {
      navigate('../savings-planner');
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
                  type='submit'
                  onClick={onNext}
                  isDisabled={!formData.name}
                >
                  Next
                </Button>
                {activeStep.step_number !== 1 && (
                  <Button variant='secondary' onClick={onBack}>
                    Back
                  </Button>
                )}
                <Button variant='link' onClick={onClose}>
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
                type='submit'
                onClick={onSave}
                isDisabled={!formData.name}
              >
                Save
              </Button>
              <Button variant='secondary' onClick={onBack}>
                Back
              </Button>
              <Button variant='link' onClick={onClose}>
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
        <Navigate to={'../savings-planner/' + apiResponse.plan_created.id} />
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
          height='calc(100vh - 240px)'
        />
      )}
      {error && (
        <AlertModal
          isOpen={!!error}
          onClose={() => reset()}
          title={'Error'}
          variant='error'
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
