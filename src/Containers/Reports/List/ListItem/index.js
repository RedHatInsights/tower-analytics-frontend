import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  Button,
  ButtonVariant,
  Card,
  CardHeader,
  CardHeaderMain,
  CardTitle as PFCardTitle,
  CardBody,
  CardFooter,
  Label as PFLabel,
  Spinner,
  Tooltip,
} from '@patternfly/react-core';

import paths from '../../paths';

import { DownloadIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

import useRequest from '../../../../Utilities/useRequest';
import { useCallback } from 'react';
import { generatePdf } from '../../../../Api';

// import DownloadPdfButton from '../../../Components/Toolbar/DownloadPdfButton';

const CardTitle = styled(PFCardTitle)`
  word-break: break-word;
`;

const Small = styled.small`
  display: block;
  margin-bottom: 10px;
  color: #6a6e73;
  white-space: pre-line;
`;

const Label = styled(PFLabel)`
  margin-right: 10px;
`;

const TooltipButton = styled(Button)`
  float: right;
`;

const ListItem = ({ report: { slug, description, name, categories } }) => (
  <Card>
    <CardHeader>
      <CardHeaderMain>
        <CardTitle>
          <Link to={paths.getDetails(slug)}>{name}</Link>
        </CardTitle>
      </CardHeaderMain>
    </CardHeader>
    <CardBody>{description ? <Small>{description}</Small> : null}</CardBody>
    <CardFooter>
      {categories.map((category, idx) => (
        <Label key={idx}>{category}</Label>
      ))}
      <TooltipButton
        const
        DownloadPdfButton={({ slug, data, y, label, xTickFormat }) => {
          const { error, isLoading, request } = useRequest(
            useCallback(
              (data) =>
                generatePdf({
                  slug,
                  data,
                  y,
                  label,
                  x_tick_format: xTickFormat,
                }),
              []
            ),
            null
          );
          return (
            <>
              <Button
                variant={ButtonVariant.plain}
                aria-label="Download"
                onClick={() => request(data)}
              >
                <Tooltip position="top" content={<div>Export report</div>}>
                  {isLoading && <Spinner isSVG size="md" />}
                  {error && <ExclamationCircleIcon />}
                  {!isLoading && !error && <DownloadIcon />}
                </Tooltip>
              </Button>
            </>
          );
        }}
      ></TooltipButton>
    </CardFooter>
  </Card>
);

ListItem.propTypes = {
  report: PropTypes.object,
  slug: PropTypes.func,
  data: PropTypes.object,
  y: PropTypes.object,
  label: PropTypes.object,
  xTickFormat: PropTypes.object,
};

export default ListItem;
