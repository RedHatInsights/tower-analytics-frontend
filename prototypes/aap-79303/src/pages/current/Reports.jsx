import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PageSection,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Gallery,
  Label,
  LabelGroup,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarFilter,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  SearchInput,
  TextInput,
  Tooltip,
} from '@patternfly/react-core'
import AngleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-left-icon'
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import SortAmountDownIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-down-icon'
import SortAmountUpIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-up-icon'
import { PageHeader } from '../../shared/PageHeader'

const TAGS = {
  operations:  { name: 'Operations',  description: 'Useful to engineers who manage day-to-day Ansible operations.' },
  executive:   { name: 'Executive',   description: 'Useful to executives who monitor Ansible operations across the company.' },
  savings:     { name: 'Savings',     description: 'Provides information on cost savings from automation.' },
  'job-runs':  { name: 'Job runs',    description: 'Tracks job execution data over time.' },
  'time-series':{ name: 'Time series', description: 'Displays data as a time series for trend analysis.' },
  organization:{ name: 'Organization',description: 'Breaks data down by organization.' },
  hosts:       { name: 'Hosts',       description: 'Provides information about managed hosts.' },
  modules:     { name: 'Modules',     description: 'Tracks Ansible module usage.' },
}

const reports = [
  {
    slug: 'job-run-rate',
    name: 'Job Run Rate',
    description: 'Track the rate of job runs across your clusters over time.',
    tags: ['operations', 'job-runs', 'time-series'],
  },
  {
    slug: 'templates-by-org',
    name: 'Templates by Organization',
    description: 'See how templates are distributed across organizations.',
    tags: ['executive', 'organization'],
  },
  {
    slug: 'hosts-by-org',
    name: 'Hosts by Organization',
    description: 'View the number of managed hosts per organization.',
    tags: ['executive', 'organization', 'hosts'],
  },
  {
    slug: 'jobs-tasks-by-org',
    name: 'Jobs and Tasks by Organization',
    description: 'Analyze job and task usage broken down by organization.',
    tags: ['executive', 'organization', 'job-runs'],
  },
  {
    slug: 'module-usage',
    name: 'Module Usage',
    description: 'Track which Ansible modules are most frequently used.',
    tags: ['operations', 'modules'],
  },
  {
    slug: 'automation-calculator',
    name: 'Automation Calculator',
    description: 'Calculate cost savings from automation.',
    tags: ['savings'],
  },
]

const tagOptions = Object.keys(TAGS).map((k) => TAGS[k].name)

// Per-report compact filter definitions for the preview card
const reportPreviewFilters = {
  'job-run-rate': [
    { key: 'status',      label: 'Status',         options: ['Successful', 'Failed', 'Error', 'Running', 'Canceled'] },
    { key: 'granularity', label: 'Weekly',          options: ['Daily', 'Weekly', 'Monthly'] },
    { key: 'date',        label: 'Past 6 months',   options: ['Past 30 days', 'Past 6 months', 'Past year', 'Past 2 years'] },
    { key: 'sort',        label: 'Total jobs',      options: ['Total jobs', 'Failed jobs', 'Successful jobs'] },
  ],
  'templates-by-org': [
    { key: 'org',         label: 'Organization',    options: ['All organizations', 'Platform Engineering', 'Security Ops', 'Infrastructure'] },
    { key: 'granularity', label: 'Monthly',         options: ['Daily', 'Weekly', 'Monthly'] },
    { key: 'date',        label: 'Past 6 months',   options: ['Past 30 days', 'Past 6 months', 'Past year'] },
    { key: 'sort',        label: 'Template count',  options: ['Template count', 'Name'] },
  ],
  'hosts-by-org': [
    { key: 'org',         label: 'Organization',    options: ['All organizations', 'Platform Engineering', 'Security Ops', 'Infrastructure'] },
    { key: 'granularity', label: 'Monthly',         options: ['Daily', 'Weekly', 'Monthly'] },
    { key: 'date',        label: 'Past 6 months',   options: ['Past 30 days', 'Past 6 months', 'Past year'] },
    { key: 'sort',        label: 'Host count',      options: ['Host count', 'Name'] },
  ],
  'jobs-tasks-by-org': [
    { key: 'job_type',    label: 'Job type',        options: ['Job', 'Workflow Job', 'Inventory update'] },
    { key: 'granularity', label: 'Monthly',         options: ['Daily', 'Weekly', 'Monthly'] },
    { key: 'date',        label: 'Past 6 months',   options: ['Past 30 days', 'Past 6 months', 'Past year'] },
    { key: 'sort',        label: 'Job count',       options: ['Job count', 'Task count'] },
  ],
  'module-usage': [
    { key: 'cluster',     label: 'Cluster',         options: ['All clusters', 'us-east-prod', 'us-west-prod', 'eu-central-prod'] },
    { key: 'date',        label: 'Past 6 months',   options: ['Past 30 days', 'Past 6 months', 'Past year'] },
    { key: 'sort',        label: 'Usage count',     options: ['Usage count', 'Module name'] },
  ],
  'automation-calculator': [
    { key: 'status',      label: 'Status',          options: ['Successful', 'Failed'] },
    { key: 'org',         label: 'Organization',    options: ['All organizations', 'Platform Engineering', 'Security Ops'] },
    { key: 'job_type',    label: 'Job type',        options: ['Job', 'Workflow Job'] },
    { key: 'date',        label: 'Past year',       options: ['Past 30 days', 'Past 6 months', 'Past year', 'Past 2 years'] },
    { key: 'sort',        label: 'Savings',         options: ['Savings', 'Hours saved', 'Name', 'Host runs'] },
  ],
}

