import { Tab } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { TabTitleText } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { Tabs } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import React from 'react';
import { PageHeader } from '../../framework/PageHeader';
import ClustersList from './ClustersList';

const ClusterListsPage = () => {
  const [activeTabKey, setActiveTabKey] = React.useState(0);
  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };
  return (
    <div data-cy={'header-cluster-lists'}>
      <PageHeader
        data-cy={'cluster-lists'}
        title={'Cluster List'}
        description={'Description goes here'}
      />
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={true}>
        <Tab
          eventKey={0}
          title={<TabTitleText>Active Clusters</TabTitleText>}
          aria-label='Default content - users'
        >
          <ClustersList activeClusters={true} />
        </Tab>
        <Tab
          eventKey={1}
          title={<TabTitleText>Archived Clusters</TabTitleText>}
        >
          <ClustersList activeClusters={false} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ClusterListsPage;
