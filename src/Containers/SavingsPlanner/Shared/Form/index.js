import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation, useParams, Redirect } from 'react-router-dom';

import {
  Button,
  Tooltip,
  Wizard,
  WizardFooter,
  WizardContextConsumer,
} from '@patternfly/react-core';

import { Paths } from '../../../../paths';
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
    result: { data: apiResponse },
    error,
    request: setData,
  } = useRequest(
    useCallback(async (requestPayload, id) => {
      if (typeof requestPayload !== 'undefined') {
        if (id) {
          data = await updatePlan({
            id: id,
            params: requestPayload,
          });
        } else {
          data = await createPlan({
            params: requestPayload,
          });
        }
      }
      return {
        data,
      };
    }, []),
    {
      apiResponse: data,
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
    },
    {
      step_number: 3,
      id: 'link_template',
      name: 'Link template',
      component: (
        <Templates template_id={formData.template_id} dispatch={dispatch} />
      ),
      nextButtonText: 'Save',
    },
  ];

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack, onClose }) => {
          if (activeStep.step_number !== 3) {
            return (
              <>
                <Button variant="primary" type="submit" onClick={onNext}>
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
              <Tooltip
                content={
                  !formData.name || !formData.name === ''
                    ? 'In order to save this plan, you must enter a name in the details step'
                    : 'Save this plan'
                }
                position="top"
              >
                <div>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={onSave}
                    isDisabled={!formData.name || !formData.name === ''}
                  >
                    Save
                  </Button>
                </div>
              </Tooltip>
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
      history.push({
        pathname: `${Paths.savingsPlanner}/${data?.id}`,
      });
    } else {
      history.push({
        pathname: Paths.savingsPlanner,
      });
    }
  };

  const reset = () => {
    setData();
  };

  return (
    <>
      {!error && apiResponse?.plan_created && (
        <Redirect
          to={{
            pathname: `${Paths.savingsPlanner}/${
              apiResponse.id || apiResponse.plan_created.id
            }`,
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
          <ErrorDetail error={error.detail} />
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

Form.defaultProps = {
  data: {},
};

export default Form;
