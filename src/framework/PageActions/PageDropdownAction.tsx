import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import CircleIcon from '@patternfly/react-icons/dist/dynamic/icons/circle-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import React, {
  ComponentClass,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { IPageAction } from './PageAction';
import { PageActionType } from './PageActionType';
import { isHiddenAction } from './PageActions';

// DropdownPosition for backward compatibility
export const DropdownPosition = {
  right: 'right',
  left: 'left',
} as const;

export function PageDropdownAction<T extends object>(props: {
  actions: IPageAction<T>[];
  label?: string;
  icon?: ComponentClass | FunctionComponent;
  isDisabled?: boolean;
  tooltip?: string;
  selectedItems?: T[];
  selectedItem?: T;
  position?: (typeof DropdownPosition)[keyof typeof DropdownPosition];
  iconOnly?: boolean;
  onOpen?: (open: boolean) => void;
}) {
  const {
    label,
    icon,
    selectedItems,
    selectedItem,
    iconOnly,
    isDisabled,
    tooltip,
  } = props;

  let { actions } = props;
  actions = actions.filter((action) => !isHiddenAction(action, selectedItem));
  actions = filterActionSeperators(actions);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasBulkActions = useMemo(
    () => !actions.every((action) => action.type !== PageActionType.bulk),
    [actions],
  );
  const hasIcons = useMemo(
    () =>
      actions.find(
        (action) =>
          action.type !== PageActionType.seperator && action.icon !== undefined,
      ) !== undefined,
    [actions],
  );
  useEffect(() => {
    props.onOpen?.(dropdownOpen);
  }, [dropdownOpen, props]);
  if (actions.length === 0) return <></>;
  const Icon = icon;
  const toggleIcon = Icon ? <Icon /> : label;
  const isPrimary = hasBulkActions && !!selectedItems?.length;

  const toggle = (toggleRef: React.Ref<any>) =>
    label || Icon ? (
      <MenuToggle
        ref={toggleRef}
        id='toggle-dropdown'
        isDisabled={isDisabled}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        isExpanded={dropdownOpen}
        variant={isPrimary ? 'primary' : 'default'}
        style={
          isPrimary && !label
            ? { color: 'var(--pf-t--global--text--color--inverse)' }
            : {}
        }
      >
        {toggleIcon}
      </MenuToggle>
    ) : (
      <MenuToggle
        ref={toggleRef}
        id='toggle-kebab'
        variant='plain'
        isDisabled={isDisabled}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        isExpanded={dropdownOpen}
        style={
          isPrimary && !label
            ? { color: 'var(--pf-t--global--text--color--inverse)' }
            : {}
        }
      >
        <EllipsisVIcon />
      </MenuToggle>
    );

  const dropdown = (
    <Dropdown
      onSelect={() => setDropdownOpen(false)}
      toggle={toggle}
      isOpen={dropdownOpen}
      popperProps={{
        position: props.position === DropdownPosition.right ? 'right' : 'left',
      }}
      style={{ zIndex: dropdownOpen ? 201 : undefined }}
    >
      <DropdownList>
        {actions.map((action, index) => (
          <PageDropdownActionItem
            key={'label' in action ? action.label : `action-${index}`}
            action={action}
            selectedItems={selectedItems ?? []}
            selectedItem={selectedItem}
            hasIcons={hasIcons}
            index={index}
          />
        ))}
      </DropdownList>
    </Dropdown>
  );
  return tooltip && (iconOnly || isDisabled) ? (
    <Tooltip content={tooltip} trigger={tooltip ? undefined : 'manual'}>
      {dropdown}
    </Tooltip>
  ) : (
    { ...dropdown }
  );
}

