import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import HelpIcon from '@patternfly/react-icons/dist/dynamic/icons/help-icon';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const PopoverButton = styled.button`
  padding: var(--pf-global--spacer--xs);
  margin: -(var(--pf-global--spacer--xs));
  font-size: var(--pf-global--FontSize--sm);
  --pf-c-form__group-label-help--Color: var(--pf-global--Color--200);
  --pf-c-form__group-label-help--hover--Color: var(--pf-global--Color--100);
`;

function StandardPopover(props: { content: ReactNode; header: ReactNode }) {
  const { content, header } = props;

  if (!content) {
    return null;
  }

  return (
    <Popover bodyContent={content} headerContent={header} hideOnOutsideClick>
      <PopoverButton
        aria-label='More information'
        aria-haspopup='true'
        className='pf-v6-c-form__group-label-help'
        onClick={(e) => e.preventDefault()}
        type='button'
      >
        <HelpIcon />
      </PopoverButton>
    </Popover>
  );
}

export { StandardPopover };
