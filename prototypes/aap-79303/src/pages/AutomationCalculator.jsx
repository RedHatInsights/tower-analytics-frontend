import { useState, useMemo } from 'react'
import {
  PageSection,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarFilter,
  Button,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Dropdown,
  DropdownList,
  DropdownItem,
  TextInput,
  InputGroup,
  InputGroupText,
  InputGroupItem,
  Switch,
  Pagination,
  Modal,
  ModalVariant,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListDescription,
  DescriptionListGroup,
  Tooltip,
  Content,
  Title,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  List,
  ListItem,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core'
import { Table, Thead, Tbody, Tr, Th, Td, ExpandableRowContent } from '@patternfly/react-table'
import SortAmountDownIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-down-icon'
import SortAmountUpIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-up-icon'
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import { PageHeader } from '../shared/PageHeader'
import { DateRangeSelect } from '../shared/MockToolbar'

const INITIAL_TEMPLATES = [
  {
    id: 1, name: 'Deploy Web Application', type: 'Job',
    org: 'Platform Engineering', cluster: 'us-east-prod',
    elapsed: 245, successful_hosts_savings: 12480, successful_hosts_saved_hours: 832,
    host_count: 48, successful_hosts_total: 312, template_success_rate: 94.2,
    failed_hosts_costs: 1840, monetary_gain: 10640, avgRunTime: 1.5, enabled: true,
  },
  {
    id: 2, name: 'Security Hardening', type: 'Job',
    org: 'Security Ops', cluster: 'us-east-prod',
    elapsed: 380, successful_hosts_savings: 9720, successful_hosts_saved_hours: 648,
    host_count: 36, successful_hosts_total: 216, template_success_rate: 98.1,
    failed_hosts_costs: 520, monetary_gain: 9200, avgRunTime: 2.0, enabled: true,
  },
  {
    id: 3, name: 'Patching Workflow', type: 'Workflow Job',
    org: 'Infrastructure', cluster: 'eu-central-prod',
    elapsed: 520, successful_hosts_savings: 8100, successful_hosts_saved_hours: 540,
    host_count: 30, successful_hosts_total: 180, template_success_rate: 88.5,
    failed_hosts_costs: 2100, monetary_gain: 6000, avgRunTime: 3.0, enabled: true,
  },
  {
    id: 4, name: 'Container Deploy Workflow', type: 'Workflow Job',
    org: 'Platform Engineering', cluster: 'us-west-prod',
    elapsed: 310, successful_hosts_savings: 6240, successful_hosts_saved_hours: 416,
    host_count: 24, successful_hosts_total: 144, template_success_rate: 91.7,
    failed_hosts_costs: 890, monetary_gain: 5350, avgRunTime: 2.5, enabled: true,
  },
  {
    id: 5, name: 'Database Backup', type: 'Job',
    org: 'Database Team', cluster: 'us-east-prod',
    elapsed: 180, successful_hosts_savings: 4860, successful_hosts_saved_hours: 324,
    host_count: 18, successful_hosts_total: 108, template_success_rate: 99.1,
    failed_hosts_costs: 120, monetary_gain: 4740, avgRunTime: 1.0, enabled: true,
  },
  {
    id: 6, name: 'Network Config Push', type: 'Job',
    org: 'Network Ops', cluster: 'ap-southeast-prod',
    elapsed: 290, successful_hosts_savings: 3600, successful_hosts_saved_hours: 240,
    host_count: 15, successful_hosts_total: 90, template_success_rate: 86.3,
    failed_hosts_costs: 1200, monetary_gain: 2400, avgRunTime: 1.25, enabled: false,
  },
]

const formatMoney = (v) => `$${Math.round(v).toLocaleString()}`
const formatHours = (v) => `${Number(v).toFixed(1)}h`

function SavingsChart({ templates, isMoney }) {
  if (templates.length === 0) {
    return (
      <EmptyState>
        <EmptyStateBody>
          No templates are currently enabled. Toggle the Show switch on a template row to include it in the chart.
        </EmptyStateBody>
      </EmptyState>
    )
  }

  const metric  = isMoney ? 'successful_hosts_savings' : 'successful_hosts_saved_hours'
  const maxVal  = Math.max(...templates.map((t) => t[metric]), 1)
  const format  = isMoney ? formatMoney : formatHours
  const BAR_H   = 200

  return (
    <div style={{ padding: '8px 0 0' }}>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: `${BAR_H}px` }}>
        {templates.map((t) => {
          const pct = (t[metric] / maxVal) * 100
          return (
            <div key={t.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, marginBottom: '4px', color: 'var(--pf-t--global--color--status--success--default)' }}>
                {format(t[metric])}
              </div>
              <Tooltip content={t.name}>
                <div
                  style={{
                    width: '100%',
                    height: `${pct}%`,
                    minHeight: '4px',
                    backgroundColor: 'var(--pf-t--global--color--status--success--default)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.3s ease',
                    cursor: 'default',
                  }}
                />
              </Tooltip>
            </div>
          )
        })}
      </div>
      {/* X-axis labels */}
      <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--pf-t--global--border--color--100)', paddingTop: '6px' }}>
        {templates.map((t) => (
          <div
            key={t.id}
            style={{
              flex: 1, fontSize: '11px', textAlign: 'center',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              opacity: 0.7,
            }}
          >
            {t.name.length > 14 ? t.name.slice(0, 13) + '…' : t.name}
          </div>
        ))}
      </div>
    </div>
  )
}

