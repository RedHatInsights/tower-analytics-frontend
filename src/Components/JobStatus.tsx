import { Label } from '@patternfly/react-core/dist/dynamic/components/Label';
import CheckCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/check-circle-icon';
import ClockIcon from '@patternfly/react-icons/dist/dynamic/icons/clock-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-triangle-icon';
import SyncAltIcon from '@patternfly/react-icons/dist/dynamic/icons/sync-alt-icon';
import React, { FunctionComponent } from 'react';
import { capitalize } from '../Utilities/helpers';

interface Props {
  status:
    | 'successful'
    | 'failed'
    | 'running'
    | 'pending'
    | 'error'
    | 'canceled'
    | 'new'
    | 'waiting';
}

const JobStatus: FunctionComponent<Props> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'successful':
        return 'green';
      case 'failed':
      case 'error':
        return 'red';
      case 'running':
      case 'pending':
        return 'blue';
      case 'canceled':
        return 'orange';
      // case new, waiting
      default:
        return 'grey';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'successful':
        return <CheckCircleIcon />;
      case 'failed':
      case 'error':
        return <ExclamationCircleIcon />;
      case 'running':
        return <SyncAltIcon />;
      case 'canceled':
        return <ExclamationTriangleIcon />;
      // case new, waiting, pending
      default:
        return <ClockIcon />;
    }
  };

  return (
    <Label
      variant='outline'
      color={getColor()}
      icon={getIcon()}
      style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
    >
      {capitalize(status)}
    </Label>
  );
};

export default JobStatus;
