import {
  PageSection,
  Card,
  CardBody,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  Label,
} from '@patternfly/react-core'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table'
import { CurrentPageHeader } from '../../shared/CurrentPageHeader'
import { DateRangeSelect } from '../../shared/MockToolbar'

const mockJobs = [
  { id: 14821, name: 'Deploy Web App', status: 'successful', cluster: 'us-east-prod', org: 'Platform Engineering', type: 'Job' },
  { id: 14820, name: 'Patching Workflow', status: 'failed', cluster: 'us-west-prod', org: 'Security Ops', type: 'Workflow Job' },
  { id: 14819, name: 'Provision Servers', status: 'successful', cluster: 'eu-central-prod', org: 'Infrastructure', type: 'Job' },
  { id: 14818, name: 'Security Hardening', status: 'successful', cluster: 'us-east-prod', org: 'Security Ops', type: 'Job' },
  { id: 14817, name: 'Database Backup', status: 'successful', cluster: 'us-east-prod', org: 'Database Team', type: 'Job' },
  { id: 14816, name: 'Network Config Push', status: 'failed', cluster: 'ap-southeast-prod', org: 'Network Ops', type: 'Job' },
  { id: 14815, name: 'Container Deploy Workflow', status: 'successful', cluster: 'us-west-prod', org: 'Platform Engineering', type: 'Workflow Job' },
  { id: 14814, name: 'Compliance Scan', status: 'successful', cluster: 'us-east-prod', org: 'Security Ops', type: 'Job' },
  { id: 14813, name: 'Log Rotation', status: 'successful', cluster: 'eu-central-prod', org: 'Infrastructure', type: 'Job' },
  { id: 14812, name: 'User Provisioning', status: 'successful', cluster: 'us-east-prod', org: 'IT Operations', type: 'Job' },
]

function StatusLabel({ status }) {
  const color = status === 'successful' ? 'green' : status === 'failed' ? 'red' : 'blue'
  return <Label color={color}>{status}</Label>
}

export default function CurrentJobExplorer() {
  return (
    <>
      <CurrentPageHeader title="Job Explorer" />
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <DateRangeSelect />
                </ToolbarItem>
                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination
                    itemCount={243}
                    page={1}
                    perPage={10}
                    isCompact
                    onSetPage={() => {}}
                    onPerPageSelect={() => {}}
                  />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Table aria-label="Job Explorer" variant="compact">
              <Thead>
                <Tr>
                  <Th>ID / Name</Th>
                  <Th>Status</Th>
                  <Th>Cluster</Th>
                  <Th>Organization</Th>
                  <Th>Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockJobs.map((job) => (
                  <Tr key={job.id}>
                    <Td>
                      <a href="#" style={{ color: 'var(--pf-t--global--color--brand--default)' }}>
                        {job.id} - {job.name}
                      </a>
                    </Td>
                    <Td><StatusLabel status={job.status} /></Td>
                    <Td>{job.cluster}</Td>
                    <Td>{job.org}</Td>
                    <Td>{job.type}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Pagination
              itemCount={243}
              page={1}
              perPage={10}
              variant="bottom"
              onSetPage={() => {}}
              onPerPageSelect={() => {}}
              style={{ marginTop: '16px' }}
            />
          </CardBody>
        </Card>
      </PageSection>
    </>
  )
}
