import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { Td, Tr } from '@patternfly/react-table';
import { t_global_color_disabled_300 as global_disabled_color_300 } from '@patternfly/react-tokens';
import React, { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_NAMESPACE,
  createUrl,
  useQueryParams,
} from '../../../../../QueryParams';
import { QueryParams } from '../../../../../QueryParams/types';
import { specificReportDefaultParams } from '../../../../../Utilities/constants';
import currencyFormatter from '../../../../../Utilities/currencyFormatter';
import {
  avgDurationFormatter,
  formatTotalTime,
} from '../../../../../Utilities/helpers';
import paths from '../../../paths';
import { ExpandedTableRowName, getExpandedRowComponent } from '../Components';
import { LegendEntry, TableHeaders } from '../types';

const timeFields: string[] = ['elapsed'];
const costFields: string[] = [];

const isOther = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -1;

const isNoName = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -2;

const isAvgDuration = (item: Record<string, string | number>, key: string) =>
  key === 'average_duration_per_task';

const getText = (
  item: Record<string, string | number>,
  key: string,
): string => {
  if (isNoName(item, key)) return '-';
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(+item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  if (isAvgDuration(item, key)) return avgDurationFormatter(+item[key]);
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

  const navigate = useNavigate();

  const navigateToModuleBy = (slug: string, moduleId: any) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...specificReportDefaultParams(slug),
        task_action_id: [moduleId],
      },
    };
    navigate(
      createUrl(
        'reports/' + paths.getDetails(slug).replace('/', ''),
        true,
        initialQueryParams,
      ),
    );
  };
  const navigateToTemplatesExplorer = (
    slug: string,
    org_id: any,
    queryParams: QueryParams,
  ) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...specificReportDefaultParams(slug),
        org_id: [org_id],
        template_id: queryParams.template_id,
        cluster_id: queryParams.cluster_id,
        inventory_id: queryParams.inventory_id,
        status: queryParams.status,
        limit: queryParams.limit,
        granularity: queryParams.granularity,
        quick_date_range: queryParams.quick_date_range,
      },
    };
    navigate(
      createUrl(
        'reports/' + paths.getDetails(slug).replace('/', ''),
        true,
        initialQueryParams,
      ),
    );
  };

  const getClickableText = (
    item: Record<string, string | number>,
    key: string,
  ) => {
    const { queryParams } = useQueryParams(
      specificReportDefaultParams('templates_by_organization'),
    );

    const countMapper: { [key: string]: string } = {
      host_task_count: 'module_usage_by_task',
      total_org_count: 'module_usage_by_organization',
      total_template_count: 'module_usage_by_job_template',
      total_templates_per_org: 'templates_explorer',
    };
    if (isNoName(item, key)) return '-';
    if (isOther(item, key)) return '-';
    if (timeFields.includes(key)) return formatTotalTime(+item[key]);
    if (costFields.includes(key)) return currencyFormatter(+item[key]);
    if (Object.keys(countMapper).includes(key) && item.id != -1 && item.name) {
      return (
        <Tooltip content={`View ${item.name} usage`}>
          <a
            onClick={() => navigateToModuleBy(countMapper[key], item.id)}
          >{`${item[key]}`}</a>
        </Tooltip>
      );
    }
    if (Object.keys(countMapper).includes(key) && item.org_id) {
      return (
        <Tooltip content={`View ${item.org_name} usage`}>
          <a
            onClick={() =>
              navigateToTemplatesExplorer(
                countMapper[key],
                item.org_id,
                queryParams,
              )
            }
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

  const skipRow = (key: string): boolean => {
    switch (true) {
      case key == 'total_elapsed_per_org' &&
        typeof legendEntry.total_elapsed_per_org == 'undefined':
      case key == 'total_job_count_per_org' &&
        typeof legendEntry.total_job_count_per_org == 'undefined':
      case key == 'total_host_count_per_org' &&
        typeof legendEntry.total_host_count_per_org == 'undefined':
      case key == 'total_task_count_per_org' &&
        typeof legendEntry.total_task_count_per_org == 'undefined':
        return true;
      default:
        return false;
    }
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
        {headers.map(({ key }) =>
          skipRow(key) ? null : (
            <Td key={`${legendEntry.id}-${key}`}>
              {clickableLinking
                ? getClickableText(legendEntry, key)
                : getText(legendEntry, key)}
            </Td>
          ),
        )}
      </Tr>
      {renderExpandedRow()}
    </>
  );
};

export default TableRow;
