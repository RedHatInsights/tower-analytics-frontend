import React, { FunctionComponent, useState } from 'react';

import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';
import {
  TableComposable,
  TableVariant,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { Template } from './types';
import Row from './Row';
import { TableSortParams } from '../../Standard/types';
import { useQueryParams } from '../../../../../QueryParams';
import { reportDefaultParams } from '../../../../../Utilities/constants';

interface Props {
  data: Template[];
  variableRow: { key: string; value: string };
  setDataRunTime: (delta: number, id: number) => void;
  setEnabled: (id: number | undefined) => (enabled: boolean) => void;
  redirectToJobExplorer: (id: number) => void;
  getSortParams?: () => TableSortParams;
  readOnly: boolean;
}

const TopTemplates: FunctionComponent<Props> = ({
  data = [],
  variableRow,
  setDataRunTime = () => ({}),
  setEnabled = () => () => ({}),
  redirectToJobExplorer = () => ({}),
  getSortParams = () => ({}),
  readOnly = true,
}) => {
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const defaultParams = reportDefaultParams('automation_calculator');
  const { setFromToolbar } = useQueryParams(defaultParams);

  const kebabDropdownItems = [
    <DropdownItem
      key="showAll"
      component="button"
      onClick={() => setEnabled(undefined)(true)}
    >
      Show all
    </DropdownItem>,
    <DropdownItem
      key="hideAll"
      component="button"
      onClick={() => setEnabled(undefined)(false)}
    >
      Hide all
    </DropdownItem>,
    <DropdownItem
      key="showAll"
      component="button"
      onClick={() => setFromToolbar('template_weigh_in', undefined)}
    >
      Display all template rows
    </DropdownItem>,
    <DropdownItem
      key="hideHiddenTemplates"
      component="button"
      onClick={() => setFromToolbar('template_weigh_in', true)}
    >
      Display only shown template rows
    </DropdownItem>,
    <DropdownItem
      key="showHiddenTemplates"
      component="button"
      onClick={() => setFromToolbar('template_weigh_in', false)}
    >
      Display only hidden template rows
    </DropdownItem>,
  ];

  return (
    <TableComposable aria-label="ROI Table" variant={TableVariant.compact}>
      <Thead>
        <Tr>
          <Th />
          <Th>Name</Th>
          {variableRow && <Th {...getSortParams()}>{variableRow.value}</Th>}
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
                setIsKebabOpen(true);
              }}
              toggle={
                <KebabToggle
                  style={{ paddingBottom: '0px' }}
                  id="table-kebab"
                  onToggle={() => setIsKebabOpen(!isKebabOpen)}
                />
              }
              isOpen={isKebabOpen}
              isPlain
              dropdownItems={kebabDropdownItems}
              position={'right'}
            />
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
            redirectToJobExplorer={redirectToJobExplorer}
            setEnabled={setEnabled(template.id)}
            readOnly={readOnly}
          />
        ))}
      </Tbody>
    </TableComposable>
  );
};

export default TopTemplates;
