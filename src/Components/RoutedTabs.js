import React from 'react';
import PropTypes from 'prop-types';
import { shape, string, number, arrayOf, node, oneOfType } from 'prop-types';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { useHistory, useLocation } from 'react-router-dom';

const RoutedTabs = ({ tabsArray, defaultTabId }) => {
  const history = useHistory();
  const location = useLocation();

  const getActiveTabId = (defaultTabId) => {
    return (
      tabsArray.find((tab) => tab.link === location.pathname)?.id ||
      defaultTabId
    );
  };

  const handleTabSelect = (_, eventKey) => {
    const match = tabsArray.find((tab) => tab.id === eventKey);
    if (match) {
      history.push(match.link);
    }
  };

  return (
    <Tabs activeKey={getActiveTabId(defaultTabId)} onSelect={handleTabSelect}>
      {tabsArray.map((tab) => (
        <Tab
          aria-label={typeof tab.name === 'string' ? tab.name : `${tab.id} tab`}
          eventKey={tab.id}
          key={tab.id}
          link={tab.link}
          title={<TabTitleText>{tab.name}</TabTitleText>}
          role="tab"
        />
      ))}
    </Tabs>
  );
};

RoutedTabs.propTypes = {
  defaultTabId: PropTypes.number,
  tabsArray: arrayOf(
    shape({
      id: number.isRequired,
      link: string.isRequired,
      name: oneOfType([string.isRequired, node.isRequired]),
    })
  ).isRequired,
};

RoutedTabs.defaultProps = {
  defaultTabId: 1,
};

export default RoutedTabs;
