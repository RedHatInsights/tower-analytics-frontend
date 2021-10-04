import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Tooltip,
  ButtonVariant,
  Spinner,
  TooltipPosition,
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
      <Tooltip
        position={TooltipPosition.top}
        content={<div>{getPdfButtonText(error)}</div>}
      >
        <Button
          variant={error ? ButtonVariant.link : ButtonVariant.plain}
          aria-label={getPdfButtonText(error)}
          onClick={() => request(data)}
          isDanger={error}
        >
          {isLoading && <Spinner isSVG size="md" />}
          {error && <ExclamationCircleIcon />}
          {!isLoading && !error && <DownloadIcon />}
        </Button>
      </Tooltip>
    </>
  );
};

DownloadPdfButton.propTypes = {
  slug: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  y: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  xTickFormat: PropTypes.string.isRequired,
};

export default DownloadPdfButton;