function PreviewFilters({ slug }) {
  const filterDefs = reportPreviewFilters[slug] ?? []
  const [values, setValues]   = useState(() => Object.fromEntries(filterDefs.map((f) => [f.key, f.label])))
  const [openKey, setOpenKey] = useState(null)
  const [sortDir, setSortDir] = useState('desc')

  // Reset when report changes
  useEffect(() => {
    setValues(Object.fromEntries(filterDefs.map((f) => [f.key, f.label])))
    setOpenKey(null)
  }, [slug])

  if (!filterDefs.length) return null

  return (
    <Toolbar style={{ padding: '8px 0 4px', background: 'transparent' }}>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          {filterDefs.map((f) => (
            <ToolbarItem key={f.key}>
              <Select
                isOpen={openKey === f.key}
                onSelect={(_, val) => { setValues((v) => ({ ...v, [f.key]: val })); setOpenKey(null) }}
                onOpenChange={(isOpen) => setOpenKey(isOpen ? f.key : null)}
                toggle={(ref) => (
                  <MenuToggle
                    ref={ref}
                    onClick={() => setOpenKey(openKey === f.key ? null : f.key)}
                    isExpanded={openKey === f.key}
                    aria-label={f.key}
                  >
                    {values[f.key] ?? f.label}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {f.options.map((o) => <SelectOption key={o} value={o}>{o}</SelectOption>)}
                </SelectList>
              </Select>
            </ToolbarItem>
          ))}
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
      </ToolbarContent>
    </Toolbar>
  )
}

function MiniBarChart() {
  const vals = [40, 65, 55, 80, 70, 90, 75]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 220, padding: '8px 0' }}>
      {vals.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${v}%`,
            background: 'var(--pf-t--global--color--brand--default)',
            borderRadius: '2px 2px 0 0',
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}

function ReportTags({ tags }) {
  return (
    <LabelGroup>
      {tags.map((tagKey) => {
        const tag = TAGS[tagKey]
        if (!tag) return null
        return (
          <Tooltip key={tagKey} content={tag.description} position="top">
            <Label color="grey">{tag.name}</Label>
          </Tooltip>
        )
      })}
    </LabelGroup>
  )
}

export default function Reports() {
  const [selected, setSelected]     = useState(reports[0].slug)
  const [dropdownOpen, setDropdown] = useState(false)

  // Filters
  const [variant, setVariant]       = useState('basic')
  const [query, setQuery]           = useState('')
  const [keyword, setKeyword]       = useState('')
  const [filterAttr, setFilterAttr] = useState('Keyword')
  const [filterAttrOpen, setFAttrOpen] = useState(false)
  const [tagFilter, setTagFilter]   = useState('')
  const [tagOpen, setTagOpen]       = useState(false)

  // Sort
  const [sortField, setSortField]    = useState('Name')
  const [sortFieldOpen, setSortFOpen]= useState(false)
  const [sortDir, setSortDir]        = useState('asc')

  const clearAll = () => { setKeyword(''); setTagFilter('') }
  const hasFilters = keyword || tagFilter

  const filtered = useMemo(() => {
    let rows = reports
    if (keyword) rows = rows.filter((r) => r.name.toLowerCase().includes(keyword.toLowerCase()))
    if (tagFilter) {
      const targetKey = Object.entries(TAGS).find(([, v]) => v.name === tagFilter)?.[0]
      if (targetKey) rows = rows.filter((r) => r.tags.includes(targetKey))
    }
    rows = [...rows].sort((a, b) => {
      const cmp = sortField === 'Name'
        ? a.name.localeCompare(b.name)
        : a.description.localeCompare(b.description)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [keyword, tagFilter, sortField, sortDir])

  const previewList   = filtered.length > 0 ? filtered : reports
  const previewReport = previewList.find((r) => r.slug === selected) ?? previewList[0]
  const idx           = previewList.indexOf(previewReport)

  // When filters change and the selected report is no longer in the filtered set,
  // automatically advance to the first matching report
  useEffect(() => {
    if (filtered.length > 0 && !filtered.find((r) => r.slug === selected)) {
      setSelected(filtered[0].slug)
    }
  }, [filtered])

  return (
    <>
      <PageHeader title="Reports" />

      {/* ── Toolbar ── */}
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
              {/* Attribute selector */}
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
                    {['Keyword', 'Tag'].map((c) => <SelectOption key={c} value={c}>{c}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarItem>

              {/* Name search */}
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

              {/* Tag filter */}
              <ToolbarFilter
                labels={tagFilter ? [tagFilter] : []}
                deleteLabel={() => setTagFilter('')}
                deleteLabelGroup={() => setTagFilter('')}
                categoryName="Tag"
                showToolbarItem={filterAttr === 'Tag'}
              >
                <Select
                  isOpen={tagOpen}
                  onSelect={(_, val) => { setTagFilter(val); setTagOpen(false) }}
                  onOpenChange={setTagOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setTagOpen(!tagOpen)} isExpanded={tagOpen} aria-label="Select tag">
                      {tagFilter || 'Any tag'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {tagOptions.map((t) => <SelectOption key={t} value={t}>{t}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarFilter>
            </ToolbarGroup>
          )}

          {variant === 'advanced' && (
            <ToolbarItem style={{ flex: 1 }}>
              <TextInput
                value={query}
                onChange={(_, v) => setQuery(v)}
                placeholder='name ~ "automation" AND tag = "Operations"'
                aria-label="Advanced filter query"
                style={{ width: '100%' }}
              />
            </ToolbarItem>
          )}

          {/* Sort */}
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <Select
                isOpen={sortFieldOpen}
                selected={sortField}
                onSelect={(_, val) => { setSortField(val); setSortFOpen(false) }}
                onOpenChange={setSortFOpen}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setSortFOpen(!sortFieldOpen)} isExpanded={sortFieldOpen} style={{ width: '140px' }}>
                    {sortField}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  {['Name', 'Description'].map((f) => <SelectOption key={f} value={f}>{f}</SelectOption>)}
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
        </ToolbarContent>
      </Toolbar>

      <PageSection hasBodyWrapper={false}>
        {/* ── Preview card ── */}
        <Card isCompact style={{ marginBottom: '16px' }}>
          <CardHeader
            actions={{
              actions: (
                <>
                  <ReportTags tags={previewReport.tags} />
                  <Button
                    icon={<AngleLeftIcon />}
                    variant="plain"
                    aria-label="Previous report"
                    isDisabled={idx <= 0}
                    onClick={() => setSelected(previewList[idx - 1].slug)}
                  />
                  <Dropdown
                    isOpen={dropdownOpen}
                    onOpenChange={setDropdown}
                    toggle={(ref) => (
                      <MenuToggle
                        ref={ref}
                        onClick={() => setDropdown(!dropdownOpen)}
                        isExpanded={dropdownOpen}
                        style={{ justifyContent: 'flex-start' }}
                        aria-label="Select report"
                      >
                        {previewReport.name}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      {previewList.map((r) => (
                        <DropdownItem
                          key={r.slug}
                          isSelected={r.slug === previewReport.slug}
                          onClick={() => { setSelected(r.slug); setDropdown(false) }}
                        >
                          {r.name}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                  <Button
                    icon={<AngleRightIcon />}
                    variant="plain"
                    aria-label="Next report"
                    isDisabled={idx >= previewList.length - 1}
                    onClick={() => setSelected(previewList[idx + 1].slug)}
                  />
                </>
              ),
            }}
          >
            <CardTitle>
              <Link to={`/reports/${previewReport.slug}`} style={{ fontWeight: 600 }}>
                {previewReport.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <PreviewFilters slug={previewReport.slug} />
            <MiniBarChart />
            <p style={{ fontSize: '13px', marginTop: '8px', opacity: 0.8 }}>
              {previewReport.description}
            </p>
          </CardBody>
        </Card>

        {/* ── Gallery ── */}
        <Gallery hasGutter minWidths={{ sm: '307px', md: '307px', lg: '307px' }}>
          {filtered.map((report) => (
            <Card key={report.slug} isCompact>
              <CardTitle>
                <Link to={`/reports/${report.slug}`} style={{ fontWeight: 600 }}>
                  {report.name}
                </Link>
              </CardTitle>
              <CardBody>
                <p style={{ fontSize: '13px', opacity: 0.8 }}>{report.description}</p>
              </CardBody>
              <CardFooter>
                <ReportTags tags={report.tags} />
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </>
  )
}
