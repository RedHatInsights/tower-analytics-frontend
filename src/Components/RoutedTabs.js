import { TabTitleText } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { Tab } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { Tabs } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import PropTypes from 'prop-types';
import { arrayOf, node, number, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RoutedTabs = ({ tabsArray, defaultTabId = 1 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTabId = (defaultTabId) => {
    return (
      tabsArray.find(
        (tab) =>
          typeof tab.name === 'string' &&
          location.pathname.includes(tab.link.toLowerCase().replace('..', ''))
      )?.id || defaultTabId
    );
  };

  const handleTabSelect = (_, eventKey) => {
    const match = tabsArray.find((tab) => tab.id === eventKey);
    if (match) {
      navigate(match.link);
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
          role='tab'
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

export default RoutedTabs;
