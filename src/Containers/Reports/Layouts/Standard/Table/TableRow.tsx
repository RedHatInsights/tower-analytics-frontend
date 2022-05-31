import React, { FunctionComponent, useState } from 'react';
import { global_disabled_color_300 } from '@patternfly/react-tokens';

import { Td, Tr } from '@patternfly/react-table';
import { formatTotalTime } from '../../../../../Utilities/helpers';

import currencyFormatter from '../../../../../Utilities/currencyFormatter';

import { LegendEntry, TableHeaders } from '../types';
import { ExpandedTableRowName, getExpandedRowComponent } from '../Components';
import paths from '../../../paths';
import { Tooltip } from '@patternfly/react-core';
import { DEFAULT_NAMESPACE, useRedirect } from '../../../../../QueryParams';
import { specificReportDefaultParams } from '../../../../../Utilities/constants';

const timeFields: string[] = ['elapsed'];
const costFields: string[] = [];

const isOther = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -1;

const isNoName = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -2;

const getText = (
  item: Record<string, string | number>,
  key: string
): string => {
  if (isNoName(item, key)) return '-';
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(+item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  return `${item[key]}`;
};

const getOthersStyle = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value,
    };
  }
  return {};
};

interface Params {
  legendEntry: LegendEntry;
  headers: TableHeaders;
  expandedRowName?: ExpandedTableRowName;
  clickableLinking?: boolean;
}

const TableRow: FunctionComponent<Params> = ({
  legendEntry,
  headers,
  expandedRowName,
  clickableLinking,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const redirect = useRedirect();

  const redirectToModuleBy = (slug: string, moduleId: any) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...specificReportDefaultParams(slug),
        task_action_id: [moduleId],
      },
    };
    redirect(paths.getDetails(slug), initialQueryParams);
  };

  const getClickableText = (
    item: Record<string, string | number>,
    key: string
  ) => {
    const countMapper: { [key: string]: string } = {
      host_task_count: 'module_usage_by_task',
      total_org_count: 'module_usage_by_organization',
      total_template_count: 'module_usage_by_job_template',
    };
    if (isNoName(item, key)) return '-';
    if (isOther(item, key)) return '-';
    if (timeFields.includes(key)) return formatTotalTime(+item[key]);
    if (costFields.includes(key)) return currencyFormatter(+item[key]);
    if (Object.keys(countMapper).includes(key) && item.id != -1) {
      return (
        <Tooltip content={`View ${item.name} usage`}>
          <a
            onClick={() => redirectToModuleBy(countMapper[key], item.id)}
          >{`${item[key]}`}</a>
        </Tooltip>
      );
    }
    return `${item[key]}`;
  };

  const renderExpandedRow = () => {
    const Component = getExpandedRowComponent(expandedRowName);

    return Component ? (
      <Component item={legendEntry} isExpanded={isExpanded} />
    ) : null;
  };

  return (
    <>
      <Tr style={getOthersStyle(legendEntry, 'id')}>
        {expandedRowName && (
          <Td
            expand={{
              rowIndex: +legendEntry.id,
              isExpanded,
              onToggle: () => setIsExpanded(!isExpanded),
            }}
          />
        )}
        {headers.map(({ key }) => (
          <Td key={`${legendEntry.id}-${key}`}>
            {clickableLinking
              ? getClickableText(legendEntry, key)
              : getText(legendEntry, key)}
          </Td>
        ))}
      </Tr>
      {renderExpandedRow()}
    </>
  );
};

export default TableRow;