const statusOptions    = ['Successful', 'Failed']
const orgOptions       = ['Platform Engineering', 'Security Ops', 'Infrastructure', 'Database Team', 'Network Ops']
const jobTypeOptions   = ['Job', 'Workflow Job']
const sortFields       = ['Savings', 'Hours saved', 'Name', 'Host runs']

export default function AutomationCalculator({ embedded = false }) {
  const [templates, setTemplates]           = useState(INITIAL_TEMPLATES)
  const [expandedRows, setExpandedRows]     = useState({})
  const [isMoney, setIsMoney]               = useState(true)
  const [manualCostPerHour, setManualCost]  = useState(15)
  const [automatedCostPerHour, setAutoCost] = useState(0.1)
  const [formulaOpen, setFormulaOpen]       = useState(false)
  const [tableKebabOpen, setKebabOpen]      = useState(false)
  const [displayFilter, setDisplayFilter]   = useState('all')

  // Toolbar
  const [filters, setFilters]         = useState({ Status: '', Organization: '', 'Job type': '' })
  const [statusOpen, setStatusOpen]   = useState(false)
  const [orgOpen, setOrgOpen]         = useState(false)
  const [jobTypeOpen, setJobTypeOpen] = useState(false)

  // Sort
  const [sortField, setSortField]       = useState('Savings')
  const [sortFieldOpen, setSortFOpen]   = useState(false)
  const [sortDir, setSortDir]           = useState('desc')

  // Pagination
  const [page, setPage]       = useState(1)
  const [perPage, setPerPage] = useState(6)

  const setFilter    = (key, val) => { setFilters((f) => ({ ...f, [key]: val })); setPage(1) }
  const clearFilter  = (key)      => setFilters((f) => ({ ...f, [key]: '' }))
  const clearAll     = ()         => setFilters({ Status: '', Organization: '', 'Job type': '' })
  const hasFilters   = Object.values(filters).some(Boolean)

  const toggleEnabled   = (id)      => setTemplates((ts) => ts.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t))
  const setAllEnabled   = (val)     => setTemplates((ts) => ts.map((t) => ({ ...t, enabled: val })))
  const updateManual    = (id, val) => setTemplates((ts) => ts.map((t) => t.id === id ? { ...t, avgRunTime: parseFloat(val) || 0 } : t))
  const toggleRow       = (id)      => setExpandedRows((r) => ({ ...r, [id]: !r[id] }))

  const filtered = useMemo(() => {
    let rows = templates
    if (displayFilter === 'shown')  rows = rows.filter((t) => t.enabled)
    if (displayFilter === 'hidden') rows = rows.filter((t) => !t.enabled)
    if (filters.Status === 'Successful') rows = rows.filter((t) => t.template_success_rate >= 90)
    if (filters.Status === 'Failed')     rows = rows.filter((t) => t.template_success_rate < 90)
    if (filters.Organization)  rows = rows.filter((t) => t.org === filters.Organization)
    if (filters['Job type'])   rows = rows.filter((t) => t.type === filters['Job type'])

    return [...rows].sort((a, b) => {
      let cmp = 0
      if (sortField === 'Savings')    cmp = a.successful_hosts_savings     - b.successful_hosts_savings
      if (sortField === 'Hours saved') cmp = a.successful_hosts_saved_hours - b.successful_hosts_saved_hours
      if (sortField === 'Name')       cmp = a.name.localeCompare(b.name)
      if (sortField === 'Host runs')  cmp = a.successful_hosts_total       - b.successful_hosts_total
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [templates, displayFilter, filters, sortField, sortDir])

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const enabledTemplates = templates.filter((t) => t.enabled)
  const totalSavings = enabledTemplates.reduce((s, t) => s + t.successful_hosts_savings, 0)
  const totalHours   = enabledTemplates.reduce((s, t) => s + t.successful_hosts_saved_hours, 0)
  const pageSavings  = paginated.filter((t) => t.enabled).reduce((s, t) => s + t.successful_hosts_savings, 0)
  const pageHours    = paginated.filter((t) => t.enabled).reduce((s, t) => s + t.successful_hosts_saved_hours, 0)

  const paginationProps = {
    itemCount: filtered.length,
    page,
    perPage,
    onSetPage:       (_, p)  => setPage(p),
    onPerPageSelect: (_, pp) => { setPerPage(pp); setPage(1) },
    perPageOptions: [{ title: '6', value: 6 }, { title: '10', value: 10 }, { title: '15', value: 15 }, { title: '20', value: 20 }],
  }

  const varMetric = isMoney ? 'successful_hosts_savings' : 'successful_hosts_saved_hours'
  const varLabel  = isMoney ? 'Savings' : 'Hours saved'
  const format    = isMoney ? formatMoney : formatHours

  return (
    <>
      {!embedded && (
        <PageHeader
          title="Automation Calculator"
          description="The calculated savings of the job templates running across the company in comparison to the cost of completing these jobs manually. You can use this report to get an idea of the ROI from your automation, as well as identify which templates are contributing to this savings the most."
          tags={['financial']}
        />
      )}

      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            {/* ── Toolbar ── */}
            <Toolbar clearAllFilters={clearAll} clearFiltersButtonText={hasFilters ? 'Clear all filters' : undefined}>
              <ToolbarContent>
                <ToolbarGroup variant="filter-group">
                  <ToolbarFilter
                    labels={filters.Status ? [filters.Status] : []}
                    deleteLabel={() => clearFilter('Status')}
                    deleteLabelGroup={() => clearFilter('Status')}
                    categoryName="Status"
                  >
                    <Select
                      isOpen={statusOpen}
                      onSelect={(_, val) => { setFilter('Status', val); setStatusOpen(false) }}
                      onOpenChange={setStatusOpen}
                      toggle={(ref) => (
                        <MenuToggle ref={ref} onClick={() => setStatusOpen(!statusOpen)} isExpanded={statusOpen} aria-label="Select status">
                          {filters.Status || 'Status'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        {statusOptions.map((s) => <SelectOption key={s} value={s}>{s}</SelectOption>)}
                      </SelectList>
                    </Select>
                  </ToolbarFilter>

                  <ToolbarFilter
                    labels={filters.Organization ? [filters.Organization] : []}
                    deleteLabel={() => clearFilter('Organization')}
                    deleteLabelGroup={() => clearFilter('Organization')}
                    categoryName="Organization"
                  >
                    <Select
                      isOpen={orgOpen}
                      onSelect={(_, val) => { setFilter('Organization', val); setOrgOpen(false) }}
                      onOpenChange={setOrgOpen}
                      toggle={(ref) => (
                        <MenuToggle ref={ref} onClick={() => setOrgOpen(!orgOpen)} isExpanded={orgOpen} aria-label="Select organization">
                          {filters.Organization || 'Organization'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        {orgOptions.map((o) => <SelectOption key={o} value={o}>{o}</SelectOption>)}
                      </SelectList>
                    </Select>
                  </ToolbarFilter>

                  <ToolbarFilter
                    labels={filters['Job type'] ? [filters['Job type']] : []}
                    deleteLabel={() => clearFilter('Job type')}
                    deleteLabelGroup={() => clearFilter('Job type')}
                    categoryName="Job type"
                  >
                    <Select
                      isOpen={jobTypeOpen}
                      onSelect={(_, val) => { setFilter('Job type', val); setJobTypeOpen(false) }}
                      onOpenChange={setJobTypeOpen}
                      toggle={(ref) => (
                        <MenuToggle ref={ref} onClick={() => setJobTypeOpen(!jobTypeOpen)} isExpanded={jobTypeOpen} aria-label="Select job type">
                          {filters['Job type'] || 'Job type'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        {jobTypeOptions.map((t) => <SelectOption key={t} value={t}>{t}</SelectOption>)}
                      </SelectList>
                    </Select>
                  </ToolbarFilter>

                  <ToolbarItem><DateRangeSelect /></ToolbarItem>
                </ToolbarGroup>

                <ToolbarGroup variant="filter-group">
                  <ToolbarItem>
                    <Select
                      isOpen={sortFieldOpen}
                      selected={sortField}
                      onSelect={(_, val) => { setSortField(val); setSortFOpen(false) }}
                      onOpenChange={setSortFOpen}
                      toggle={(ref) => (
                        <MenuToggle ref={ref} onClick={() => setSortFOpen(!sortFieldOpen)} isExpanded={sortFieldOpen} style={{ width: '130px' }}>
                          {sortField}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        {sortFields.map((f) => <SelectOption key={f} value={f}>{f}</SelectOption>)}
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

                <ToolbarItem align={{ default: 'alignEnd' }}>
                  <Pagination {...paginationProps} isCompact />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>

            {/* ── Chart + Sidebar ── */}
            <Grid hasGutter style={{ marginTop: '16px' }}>
              <GridItem span={9}>
                <Card isPlain isFullHeight>
                  <CardHeader>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                      <FlexItem>
                        <CardTitle>Automation savings</CardTitle>
                      </FlexItem>
                      <FlexItem>
                        <ToggleGroup aria-label="Savings view toggle">
                          <ToggleGroupItem
                            text="Money"
                            isSelected={isMoney}
                            onChange={() => { setIsMoney(true); setSortField('Savings') }}
                          />
                          <ToggleGroupItem
                            text="Time"
                            isSelected={!isMoney}
                            onChange={() => { setIsMoney(false); setSortField('Hours saved') }}
                          />
                        </ToggleGroup>
                      </FlexItem>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <SavingsChart templates={enabledTemplates} isMoney={isMoney} />
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem span={3}>
                <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }}>
                  <FlexItem>
                    <Card>
                      <CardTitle>Total savings</CardTitle>
                      <CardBody>
                        <Title headingLevel="h2" size="3xl" style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>
                          {isMoney ? formatMoney(totalSavings) : formatHours(totalHours)}
                        </Title>
                        <Content component="small" style={{ color: 'var(--pf-t--global--color--nonstatus--gray--default)' }}>
                          Current page: {isMoney ? formatMoney(pageSavings) : formatHours(pageHours)}
                        </Content>
                      </CardBody>
                    </Card>
                  </FlexItem>

                  <FlexItem>
                    <Card>
                      <CardTitle>Calculation cost</CardTitle>
                      <CardBody>
                        <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
                          <FlexItem>
                            <Content component="small" style={{ display: 'block', marginBottom: '4px' }}>Manual hourly cost</Content>
                            <InputGroup>
                              <InputGroupText>$</InputGroupText>
                              <InputGroupItem isFill>
                                <TextInput
                                  type="number"
                                  value={manualCostPerHour}
                                  onChange={(_, v) => setManualCost(parseFloat(v) || 0)}
                                  aria-label="Manual cost per hour"
                                  style={{ width: '80px' }}
                                  min={0}
                                />
                              </InputGroupItem>
                              <InputGroupText>/hr</InputGroupText>
                            </InputGroup>
                          </FlexItem>
                          <FlexItem>
                            <Content component="small" style={{ display: 'block', marginBottom: '4px' }}>Automated process cost</Content>
                            <InputGroup>
                              <InputGroupText>$</InputGroupText>
                              <InputGroupItem isFill>
                                <TextInput
                                  type="number"
                                  value={automatedCostPerHour}
                                  onChange={(_, v) => setAutoCost(parseFloat(v) || 0)}
                                  aria-label="Automated process cost per hour"
                                  style={{ width: '80px' }}
                                  min={0}
                                  step={0.01}
                                />
                              </InputGroupItem>
                              <InputGroupText>/hr</InputGroupText>
                            </InputGroup>
                          </FlexItem>
                        </Flex>
                      </CardBody>
                    </Card>
                  </FlexItem>

                  <FlexItem>
                    <Button variant="link" icon={<InfoCircleIcon />} onClick={() => setFormulaOpen(true)}>
                      Automation formula
                    </Button>
                  </FlexItem>
                </Flex>
              </GridItem>
            </Grid>

            {/* ── Templates table ── */}
            <div style={{ marginTop: '24px' }}>
              <Content component="p" style={{ marginBottom: '12px' }}>
                Enter the time it takes to run the following templates manually.
              </Content>
              <Table aria-label="ROI templates" variant="compact">
                <Thead>
                  <Tr>
                    <Th />
                    <Th>Name</Th>
                    <Th>{varLabel}</Th>
                    <Th>Manual time</Th>
                    <Th>Savings</Th>
                    <Th>
                      <Dropdown
                        isOpen={tableKebabOpen}
                        onOpenChange={setKebabOpen}
                        toggle={(ref) => (
                          <MenuToggle ref={ref} variant="plain" onClick={() => setKebabOpen(!tableKebabOpen)} aria-label="Table options">
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem onClick={() => { setAllEnabled(true); setKebabOpen(false) }}>Show all</DropdownItem>
                          <DropdownItem onClick={() => { setAllEnabled(false); setKebabOpen(false) }}>Hide all</DropdownItem>
                          <DropdownItem onClick={() => { setDisplayFilter('all'); setKebabOpen(false) }}>Display all rows</DropdownItem>
                          <DropdownItem onClick={() => { setDisplayFilter('shown'); setKebabOpen(false) }}>Display only shown rows</DropdownItem>
                          <DropdownItem onClick={() => { setDisplayFilter('hidden'); setKebabOpen(false) }}>Display only hidden rows</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginated.flatMap((t, rowIndex) => {
                    const rows = [
                      <Tr key={t.id} style={!t.enabled ? { opacity: 0.55 } : {}}>
                        <Td
                          expand={{
                            rowIndex,
                            isExpanded: !!expandedRows[t.id],
                            onToggle: () => toggleRow(t.id),
                          }}
                        />
                        <Td dataLabel="Name">
                          <Tooltip content="View jobs for this template in Job Explorer (last 30 days)">
                            <Button variant="link" style={{ padding: 0 }}>{t.name}</Button>
                          </Tooltip>
                        </Td>
                        <Td
                          dataLabel={varLabel}
                          style={{ color: 'var(--pf-t--global--color--status--success--default)', fontWeight: 500 }}
                        >
                          {format(t[varMetric])}
                        </Td>
                        <Td dataLabel="Manual time">
                          <InputGroup>
                            <InputGroupItem isFill>
                              <TextInput
                                type="number"
                                value={t.avgRunTime}
                                onChange={(_, v) => updateManual(t.id, v)}
                                aria-label={`Manual time for ${t.name}`}
                                style={{ width: '70px' }}
                                min={0}
                                step={0.5}
                              />
                            </InputGroupItem>
                            <InputGroupText>min</InputGroupText>
                            <InputGroupText style={{ color: 'var(--pf-t--global--color--nonstatus--gray--default)' }}>
                              × {t.successful_hosts_total} host runs
                            </InputGroupText>
                          </InputGroup>
                        </Td>
                        <Td
                          dataLabel="Savings"
                          style={!t.enabled ? { color: 'var(--pf-t--global--color--nonstatus--gray--default)' } : {}}
                        >
                          {isMoney ? formatMoney(t.successful_hosts_savings) : formatHours(t.successful_hosts_saved_hours)}
                        </Td>
                        <Td dataLabel="Show">
                          <Switch
                            label="Show"
                            labelOff="Hide"
                            isChecked={t.enabled}
                            onChange={() => toggleEnabled(t.id)}
                            aria-label={`${t.enabled ? 'Hide' : 'Show'} ${t.name} in chart`}
                          />
                        </Td>
                      </Tr>,
                    ]

                    if (expandedRows[t.id]) {
                      rows.push(
                        <Tr key={`${t.id}-expanded`} isExpanded>
                          <Td colSpan={6}>
                            <ExpandableRowContent>
                              <DescriptionList isCompact isHorizontal>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Elapsed</DescriptionListTerm>
                                  <DescriptionListDescription>{t.elapsed}s avg</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Host count</DescriptionListTerm>
                                  <DescriptionListDescription>{t.host_count}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Host runs</DescriptionListTerm>
                                  <DescriptionListDescription>{t.successful_hosts_total}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Organization</DescriptionListTerm>
                                  <DescriptionListDescription>{t.org}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Cluster</DescriptionListTerm>
                                  <DescriptionListDescription>{t.cluster}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Success rate</DescriptionListTerm>
                                  <DescriptionListDescription>{t.template_success_rate}%</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Failed host costs</DescriptionListTerm>
                                  <DescriptionListDescription>{formatMoney(t.failed_hosts_costs)}</DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Monetary gain</DescriptionListTerm>
                                  <DescriptionListDescription style={{ color: 'var(--pf-t--global--color--status--success--default)' }}>
                                    {formatMoney(t.monetary_gain)}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                                <DescriptionListGroup>
                                  <DescriptionListTerm>Job type</DescriptionListTerm>
                                  <DescriptionListDescription>{t.type}</DescriptionListDescription>
                                </DescriptionListGroup>
                              </DescriptionList>
                            </ExpandableRowContent>
                          </Td>
                        </Tr>
                      )
                    }

                    return rows
                  })}
                </Tbody>
              </Table>
            </div>
          </CardBody>

          <CardFooter>
            <Pagination {...paginationProps} variant="bottom" />
          </CardFooter>
        </Card>
      </PageSection>

      {/* ── Automation formula modal ── */}
      <Modal
        isOpen={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        variant={ModalVariant.medium}
        title="Automation formula"
        actions={[
          <Button key="close" variant="primary" onClick={() => setFormulaOpen(false)}>Close</Button>,
        ]}
      >
        <Content component="p" style={{ marginBottom: '16px' }}>
          The savings displayed are calculated using the following formula:
        </Content>
        <CodeBlock style={{ marginBottom: '16px' }}>
          <CodeBlockCode>
            {`Savings = Manual cost − Automation cost\nManual cost = (Manual time ÷ 60) × Manual hourly rate × Host runs\nAutomation cost = (Elapsed time ÷ 3600) × Automated hourly rate × Host runs`}
          </CodeBlockCode>
        </CodeBlock>
        <Content component="p" style={{ marginBottom: '8px' }}>Where:</Content>
        <List>
          <ListItem><strong>Manual time</strong> — time to run the template manually (minutes, entered per template)</ListItem>
          <ListItem><strong>Manual hourly rate</strong> — cost of a human performing the task (default: $15/hr)</ListItem>
          <ListItem><strong>Elapsed time</strong> — average automated run time in seconds</ListItem>
          <ListItem><strong>Automated hourly rate</strong> — infrastructure cost to run automation (default: $0.10/hr)</ListItem>
          <ListItem><strong>Host runs</strong> — total successful host executions for this template</ListItem>
        </List>
      </Modal>
    </>
  )
}
