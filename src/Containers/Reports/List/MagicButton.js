import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const MagicButton = () => {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => {
        console.log('got here');
        return dispatch(
          addNotification({
            variant: 'success',
            title: 'Notification title',
            description: 'notification description',
          })
        );
      }}
    >
      Add notification
    </button>
  );
};

export default MagicButton;
