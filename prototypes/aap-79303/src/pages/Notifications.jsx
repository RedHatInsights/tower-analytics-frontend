import { useState, useMemo } from 'react'
import {
  PageSection,
  Label,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarFilter,
  Pagination,
} from '@patternfly/react-core'
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table'
import { PageHeader } from '../shared/PageHeader'

const mockNotifications = [
  { id: 1,  severity: 'error',   message: 'Job "Deploy Web App" failed on cluster us-east-prod',          timestamp: '2024-06-14 09:12', cluster: 'us-east-prod' },
  { id: 2,  severity: 'warning', message: 'High memory usage detected on cluster eu-central-prod',        timestamp: '2024-06-14 08:45', cluster: 'eu-central-prod' },
  { id: 3,  severity: 'notice',  message: 'Scheduled maintenance window begins in 2 hours',               timestamp: '2024-06-14 08:00', cluster: 'All' },
  { id: 4,  severity: 'error',   message: 'Job "Network Config Push" failed — unreachable hosts',         timestamp: '2024-06-13 22:17', cluster: 'ap-southeast-prod' },
  { id: 5,  severity: 'warning', message: 'SSL certificate for us-west-prod expires in 14 days',          timestamp: '2024-06-13 18:30', cluster: 'us-west-prod' },
  { id: 6,  severity: 'notice',  message: 'Ansible automation controller upgraded to 4.5.2',             timestamp: '2024-06-13 14:00', cluster: 'us-east-prod' },
  { id: 7,  severity: 'error',   message: 'Playbook "Provision Servers" timed out after 30 minutes',     timestamp: '2024-06-13 11:45', cluster: 'us-west-prod' },
  { id: 8,  severity: 'warning', message: 'Job queue depth exceeded threshold on ap-southeast-prod',     timestamp: '2024-06-12 20:30', cluster: 'ap-southeast-prod' },
  { id: 9,  severity: 'notice',  message: 'New organization "Retail Ops" added by admin',                timestamp: '2024-06-12 16:00', cluster: 'All' },
  { id: 10, severity: 'error',   message: 'Credential "AWS Prod" rotation failed — permission denied',   timestamp: '2024-06-12 09:05', cluster: 'eu-central-prod' },
]

const severityMap = {
  error:   { status: 'danger',  label: 'Danger',  order: 0 },
  warning: { status: 'warning', label: 'Warning', order: 1 },
  notice:  { status: 'info',    label: 'Info',    order: 2 },
}

const clusterOptions  = ['All clusters', 'Unassociated', 'us-east-prod', 'us-west-prod', 'eu-central-prod', 'ap-southeast-prod']
const severityOptions = ['All severities', 'Danger', 'Warning', 'Info']

// Columns: 0 = Severity, 1 = Message (not sortable), 2 = Date
const SEVERITY_COL = 0
const DATE_COL = 2

