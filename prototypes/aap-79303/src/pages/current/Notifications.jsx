import {
  PageSection,
  Card,
  CardBody,
  FormSelect,
  FormSelectOption,
  Pagination,
  Flex,
  FlexItem,
  Label,
  Divider,
} from '@patternfly/react-core'
import { useState } from 'react'
import { CurrentPageHeader } from '../../shared/CurrentPageHeader'

const mockNotifications = [
  { id: 1, severity: 'error', message: 'Job "Deploy Web App" failed on cluster us-east-prod', timestamp: '2024-06-14 09:12:33', cluster: 'us-east-prod' },
  { id: 2, severity: 'warning', message: 'High memory usage detected on cluster eu-central-prod', timestamp: '2024-06-14 08:45:01', cluster: 'eu-central-prod' },
  { id: 3, severity: 'notice', message: 'Scheduled maintenance window begins in 2 hours', timestamp: '2024-06-14 08:00:00', cluster: 'All' },
  { id: 4, severity: 'error', message: 'Job "Network Config Push" failed — unreachable hosts', timestamp: '2024-06-13 22:17:45', cluster: 'ap-southeast-prod' },
  { id: 5, severity: 'warning', message: 'SSL certificate for us-west-prod expires in 14 days', timestamp: '2024-06-13 18:30:22', cluster: 'us-west-prod' },
]

const severityColors = { error: 'red', warning: 'orange', notice: 'blue' }
const notificationOptions = [
  { value: 'please choose', label: 'Select Notification Severity', disabled: true },
  { value: 'error', label: 'View Critical' },
  { value: 'warning', label: 'View Warning' },
  { value: 'notice', label: 'View Notice' },
  { value: '', label: 'View All' },
]
const clusterOptions = [
  { value: 'please choose', label: 'Select cluster', disabled: true },
  { value: '', label: 'All Clusters' },
  { value: '-1', label: 'Unassociated' },
  { value: '1', label: 'us-east-prod' },
  { value: '2', label: 'us-west-prod' },
  { value: '3', label: 'eu-central-prod' },
  { value: '4', label: 'ap-southeast-prod' },
]

export default function CurrentNotifications() {
  const [severity, setSeverity] = useState('')
  const [cluster, setCluster] = useState('')

  const filtered = mockNotifications.filter(n =>
    (severity === '' || n.severity === severity) &&
    (cluster === '' || cluster === '-1' || n.cluster === clusterOptions.find(c => c.value === cluster)?.label)
  )

  return (
    <>
      <CurrentPageHeader title="Notifications" />
      <PageSection hasBodyWrapper={false}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', flexWrap: 'wrap', gap: '12px' }}>
            <Flex direction={{ default: 'row' }} gap={{ default: 'gapMd' }}>
              <FlexItem>
                <FormSelect
                  value={cluster}
                  onChange={(_, v) => setCluster(v)}
                  aria-label="Select Cluster"
                  style={{ minWidth: '180px' }}
                >
                  {clusterOptions.map(({ value, label, disabled }) => (
                    <FormSelectOption key={value} isDisabled={disabled} value={value} label={label} />
                  ))}
                </FormSelect>
              </FlexItem>
              <FlexItem>
                <FormSelect
                  value={severity}
                  onChange={(_, v) => setSeverity(v)}
                  aria-label="Select Notification Type"
                  style={{ minWidth: '200px' }}
                >
                  {notificationOptions.map(({ value, label, disabled }) => (
                    <FormSelectOption key={value} isDisabled={disabled} value={value} label={label} />
                  ))}
                </FormSelect>
              </FlexItem>
            </Flex>
            <Pagination
              itemCount={filtered.length}
              page={1}
              perPage={5}
              isCompact
              onSetPage={() => {}}
              onPerPageSelect={() => {}}
            />
          </div>
          <CardBody style={{ padding: 0 }}>
            {filtered.map((n, i) => (
              <div key={n.id}>
                {i > 0 && <Divider />}
                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <Label color={severityColors[n.severity]} style={{ flexShrink: 0 }}>{n.severity}</Label>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{n.message}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6a6e73' }}>{n.timestamp} · {n.cluster}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </PageSection>
    </>
  )
}
