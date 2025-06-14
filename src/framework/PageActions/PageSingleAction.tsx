import {
  Button,
  ButtonVariant,
} from '@patternfly/react-core/dist/dynamic/components/Button';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import React, { ComponentClass, Fragment, FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { IPageSingleAction } from './PageAction';

export function PageSingleAction<T extends object>(props: {
  action: IPageSingleAction<T>;
  selectedItem?: T;
  iconOnly?: boolean;
  wrapper?: ComponentClass | FunctionComponent;
}) {
  const { action, selectedItem, wrapper } = props;
  const Wrapper = wrapper ?? Fragment;
  const Icon = action.icon;
  let tooltip =
    (action.tooltip ?? props.iconOnly) ? props.action.label : undefined;
  const isDisabled =
    action.isDisabled !== undefined && selectedItem
      ? action.isDisabled(selectedItem)
      : false;
  tooltip = isDisabled ? isDisabled : tooltip;

  let variant = action.variant ?? ButtonVariant.secondary;
  if (variant === ButtonVariant.primary && action.isDanger) {
    variant = ButtonVariant.danger;
  }
  if (props.iconOnly) {
    variant = ButtonVariant.plain;
  }
  return (
    <Wrapper>
      <Tooltip content={tooltip} trigger={tooltip ? undefined : 'manual'}>
        <Button
          id={props.action.label.toLowerCase().split(' ').join('-')}
          variant={variant}
          icon={
            Icon ? (
              <span style={{ marginLeft: -4, paddingRight: 4 }}>
                <Icon />
              </span>
            ) : undefined
          }
          isAriaDisabled={Boolean(isDisabled)}
          onClick={
            action.onClick
              ? () => selectedItem && action.onClick(selectedItem)
              : undefined
          }
          component={
            action.href
              ? (props) => (
                  <Link
                    {...props}
                    to={selectedItem && action.href(selectedItem)}
                  />
                )
              : undefined
          }
          isDanger={action.isDanger}
        >
          {props.iconOnly && Icon ? (
            <Icon />
          ) : action.shortLabel ? (
            action.shortLabel
          ) : (
            action.label
          )}
        </Button>
      </Tooltip>
    </Wrapper>
  );
}
