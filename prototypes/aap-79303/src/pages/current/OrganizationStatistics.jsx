import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageSection,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Tabs,
  Tab,
  TabTitleText,
  Alert,
  AlertActionLink,
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
  SearchInput,
  TextInput,
} from '@patternfly/react-core'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import { PageHeader } from '../../shared/PageHeader'
import { DateRangeSelect } from '../../shared/MockToolbar'

const orgs   = ['Platform Engineering', 'Security Ops', 'Infrastructure', 'Database Team', 'Network Ops', 'IT Operations']
const colors = [
  'var(--pf-t--global--color--brand--default)',
  'var(--pf-t--global--color--status--info--default)',
  'var(--pf-t--global--color--nonstatus--yellow--default)',
  'var(--pf-t--global--color--nonstatus--orange--default)',
  'var(--pf-t--global--color--status--danger--default)',
  'var(--pf-t--global--color--status--success--default)',
]

const statusOptions  = ['Successful', 'Failed', 'Error', 'Running', 'Pending', 'Canceled']
const jobTypeOptions = ['Job', 'Workflow Job', 'Inventory update', 'Project update']

function GroupedBarPlaceholder() {
  const weeks = ['May 19', 'May 26', 'Jun 2', 'Jun 9']
  const data  = weeks.map((w) => ({
    week: w,
    values: orgs.map(() => Math.floor(Math.random() * 80 + 20)),
  }))

  return (
    <div style={{ height: '260px', display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px', fontSize: '12px' }}>
        {orgs.map((org, i) => (
          <span key={org} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 12, height: 12, background: colors[i], display: 'inline-block', borderRadius: 2 }} />
            {org}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
        {data.map((group) => (
          <div key={group.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end', height: '160px' }}>
              {group.values.map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${v}px`, background: colors[i], minHeight: 4 }} />
              ))}
            </div>
            <span style={{ fontSize: '11px', opacity: 0.6 }}>{group.week}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutPlaceholder() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '16px 0' }}>
      <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
        <svg viewBox="0 0 160 160" width="160" height="160">
          {orgs.map((_, i) => {
            const startAngle = (i / orgs.length) * 2 * Math.PI - Math.PI / 2
            const endAngle   = ((i + 1) / orgs.length) * 2 * Math.PI - Math.PI / 2
            const x1 = 80 + 60 * Math.cos(startAngle), y1 = 80 + 60 * Math.sin(startAngle)
            const x2 = 80 + 60 * Math.cos(endAngle),   y2 = 80 + 60 * Math.sin(endAngle)
            const ix1 = 80 + 35 * Math.cos(startAngle), iy1 = 80 + 35 * Math.sin(startAngle)
            const ix2 = 80 + 35 * Math.cos(endAngle),   iy2 = 80 + 35 * Math.sin(endAngle)
            return (
              <path key={i} fill={colors[i]}
                d={`M ${ix1} ${iy1} L ${x1} ${y1} A 60 60 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A 35 35 0 0 0 ${ix1} ${iy1}`}
              />
            )
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
        {orgs.map((org, i) => (
          <div key={org} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, background: colors[i], display: 'inline-block', borderRadius: 2, flexShrink: 0 }} />
            {org}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OrganizationStatistics() {
  const navigate    = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  // Toolbar
  const [variant, setVariant]           = useState('basic')
  const [query, setQuery]               = useState('')
  const [keyword, setKeyword]           = useState('')
  const [filterAttr, setFilterAttr]     = useState('Keyword')
  const [filterAttrOpen, setFAttrOpen]  = useState(false)
  const [filters, setFilters]           = useState({ Status: '', 'Job type': '' })
  const [statusOpen, setStatusOpen]     = useState(false)
  const [jobTypeOpen, setJobTypeOpen]   = useState(false)

  const setFilter   = (key, val) => setFilters((f) => ({ ...f, [key]: val }))
  const clearFilter = (key)      => setFilters((f) => ({ ...f, [key]: '' }))
  const clearAll    = ()         => { setFilters({ Status: '', 'Job type': '' }); setKeyword('') }
  const hasFilters  = keyword || Object.values(filters).some(Boolean)

  return (
    <>
      <PageHeader title="Organization Statistics" />

      <Toolbar inset={{ default: 'insetLg' }} clearAllFilters={clearAll} clearFiltersButtonText={hasFilters ? 'Clear all filters' : undefined}>
        <ToolbarContent>
          <ToolbarItem>
            <Button
              variant="control"
              aria-label={variant === 'basic' ? 'Switch to advanced filter' : 'Switch to basic filter'}
              onClick={() => { setVariant((v) => (v === 'basic' ? 'advanced' : 'basic')); setQuery('') }}
              icon={variant === 'basic' ? <FilterIcon /> : <CodeIcon />}
            />
          </ToolbarItem>

          {variant === 'basic' && (
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Select
                  isOpen={filterAttrOpen}
                  onSelect={(_, val) => { setFilterAttr(val); setFAttrOpen(false) }}
                  onOpenChange={setFAttrOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} icon={<FilterIcon />} onClick={() => setFAttrOpen(!filterAttrOpen)} isExpanded={filterAttrOpen} aria-label="Select filter attribute">
                      {filterAttr}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {['Keyword', 'Status', 'Job type'].map((c) => <SelectOption key={c} value={c}>{c}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarItem>

              <ToolbarFilter
                labels={keyword ? [keyword] : []}
                deleteLabel={() => setKeyword('')}
                deleteLabelGroup={() => setKeyword('')}
                categoryName="Keyword"
                showToolbarItem={filterAttr === 'Keyword'}
              >
                <SearchInput
                  aria-label="Filter by keyword"
                  placeholder="Filter by keyword"
                  value={keyword}
                  onChange={(_, v) => setKeyword(v)}
                  onClear={() => setKeyword('')}
                  style={{ minWidth: '220px' }}
                />
              </ToolbarFilter>

              <ToolbarFilter
                labels={filters.Status ? [filters.Status] : []}
                deleteLabel={() => clearFilter('Status')}
                deleteLabelGroup={() => clearFilter('Status')}
                categoryName="Status"
                showToolbarItem={filterAttr === 'Status'}
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
                    {statusOptions.map((s) => <SelectOption key={s} value={s}>{s}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarFilter>

              <ToolbarFilter
                labels={filters['Job type'] ? [filters['Job type']] : []}
                deleteLabel={() => clearFilter('Job type')}
                deleteLabelGroup={() => clearFilter('Job type')}
                categoryName="Job type"
                showToolbarItem={filterAttr === 'Job type'}
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
                    {jobTypeOptions.map((t) => <SelectOption key={t} value={t}>{t}</SelectOption>)}
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
        </ToolbarContent>
      </Toolbar>

      <PageSection hasBodyWrapper={false}>
        <Grid hasGutter>
          <GridItem span={12}>
            <Alert
              variant="warning"
              title="The organization statistics page will be deprecated in a future release."
              actionLinks={
                <>
                  <AlertActionLink onClick={() => navigate('/reports/hosts-by-org')}>
                    Hosts by organization report
                  </AlertActionLink>
                  <AlertActionLink onClick={() => navigate('/reports/jobs-tasks-by-org')}>
                    Jobs/Tasks by organization report
                  </AlertActionLink>
                </>
              }
            >
              The organization statistics page has been converted to a set of reports. Please use our new, more full-featured reports by following the links below.
            </Alert>
          </GridItem>

          <GridItem span={12}>
            <Card>
              <Tabs activeKey={activeTab} onSelect={(_, k) => setActiveTab(k)}>
                <Tab eventKey={0} title={<TabTitleText>Jobs</TabTitleText>} />
                <Tab eventKey={1} title={<TabTitleText>Hosts</TabTitleText>} />
              </Tabs>
              <CardBody>
                <GroupedBarPlaceholder />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={6}>
            <Card>
              <CardTitle><h2>Job Runs by Organization</h2></CardTitle>
              <CardBody><DonutPlaceholder /></CardBody>
            </Card>
          </GridItem>

          <GridItem span={6}>
            <Card>
              <CardTitle><h2>Usage by Organization (Tasks)</h2></CardTitle>
              <CardBody><DonutPlaceholder /></CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  )
}
