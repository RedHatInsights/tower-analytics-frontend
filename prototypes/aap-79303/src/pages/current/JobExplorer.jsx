import { useState, useMemo } from 'react'
import {
  PageSection,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarFilter,
  Button,
  Checkbox,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  TextInput,
  Pagination,
  Label,
} from '@patternfly/react-core'
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import SortAmountDownIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-down-icon'
import SortAmountUpIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-up-icon'
import { PageHeader } from '../../shared/PageHeader'
import { DateRangeSelect } from '../../shared/MockToolbar'

const mockJobs = [
  { id: 14821, name: 'Deploy Web App',           status: 'successful', cluster: 'us-east-prod',      org: 'Platform Engineering', type: 'Job',          created: '2026-07-09T14:22:00Z' },
  { id: 14820, name: 'Patching Workflow',         status: 'failed',     cluster: 'us-west-prod',      org: 'Security Ops',         type: 'Workflow Job', created: '2026-07-09T13:11:00Z' },
  { id: 14819, name: 'Provision Servers',         status: 'successful', cluster: 'eu-central-prod',   org: 'Infrastructure',       type: 'Job',          created: '2026-07-09T12:45:00Z' },
  { id: 14818, name: 'Security Hardening',        status: 'successful', cluster: 'us-east-prod',      org: 'Security Ops',         type: 'Job',          created: '2026-07-09T10:30:00Z' },
  { id: 14817, name: 'Database Backup',           status: 'successful', cluster: 'us-east-prod',      org: 'Database Team',        type: 'Job',          created: '2026-07-08T23:00:00Z' },
  { id: 14816, name: 'Network Config Push',       status: 'failed',     cluster: 'ap-southeast-prod', org: 'Network Ops',          type: 'Job',          created: '2026-07-08T20:15:00Z' },
  { id: 14815, name: 'Container Deploy Workflow', status: 'successful', cluster: 'us-west-prod',      org: 'Platform Engineering', type: 'Workflow Job', created: '2026-07-08T18:05:00Z' },
  { id: 14814, name: 'Compliance Scan',           status: 'successful', cluster: 'us-east-prod',      org: 'Security Ops',         type: 'Job',          created: '2026-07-08T15:40:00Z' },
  { id: 14813, name: 'Log Rotation',              status: 'successful', cluster: 'eu-central-prod',   org: 'Infrastructure',       type: 'Job',          created: '2026-07-08T09:20:00Z' },
  { id: 14812, name: 'User Provisioning',         status: 'successful', cluster: 'us-east-prod',      org: 'IT Operations',        type: 'Job',          created: '2026-07-07T22:00:00Z' },
]

const statusMap = {
  successful: 'success',
  failed:     'danger',
  running:    'info',
  canceled:   'warning',
  error:      'danger',
}

const categories    = ['Keyword', 'Status', 'Job type']
const statusOptions = ['Successful', 'Failed', 'Error', 'Running', 'Pending', 'Canceled']
const jobTypeOpts   = ['Job', 'Workflow Job', 'Inventory update', 'Project update', 'System job']

// Column indices for sorting
const COL_ID     = 0
const COL_STATUS = 1
const COL_TYPE   = 4

const statusOrder = { successful: 0, running: 1, pending: 2, failed: 3, error: 3, canceled: 4 }

