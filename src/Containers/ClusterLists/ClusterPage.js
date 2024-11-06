import { Tab } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { TabTitleText } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { Tabs } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { CaretLeftIcon } from '@patternfly/react-icons';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { PageHeader } from '../../framework/PageHeader';
import ClusterDetails from './ClusterDetails';

const ClusterPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [activeTabKey, setActiveTabKey] = React.useState(1);
  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };
  return (
    <div>
      <PageHeader data-cy={'cluster-details'} title={'Cluster Name'} />
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox={true}>
        <Tab
          eventKey={0}
          title={
            <TabTitleText>
              <CaretLeftIcon />
              <span style={{ marginLeft: 6 }}>{'Back to Clusters List'}</span>
            </TabTitleText>
          }
          href={location.pathname.slice(0, location.pathname.lastIndexOf('/'))}
        />
        <Tab
          eventKey={1}
          title={<TabTitleText>Details</TabTitleText>}
          aria-label='Default content - users'
        >
          <ClusterDetails id={id} />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Resources</TabTitleText>}>
          {'Resources'}
        </Tab>
      </Tabs>
    </div>
  );
};

export default ClusterPage;