export default function Notifications() {
  const [clusterOpen,  setClusterOpen]  = useState(false)
  const [severityOpen, setSeverityOpen] = useState(false)
  const [cluster,      setCluster]      = useState('')
  const [severity,     setSeverity]     = useState('')
  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [activeSortIndex,     setActiveSortIndex]     = useState(DATE_COL)
  const [activeSortDirection, setActiveSortDirection] = useState('desc')

  const clearCluster  = () => setCluster('')
  const clearSeverity = () => setSeverity('')
  const clearAll      = () => { setCluster(''); setSeverity('') }
  const hasActive     = cluster !== '' || severity !== ''

  const onSort = (_event, index, direction) => {
    setActiveSortIndex(index)
    setActiveSortDirection(direction)
    setPage(1)
  }

  const getSortParams = (columnIndex) => ({
    sortBy: { index: activeSortIndex, direction: activeSortDirection },
    onSort,
    columnIndex,
  })

  const filtered = useMemo(() => {
    const rows = mockNotifications.filter(n => {
      const clusterMatch  = cluster  === '' || cluster === 'Unassociated' || n.cluster === cluster
      const severityMatch = severity === '' || severityMap[n.severity]?.label === severity
      return clusterMatch && severityMatch
    })
    return [...rows].sort((a, b) => {
      let cmp = 0
      if (activeSortIndex === SEVERITY_COL) {
        cmp = (severityMap[a.severity]?.order ?? 99) - (severityMap[b.severity]?.order ?? 99)
      } else if (activeSortIndex === DATE_COL) {
        cmp = a.timestamp.localeCompare(b.timestamp)
      }
      return activeSortDirection === 'asc' ? cmp : -cmp
    })
  }, [cluster, severity, activeSortIndex, activeSortDirection])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const paginationProps = {
    itemCount: filtered.length,
    page,
    perPage,
    onSetPage:       (_, p)  => setPage(p),
    onPerPageSelect: (_, pp) => { setPerPage(pp); setPage(1) },
  }

  return (
    <>
      <PageHeader title="Notifications" />
      <PageSection hasBodyWrapper={false} style={{ padding: 0 }}>
        <Toolbar inset={{ default: 'insetLg' }} clearAllFilters={hasActive ? clearAll : undefined}>
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarFilter
                labels={cluster ? [cluster] : []}
                deleteLabel={clearCluster}
                deleteLabelGroup={clearCluster}
                categoryName="Cluster"
              >
                <Select
                  isOpen={clusterOpen}
                  onSelect={(_, val) => {
                    setCluster(val === 'All clusters' ? '' : val)
                    setClusterOpen(false)
                    setPage(1)
                  }}
                  onOpenChange={setClusterOpen}
                  toggle={(ref) => (
                    <MenuToggle
                      ref={ref}
                      aria-label="Select cluster"
                      onClick={() => setClusterOpen(!clusterOpen)}
                      isExpanded={clusterOpen}
                    >
                      {cluster || 'All clusters'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {clusterOptions.map(c => (
                      <SelectOption key={c} value={c}>{c}</SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarFilter>

              <ToolbarFilter
                labels={severity ? [severity] : []}
                deleteLabel={clearSeverity}
                deleteLabelGroup={clearSeverity}
                categoryName="Severity"
              >
                <Select
                  isOpen={severityOpen}
                  onSelect={(_, val) => {
                    setSeverity(val === 'All severities' ? '' : val)
                    setSeverityOpen(false)
                    setPage(1)
                  }}
                  onOpenChange={setSeverityOpen}
                  toggle={(ref) => (
                    <MenuToggle
                      ref={ref}
                      aria-label="Select severity"
                      onClick={() => setSeverityOpen(!severityOpen)}
                      isExpanded={severityOpen}
                    >
                      {severity || 'All severities'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {severityOptions.map(s => (
                      <SelectOption key={s} value={s}>{s}</SelectOption>
                    ))}
                  </SelectList>
                </Select>
              </ToolbarFilter>
            </ToolbarGroup>

            <ToolbarItem align={{ default: 'alignEnd' }}>
              <Pagination {...paginationProps} isCompact />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        <Table aria-label="Notifications">
          <Thead>
            <Tr>
              <Th sort={getSortParams(SEVERITY_COL)} modifier="fitContent">Severity</Th>
              <Th>Message</Th>
              <Th sort={getSortParams(DATE_COL)} style={{ whiteSpace: 'nowrap' }}>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map(n => {
              const { status, label } = severityMap[n.severity] ?? { status: 'info', label: n.severity }
              return (
                <Tr key={n.id}>
                  <Td dataLabel="Severity" modifier="fitContent">
                    <Label variant="outline" status={status}>{label}</Label>
                  </Td>
                  <Td dataLabel="Message">{n.message}</Td>
                  <Td dataLabel="Date" style={{ whiteSpace: 'nowrap', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {n.timestamp}
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        <Pagination {...paginationProps} variant="bottom" />
      </PageSection>
    </>
  )
}