export default function JobExplorer() {
  // Variant toggle
  const [variant, setVariant] = useState('basic')
  const [query,   setQuery]   = useState('')

  // Attribute-value filter
  const [category,     setCategory]     = useState('Keyword')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [statusOpen,   setStatusOpen]   = useState(false)
  const [jobTypeOpen,  setJobTypeOpen]  = useState(false)

  const [filters, setFilters] = useState({ Keyword: '', Status: '', 'Job type': '' })
  const setFilter   = (cat, val) => { setFilters(f => ({ ...f, [cat]: val })); setPage(1) }
  const clearFilter = (cat)     => { setFilters(f => ({ ...f, [cat]: '' }));   setPage(1) }
  const clearAll    = ()        => { setFilters({ Keyword: '', Status: '', 'Job type': '' }); setPage(1) }
  const hasActive   = Object.values(filters).some(v => v !== '')

  // Settings
  const [ignoreNested, setIgnoreNested] = useState(false)

  // Sort — toolbar-level (matches prod SortByGroup)
  const sortFields = ['Created', 'ID', 'Status', 'Type']
  const [sortField,    setSortField]    = useState('Created')
  const [sortFieldOpen,setSortFieldOpen]= useState(false)
  const [sortDir,      setSortDir]      = useState('desc')

  // Column header sort params (mirrors toolbar sort)
  const colSortKey = { [COL_ID]: 'ID', [COL_STATUS]: 'Status', [COL_TYPE]: 'Type' }
  const sortIndex = sortField === 'ID' ? COL_ID : sortField === 'Status' ? COL_STATUS : sortField === 'Type' ? COL_TYPE : null

  const onColSort = (_, idx, dir) => {
    setSortField(colSortKey[idx] ?? 'Created')
    setSortDir(dir)
  }

  const getSortParams = (colIdx) => ({
    sortBy: { index: sortIndex, direction: sortDir },
    onSort: onColSort,
    columnIndex: colIdx,
  })

  // Pagination
  const [page,    setPage]    = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    let rows = mockJobs.filter(job => {
      const kw = filters.Keyword.toLowerCase()
      if (kw && !job.name.toLowerCase().includes(kw)) return false
      if (filters.Status   && job.status.toLowerCase() !== filters.Status.toLowerCase())   return false
      if (filters['Job type'] && job.type.toLowerCase() !== filters['Job type'].toLowerCase()) return false
      if (ignoreNested && job.type === 'Workflow Job') return false
      return true
    })

    rows = [...rows].sort((a, b) => {
      let cmp = 0
      if (sortField === 'Created') cmp = new Date(a.created) - new Date(b.created)
      if (sortField === 'ID')      cmp = a.id - b.id
      if (sortField === 'Status')  cmp = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
      if (sortField === 'Type')    cmp = a.type.localeCompare(b.type)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return rows
  }, [filters, ignoreNested, sortField, sortDir])

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
      <PageHeader title="Job Explorer" />
      <Toolbar inset={{ default: 'insetLg' }} clearAllFilters={hasActive ? clearAll : undefined}>
        <ToolbarContent>
          {/* Variant toggle */}
          <ToolbarItem>
            <Button
              variant="control"
              aria-label={variant === 'basic' ? 'Switch to advanced filter' : 'Switch to basic filter'}
              onClick={() => { setVariant(v => v === 'basic' ? 'advanced' : 'basic'); setQuery('') }}
              icon={variant === 'basic' ? <FilterIcon /> : <CodeIcon />}
            />
          </ToolbarItem>

          {variant === 'basic' && (
            <ToolbarGroup variant="filter-group">
              {/* Category selector */}
              <ToolbarItem>
                <Select
                  isOpen={categoryOpen}
                  onSelect={(_, val) => { setCategory(val); setCategoryOpen(false) }}
                  onOpenChange={setCategoryOpen}
                  toggle={(ref) => (
                    <MenuToggle
                      ref={ref}
                      icon={<FilterIcon />}
                      onClick={() => setCategoryOpen(!categoryOpen)}
                      isExpanded={categoryOpen}
                      aria-label="Select filter attribute"
                    >
                      {category}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {categories.map(c => <SelectOption key={c} value={c}>{c}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarItem>

              {/* Keyword */}
              <ToolbarFilter
                labels={filters.Keyword ? [filters.Keyword] : []}
                deleteLabel={() => clearFilter('Keyword')}
                deleteLabelGroup={() => clearFilter('Keyword')}
                categoryName="Keyword"
                showToolbarItem={category === 'Keyword'}
              >
                <SearchInput
                  aria-label="Keyword filter"
                  placeholder="Keyword"
                  value={filters.Keyword}
                  onChange={(_, v) => setFilter('Keyword', v)}
                  onClear={() => clearFilter('Keyword')}
                  style={{ minWidth: '220px' }}
                />
              </ToolbarFilter>

              {/* Status */}
              <ToolbarFilter
                labels={filters.Status ? [filters.Status] : []}
                deleteLabel={() => clearFilter('Status')}
                deleteLabelGroup={() => clearFilter('Status')}
                categoryName="Status"
                showToolbarItem={category === 'Status'}
              >
                <Select
                  isOpen={statusOpen}
                  onSelect={(_, val) => { setFilter('Status', val); setStatusOpen(false) }}
                  onOpenChange={setStatusOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setStatusOpen(!statusOpen)} isExpanded={statusOpen} aria-label="Select status">
                      {filters.Status || 'Any status'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {statusOptions.map(s => <SelectOption key={s} value={s}>{s}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarFilter>

              {/* Job type */}
              <ToolbarFilter
                labels={filters['Job type'] ? [filters['Job type']] : []}
                deleteLabel={() => clearFilter('Job type')}
                deleteLabelGroup={() => clearFilter('Job type')}
                categoryName="Job type"
                showToolbarItem={category === 'Job type'}
              >
                <Select
                  isOpen={jobTypeOpen}
                  onSelect={(_, val) => { setFilter('Job type', val); setJobTypeOpen(false) }}
                  onOpenChange={setJobTypeOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setJobTypeOpen(!jobTypeOpen)} isExpanded={jobTypeOpen} aria-label="Select job type">
                      {filters['Job type'] || 'Any job type'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {jobTypeOpts.map(t => <SelectOption key={t} value={t}>{t}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarFilter>

              <ToolbarItem><DateRangeSelect /></ToolbarItem>
            </ToolbarGroup>
          )}

          {variant === 'advanced' && (
            <ToolbarItem style={{ flex: 1 }}>
              <TextInput
                value={query}
                onChange={(_, v) => setQuery(v)}
                placeholder='status = "successful" AND job_type = "job"'
                aria-label="Advanced filter query"
                style={{ width: '100%' }}
              />
            </ToolbarItem>
          )}

          {/* Sort by field + direction */}
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <Select
                isOpen={sortFieldOpen}
                selected={sortField}
                onSelect={(_, val) => { setSortField(val); setSortFieldOpen(false) }}
                onOpenChange={(isOpen) => setSortFieldOpen(isOpen)}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setSortFieldOpen(!sortFieldOpen)} isExpanded={sortFieldOpen} style={{ width: '130px' }}>
                    {sortField}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {sortFields.map((f) => (
                    <SelectOption key={f} value={f}>{f}</SelectOption>
                  ))}
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="control"
                aria-label={sortDir === 'asc' ? 'Sort descending' : 'Sort ascending'}
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              >
                {sortDir === 'asc' ? <SortAmountUpIcon /> : <SortAmountDownIcon />}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>

          {/* Ignore nested checkbox */}
          <ToolbarItem style={{ alignSelf: 'center' }}>
            <Checkbox
              id="ignore-nested"
              label="Ignore nested jobs"
              isChecked={ignoreNested}
              onChange={(_, v) => setIgnoreNested(v)}
            />
          </ToolbarItem>

          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination {...paginationProps} isCompact />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <PageSection hasBodyWrapper={false} style={{ paddingTop: 0 }}>
        <Table aria-label="Job Explorer">
          <Thead>
            <Tr>
              <Th sort={getSortParams(COL_ID)}>ID / Name</Th>
              <Th sort={getSortParams(COL_STATUS)}>Status</Th>
              <Th>Cluster</Th>
              <Th>Organization</Th>
              <Th sort={getSortParams(COL_TYPE)}>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((job) => (
              <Tr key={job.id}>
                <Td dataLabel="ID / Name">
                  <Button variant="link" isInline>{job.id} - {job.name}</Button>
                </Td>
                <Td dataLabel="Status">
                  <Label variant="outline" status={statusMap[job.status] ?? 'info'}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Label>
                </Td>
                <Td dataLabel="Cluster">{job.cluster}</Td>
                <Td dataLabel="Organization">{job.org}</Td>
                <Td dataLabel="Type">{job.type}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination {...paginationProps} variant="bottom" />
      </PageSection>
    </>
  )
}
