import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Button,
  ButtonVariant,
  Card,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Gallery,
  Label,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import {
  AngleLeftIcon,
  AngleRightIcon,
  CaretDownIcon,
} from '@patternfly/react-icons';

import paths from '../paths';
import ListItem from './ListItem';
import { getAllReports } from '../Shared/schemas';
import { TAGS } from '../Shared/constants';
import getComponent from '../Layouts/index';

const List: FunctionComponent<Record<string, never>> = () => {
  const [selected, setSelected] = useState('hosts_changed_by_job_template');
  const [isOpen, setIsOpen] = useState(false);
  let index = 0;
  let nextItem = '';
  let previousItem = '';

  const dropdownItems = [
    getAllReports().map((report) => (
      <Button
        key={report.layoutProps.slug}
        variant={ButtonVariant.plain}
        aria-label="Report list item"
        onClick={() => setSelected(report.layoutProps.slug)}
      >
        <DropdownItem key={report.layoutProps.slug}>
          {report.layoutProps.name}
        </DropdownItem>
      </Button>
    )),
  ];

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Reports'} />
      </PageHeader>
      <Main>
        {getAllReports()
          .filter((report) => report.layoutProps.slug === selected)
          .map(
            (report) => (
              (index = getAllReports().indexOf(report)),
              getAllReports().indexOf(report) < getAllReports().length - 1 &&
                (nextItem = getAllReports()[index + 1].layoutProps.slug),
              getAllReports().indexOf(report) > 0 &&
                (previousItem = getAllReports()[index - 1].layoutProps.slug),
              (
                <>
                  <Card key="all_reports" isLarge style={{ maxWidth: '100%' }}>
                    <CardHeader>
                      <CardTitle>All Reports</CardTitle>
                      <CardActions>
                        <Button
                          variant={ButtonVariant.plain}
                          aria-label="Previous report"
                          isDisabled={getAllReports().indexOf(report) === 0}
                          onClick={() => setSelected(previousItem)}
                        >
                          <AngleLeftIcon />
                        </Button>
                        <Dropdown
                          isPlain
                          onSelect={() => {
                            setIsOpen(!isOpen);
                          }}
                          toggle={
                            <DropdownToggle
                              onToggle={(next) => setIsOpen(next)}
                              toggleIndicator={CaretDownIcon}
                              id="report_list"
                              style={{ color: '#151515' }}
                            >
                              {report.layoutProps.name}
                            </DropdownToggle>
                          }
                          isOpen={isOpen}
                          dropdownItems={dropdownItems}
                        />
                        <Button
                          variant={ButtonVariant.plain}
                          aria-label="Next report"
                          isDisabled={
                            getAllReports().indexOf(report) >=
                            getAllReports().length - 1
                          }
                          onClick={() => setSelected(nextItem)}
                        >
                          <AngleRightIcon />
                        </Button>
                      </CardActions>
                    </CardHeader>
                  </Card>
                  <Card
                    key={report.layoutProps.slug}
                    style={{ maxWidth: '100%', marginBottom: '25px' }}
                  >
                    <CardHeader>
                      <CardTitle>
                        <Link to={paths.getDetails(report.layoutProps.slug)}>
                          {report.layoutProps.name}
                        </Link>
                      </CardTitle>
                      <CardActions>
                        {report.layoutProps.tags.map((tagKey, idx) => {
                          const tag = TAGS.find((t) => t.key === tagKey);
                          if (tag) {
                            return (
                              <Tooltip
                                key={`tooltip_${idx}`}
                                position={TooltipPosition.top}
                                content={tag.description}
                              >
                                <Label key={idx}>{tag.name}</Label>
                              </Tooltip>
                            );
                          }
                        })}
                      </CardActions>
                    </CardHeader>

                    <CardBody>{report.layoutProps.description}</CardBody>
                    <CardBody>{getComponent(report, false)}</CardBody>
                    <CardFooter>
                      <Link
                        to={paths.getDetails(report.layoutProps.slug)}
                        style={{ float: 'right' }}
                      >
                        View full report
                      </Link>
                    </CardFooter>
                  </Card>
                </>
              )
            )
          )}
        <Gallery
          data-testid="all_reports"
          hasGutter
          minWidths={{
            sm: '307px',
            md: '307px',
            lg: '307px',
            xl: '307px',
            '2xl': '307px',
          }}
        >
          {getAllReports().map((report) => (
            <ListItem
              key={report.layoutProps.slug}
              report={report}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </Gallery>
      </Main>
    </>
  );
};

export default List;