function PageDropdownActionItem<T extends object>(props: {
  action: IPageAction<T>;
  selectedItems: T[];
  selectedItem?: T;
  hasIcons: boolean;
  index: number;
}): React.ReactElement {
  const { action, selectedItems, selectedItem, hasIcons, index } = props;

  switch (action.type) {
    case PageActionType.single:
    case PageActionType.singleLink: {
      let Icon: ComponentClass | FunctionComponent | undefined = action.icon;
      if (!Icon && hasIcons) Icon = TransparentIcon;
      let tooltip = action.tooltip;
      const isDisabled =
        action.isDisabled !== undefined && selectedItem
          ? action.isDisabled(selectedItem)
          : false;
      tooltip = isDisabled ? isDisabled : tooltip;
      return (
        <Tooltip
          key={action.label}
          content={tooltip}
          trigger={tooltip ? undefined : 'manual'}
        >
          <DropdownItem
            onClick={
              action.onClick
                ? () => selectedItem && action.onClick(selectedItem)
                : undefined
            }
            component={
              action.href && selectedItem
                ? (((props: any) => (
                    <Link
                      {...props}
                      to={selectedItem ? action.href(selectedItem) : ''}
                    />
                  )) as any)
                : undefined
            }
            isAriaDisabled={Boolean(isDisabled)}
            icon={
              Icon ? (
                <span style={{ paddingRight: 4 }}>
                  <Icon />
                </span>
              ) : undefined
            }
            style={{
              color:
                action.isDanger && !isDisabled
                  ? 'var(--pf-t--global--color--status--danger--default)'
                  : undefined,
            }}
          >
            {action.label}
          </DropdownItem>
        </Tooltip>
      );
    }

    case PageActionType.button:
    case PageActionType.bulk: {
      let Icon: ComponentClass | FunctionComponent | undefined = action.icon;
      if (!Icon && hasIcons) Icon = TransparentIcon;
      let tooltip = action.tooltip;
      let isDisabled = false;
      if (action.type === PageActionType.bulk && !selectedItems.length) {
        tooltip = 'No selections';
        isDisabled = true;
      }
      return (
        <Tooltip
          key={action.label}
          content={tooltip}
          trigger={tooltip ? undefined : 'manual'}
        >
          <DropdownItem
            onClick={
              action.onClick ? () => action.onClick(selectedItems) : undefined
            }
            component={
              !action.onClick
                ? (((props: any) => (
                    <Link {...props} to={action.href} />
                  )) as any)
                : undefined
            }
            isAriaDisabled={isDisabled}
            icon={
              Icon ? (
                <span style={{ paddingRight: 4 }}>
                  <Icon />
                </span>
              ) : undefined
            }
            style={{
              color:
                action.isDanger && !isDisabled
                  ? 'var(--pf-t--global--color--status--danger--default)'
                  : undefined,
            }}
          >
            {action.label}
          </DropdownItem>
        </Tooltip>
      );
    }
    case PageActionType.dropdown: {
      let tooltip = action.label;
      const isDisabled =
        action.isDisabled !== undefined && selectedItem
          ? action.isDisabled(selectedItem)
          : '';
      tooltip = isDisabled ? isDisabled : tooltip;
      return (
        <PageDropdownAction<T>
          key={action.label}
          label={action.label}
          actions={action.options}
          selectedItem={selectedItem}
          isDisabled={Boolean(isDisabled)}
          tooltip={tooltip}
        />
      );
    }
    case PageActionType.seperator:
      return <Divider key={`separator-${index}`} />;
  }
}

const TransparentIcon = () => <CircleIcon style={{ opacity: 0 }} />;

function filterActionSeperators<T extends object>(actions: IPageAction<T>[]) {
  const filteredActions = [...actions];

  // Remove seperators at beginning of actions
  while (
    filteredActions.length > 0 &&
    filteredActions[0].type === PageActionType.seperator
  ) {
    filteredActions.shift();
  }

  // Remove seperators at end of actions
  while (
    filteredActions.length > 0 &&
    filteredActions[filteredActions.length - 1].type ===
      PageActionType.seperator
  ) {
    filteredActions.pop();
  }

  // TODO remove two seperators in a row

  return filteredActions;
}
