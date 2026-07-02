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

const statusMap: Record<
  Props['status'],
  {
    status: 'success' | 'danger' | 'info' | 'warning' | 'custom';
    icon: React.ReactNode;
  }
> = {
  successful: { status: 'success', icon: <CheckCircleIcon /> },
  failed:     { status: 'danger',  icon: <ExclamationCircleIcon /> },
  error:      { status: 'danger',  icon: <ExclamationCircleIcon /> },
  running:    { status: 'info',    icon: <SyncAltIcon /> },
  pending:    { status: 'info',    icon: <ClockIcon /> },
  canceled:   { status: 'warning', icon: <ExclamationTriangleIcon /> },
  new:        { status: 'custom',  icon: <ClockIcon /> },
  waiting:    { status: 'custom',  icon: <ClockIcon /> },
};

const JobStatus: FunctionComponent<Props> = ({ status }) => {
  const { status: pfStatus, icon } = statusMap[status] ?? {
    status: 'custom' as const,
    icon: <ClockIcon />,
  };

  return (
    <Label variant='outline' status={pfStatus} icon={icon}>
      {capitalize(status)}
    </Label>
  );
};

export default JobStatus;
