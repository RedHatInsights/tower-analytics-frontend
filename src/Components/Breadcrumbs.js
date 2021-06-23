import React from 'react';
import PropTypes from 'prop-types';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbHeading,
} from '@patternfly/react-core';

import getBaseName from '../Utilities/getBaseName';

const Breadcrumbs = ({ items = [], current = null }) => {
  return (
    <Breadcrumb>
      {items.map(({ title, navigate }) => {
        const basePathNavigate = getBaseName() + navigate;
        return (
          <BreadcrumbItem key={title} to={basePathNavigate}>
            {title}
          </BreadcrumbItem>
        );
      })}
      {current && <BreadcrumbHeading>{current}</BreadcrumbHeading>}
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      navigate: PropTypes.any,
      title: PropTypes.node,
    })
  ),
  current: PropTypes.node,
};

export default Breadcrumbs;
