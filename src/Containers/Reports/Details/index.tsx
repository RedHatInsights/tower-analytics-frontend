import React, { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
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
import { getReport } from '../Shared/schemas';
import paths from '../paths';
import { TAGS } from '../Shared/constants';

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
  const { slug } = useParams<{ slug: string }>();
  const report = getReport(slug);

  const breadcrumbsItems = [{ title: 'Reports', navigate: paths.get }];

  const render = () => {
    if (report) {
      const { name, description, tags } = report.layoutProps;
      return (
        <>
          <PageHeader>
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
                    <Label key={idx}>{tag.name}</Label>
                  </Tooltip>
                );
              }
            })}
          </PageHeader>
          <Main>{getComponent(report)}</Main>
        </>
      );
    } else
      return (
        <Error404
          title="404: Page does not exist."
          body="The report you are looking for does not exist."
          buttonText="Return to Reports page"
          link={paths.get}
        />
      );
  };

  return render();
};

export default Details;
