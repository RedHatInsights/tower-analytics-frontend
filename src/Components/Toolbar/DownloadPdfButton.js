import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
  ButtonVariant,
  Spinner,
} from '@patternfly/react-core';
import { DownloadIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

import useRequest from '../../Utilities/useRequest';
import { useCallback } from 'react';
import { generatePdf } from '../../Api';

const DownloadPdfButton = ({ slug, data, y, label, xTickFormat }) => {
  const { error, isLoading, request } = useRequest(
    useCallback((data) =>
      generatePdf({
        slug,
        data,
        y,
        label,
        x_tick_format: xTickFormat,
      })
    ),
    null
  );
  const getPdfButtonText = (error) => error || 'Download PDF version of report';
  return (
    <>
      <Button
        variant={error ? ButtonVariant.link : ButtonVariant.plain}
        aria-label={getPdfButtonText(error)}
        onClick={() => request(data)}
        isDanger={error}
      >
        {/* TooltipVariant.top */}
        <Tooltip position="top" content={<div>{getPdfButtonText(error)}</div>}>
          {isLoading && <Spinner isSVG size="md" />}
          {error && <ExclamationCircleIcon />}
          {!isLoading && !error && <DownloadIcon />}
        </Tooltip>
      </Button>
    </>
  );
};

DownloadPdfButton.propTypes = {
  slug: PropTypes.func,
  data: PropTypes.object,
  y: PropTypes.object,
  label: PropTypes.object,
  xTickFormat: PropTypes.object,
};

export default DownloadPdfButton;
