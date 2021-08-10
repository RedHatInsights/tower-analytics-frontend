import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbHeading,
} from '@patternfly/react-core';

const Breadcrumbs = ({ items = [], current = null }) => {
  return (
    <Breadcrumb>
      {items.map(({ title, navigate }) => {
        return (
          <BreadcrumbItem key={title}>
            <Link to={navigate}>{title}</Link>
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
