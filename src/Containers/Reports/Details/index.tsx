import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import Main from '@redhat-cloud-services/frontend-components/Main';
import Error404 from '../../../Components/Error404';

import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import Breadcrumbs from '../../../Components/Breadcrumbs';
import {
  Label as PFLabel,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';

import getComponent from '../Layouts';
import paths from '../paths';
import { TAGS } from '../Shared/constants';
import { ReportSchema } from '../Layouts/types';
import useRequest from '../../../Utilities/useRequest';
import { readReport } from '../../../Api';

const Description = styled.p`
  max-width: 70em;
  padding-top: 8px;
`;

const Label = styled(PFLabel)`
  margin-top: 16px;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const Details: FunctionComponent<Record<string, never>> = () => {
  const slug = location.pathname.split('/').pop() as string;

  const {
    result: report,
    request: fetchReport,
    isSuccess,
    isLoading,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    error,
  } = useRequest(async () => {
    const response = await readReport(slug);
    return response.report as ReportSchema;
  }, {} as ReportSchema);

  useEffect(() => {
    fetchReport();
  }, [slug]);

  const breadcrumbsItems = [{ title: 'Reports', navigate: paths.get }];
  const render = () => {
    if (isSuccess) {
      const { name, description, tags } = report.layoutProps;
      return (
        <>
          <PageHeader data-cy={`header-${slug}`}>
            <Breadcrumbs items={breadcrumbsItems} />
            <PageHeaderTitle title={name} />
            <Description>{description}</Description>
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
          </PageHeader>
          <Main>{getComponent(report, true)}</Main>
        </>
      );
    } else if (isLoading) {
      return <></>;
    } else if (error) {
      return (
        <Error404
          title="404: Page does not exist."
          body="The report you are looking for does not exist."
          buttonText="Return to Reports page"
          link={paths.get}
        />
      );
    } else {
      return <></>;
    }
  };

  return render();
};

export default Details;
