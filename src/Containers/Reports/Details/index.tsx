import React, { FunctionComponent, useEffect } from 'react';
import Error404 from '../../../Components/Error404';

import { PageHeader } from '@ansible/ansible-ui-framework';
import {
  Label,
  LabelGroup,
  PageSection,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';

import getComponent from '../Layouts';
import { TAGS } from '../Shared/constants';
import { ReportSchema } from '../Layouts/types';
import useRequest from '../../../Utilities/useRequest';
import { readReport } from '../../../Api';

const Details: FunctionComponent<Record<string, never>> = () => {
  const slug = location.pathname.split('/').pop() as string;

  const {
    result: report,
    request: fetchReport,
    isSuccess,
    isLoading,
    error,
  } = useRequest(async () => {
    const response = await readReport(slug);
    return response.report as ReportSchema;
  }, {} as ReportSchema);

  useEffect(() => {
    fetchReport();
  }, [slug]);

  const breadcrumbsItems = [
    { label: 'Reports', to: 'ansible/automation-analytics/reports' },
  ];

  const render = () => {
    if (isSuccess) {
      const { name, description, tags } = report.layoutProps;
      const reportTags = (
        <LabelGroup numLabels={6}>
          {tags.map((tagKey, idx) => {
            const tag = TAGS.find((t) => t.key === tagKey);
            if (tag) {
              return (
                <Tooltip
                  key={`tooltip_${idx}`}
                  position={TooltipPosition.bottom}
                  content={tag.description}
                >
                  <Label data-cy={tag.name} key={idx}>
                    {tag.name}
                  </Label>
                </Tooltip>
              );
            }
          })}
        </LabelGroup>
      );
      return (
        <div data-cy={`header-${slug}`}>
          <PageHeader
            data-cy={`header-${slug}`}
            breadcrumbs={breadcrumbsItems}
            title={name}
            description={description}
            footer={reportTags}
          />
          <PageSection>{getComponent(report, true)}</PageSection>
        </div>
      );
    } else if (isLoading) {
      return <></>;
    } else if (error) {
      return (
        <Error404
          title="404: Page does not exist."
          body="The report you are looking for does not exist."
          buttonText="Return to Reports page"
          link={'../reports'}
        />
      );
    } else {
      return <></>;
    }
  };

  return render();
};

export default Details;
