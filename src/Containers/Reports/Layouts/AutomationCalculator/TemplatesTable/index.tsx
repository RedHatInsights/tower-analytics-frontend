import { Dropdown } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownItem } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import EllipsisVIcon from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import {
  Table,
  TableVariant,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import React, { FunctionComponent, useState } from 'react';
import { useQueryParams } from '../../../../../QueryParams';
import { reportDefaultParams } from '../../../../../Utilities/constants';
import { TableSortParams } from '../../Standard/types';
import Row from './Row';
import { Template } from './types';

interface Props {
  data: Template[];
  variableRow: { key: string; value: string };
  setDataRunTime: (delta: number, id: number) => void;
  setEnabled: (id: number | undefined) => (enabled: boolean) => void;
  navigateToJobExplorer: (id: number) => void;
  getSortParams?: () => TableSortParams;
  readOnly: boolean;
  isMoney: boolean;
}

const TopTemplates: FunctionComponent<Props> = ({
  data = [],
  variableRow,
  setDataRunTime = () => ({}),
  setEnabled = () => () => ({}),
  navigateToJobExplorer = () => ({}),
  getSortParams = () => ({}),
  readOnly = true,
  isMoney,
}) => {
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const defaultParams = reportDefaultParams('automation_calculator');
  const { setFromToolbar } = useQueryParams(defaultParams);

  const kebabDropdownItems = [
    <DropdownItem
      key='showAll'
      component='button'
      onClick={() => setEnabled(undefined)(true)}
    >
      Show all
    </DropdownItem>,
    <DropdownItem
      key='hideAll'
      component='button'
      onClick={() => setEnabled(undefined)(false)}
    >
      Hide all
    </DropdownItem>,
    <DropdownItem
      key='showAll'
      component='button'
      onClick={() => setFromToolbar('template_weigh_in', undefined)}
    >
      Display all template rows
    </DropdownItem>,
    <DropdownItem
      key='hideHiddenTemplates'
      component='button'
      onClick={() => setFromToolbar('template_weigh_in', true)}
    >
      Display only shown template rows
    </DropdownItem>,
    <DropdownItem
      key='showHiddenTemplates'
      component='button'
      onClick={() => setFromToolbar('template_weigh_in', false)}
    >
      Display only hidden template rows
    </DropdownItem>,
  ];
  return (
    <Table
      data-cy={'table'}
      aria-label='ROI Table'
      variant={TableVariant.compact}
    >
      <Thead>
        <Tr>
          <Th />
          <Th>Name</Th>
          {variableRow && (
            <Th {...getSortParams()} tooltip={null}>
              {variableRow.value}
            </Th>
          )}
          <Th>Manual time</Th>
          <Th>Savings</Th>
          <Th
            style={{
              float: 'right',
              overflow: 'visible',
              zIndex: 1,
            }}
          >
            <Dropdown
              onSelect={() => {
                setIsKebabOpen(false);
              }}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  variant='plain'
                  style={{ paddingBottom: '0px' }}
                  id='table-kebab'
                  onClick={() => setIsKebabOpen(!isKebabOpen)}
                  isExpanded={isKebabOpen}
                  aria-label='Table actions'
                >
                  <EllipsisVIcon />
                </MenuToggle>
              )}
              isOpen={isKebabOpen}
              popperProps={{ position: 'right' }}
            >
              <DropdownList>{kebabDropdownItems}</DropdownList>
            </Dropdown>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((template) => (
          <Row
            key={template.id}
            template={template}
            variableRow={variableRow}
            setDataRunTime={setDataRunTime}
            navigateToJobExplorer={navigateToJobExplorer}
            setEnabled={setEnabled(template.id)}
            readOnly={readOnly}
            isMoney={isMoney}
          />
        ))}
      </Tbody>
    </Table>
  );
};

export default TopTemplates;
