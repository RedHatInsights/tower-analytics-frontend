import { useState } from 'react'
import {
  PageSection,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarFilter,
  Button,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  TextInput,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  Content,
} from '@patternfly/react-core'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import { PageHeader } from '../../shared/PageHeader'
import { DateRangeSelect } from '../../shared/MockToolbar'

// ── Mock data ────────────────────────────────────────────────────────────────

const mockWorkflows = [
  { name: 'Full Deployment Pipeline',  count: 198 },
  { name: 'Quarterly Patching',        count: 154 },
  { name: 'Disaster Recovery Drill',   count: 87  },
  { name: 'Onboarding Automation',     count: 64  },
  { name: 'Compliance Enforcement',    count: 41  },
]

const mockTemplates = [
  { name: 'Deploy Web App',     count: 312 },
  { name: 'Patching Workflow',  count: 204 },
  { name: 'Provision Servers',  count: 187 },
  { name: 'Security Hardening', count: 143 },
  { name: 'Backup and Restore', count: 98  },
]

const mockModules = [
  { name: 'ansible.builtin.copy',     count: 4821 },
  { name: 'ansible.builtin.template', count: 3904 },
  { name: 'ansible.builtin.service',  count: 2771 },
  { name: 'ansible.builtin.yum',      count: 2340 },
  { name: 'ansible.builtin.command',  count: 1987 },
]

const chartBars = [
  { label: 'Jun 3',  success: 78,  failed: 12 },
  { label: 'Jun 4',  success: 91,  failed: 8  },
  { label: 'Jun 5',  success: 54,  failed: 21 },
  { label: 'Jun 6',  success: 110, failed: 5  },
  { label: 'Jun 7',  success: 88,  failed: 14 },
  { label: 'Jun 8',  success: 43,  failed: 9  },
  { label: 'Jun 9',  success: 67,  failed: 11 },
  { label: 'Jun 10', success: 95,  failed: 7  },
  { label: 'Jun 11', success: 102, failed: 18 },
  { label: 'Jun 12', success: 76,  failed: 6  },
  { label: 'Jun 13', success: 88,  failed: 10 },
  { label: 'Jun 14', success: 114, failed: 4  },
]

const categories    = ['Keyword', 'Status', 'Job type']
const statusOptions = ['Successful', 'Failed', 'Error', 'Running', 'Pending', 'Canceled']
const jobTypeOpts   = ['Job', 'Workflow job', 'Inventory update', 'Project update']

// ── Sub-components ───────────────────────────────────────────────────────────

function BarChart() {
  const maxVal = Math.max(...chartBars.map(b => b.success + b.failed))
  return (
    <div style={{ paddingBlock: '16px', height: '260px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {[
          { label: 'Successful', color: 'var(--pf-t--global--color--brand--default)' },
          { label: 'Failed',     color: 'var(--pf-t--global--color--status--danger--default)' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, background: color, display: 'inline-block', borderRadius: '2px', flexShrink: 0 }} />
            <Content component="small">{label}</Content>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {chartBars.map((bar) => (
          <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ height: `${(bar.failed  / maxVal) * 160}px`, background: 'var(--pf-t--global--color--status--danger--default)', minHeight: 2 }} />
              <div style={{ height: `${(bar.success / maxVal) * 160}px`, background: 'var(--pf-t--global--color--brand--default)', minHeight: 2 }} />
            </div>
            <Content component="small" style={{ whiteSpace: 'nowrap' }}>{bar.label}</Content>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopList({ title, items }) {
  return (
    <DataList aria-label={title} isCompact>
      <DataListItem aria-labelledby={`${title}-header`}>
        <DataListItemRow>
          <DataListItemCells dataListCells={[
            <DataListCell key="name"><strong>{title}</strong></DataListCell>,
            <DataListCell key="usage" alignRight><strong>Usage</strong></DataListCell>,
          ]} />
        </DataListItemRow>
      </DataListItem>
      {items.map((item) => (
        <DataListItem key={item.name} aria-labelledby={item.name}>
          <DataListItemRow>
            <DataListItemCells dataListCells={[
              <DataListCell key="name">
                <Button variant="link" isInline>{item.name}</Button>
              </DataListCell>,
              <DataListCell key="count" alignRight>
                {item.count.toLocaleString()}
              </DataListCell>,
            ]} />
          </DataListItemRow>
        </DataListItem>
      ))}
    </DataList>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Clusters() {
  // Variant toggle
  const [variant, setVariant] = useState('basic')
  const [query,   setQuery]   = useState('')

  // Active category in attribute-value filter
  const [category,     setCategory]     = useState('Keyword')
  const [categoryOpen, setCategoryOpen] = useState(false)

  // Per-category open state for value selects
  const [statusOpen,  setStatusOpen]  = useState(false)
  const [jobTypeOpen, setJobTypeOpen] = useState(false)

  // Applied filter chips: one value per category
  const [filters, setFilters] = useState({ Keyword: '', Status: '', 'Job type': '' })

  const setFilter  = (cat, val) => setFilters(f => ({ ...f, [cat]: val }))
  const clearFilter = (cat)    => setFilters(f => ({ ...f, [cat]: '' }))
  const clearAll   = ()        => setFilters({ Keyword: '', Status: '', 'Job type': '' })

  const hasActive = Object.values(filters).some(v => v !== '')

  return (
    <>
      <PageHeader title="Clusters" />
      <Toolbar inset={{ default: 'insetLg' }} clearAllFilters={hasActive ? clearAll : undefined}>
        <ToolbarContent>

          {/* Variant toggle — bordered icon button */}
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
                    <MenuToggle
                      ref={ref}
                      onClick={() => setStatusOpen(!statusOpen)}
                      isExpanded={statusOpen}
                      aria-label="Select status"
                    >
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
                    <MenuToggle
                      ref={ref}
                      onClick={() => setJobTypeOpen(!jobTypeOpen)}
                      isExpanded={jobTypeOpen}
                      aria-label="Select job type"
                    >
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

        </ToolbarContent>
      </Toolbar>

      <PageSection hasBodyWrapper={false}>
        <Grid hasGutter>
          <GridItem span={12}>
            <Card>
              <CardTitle>Job status</CardTitle>
              <CardBody><BarChart /></CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardBody><TopList title="Top workflows" items={mockWorkflows} /></CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardBody><TopList title="Top templates" items={mockTemplates} /></CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardBody><TopList title="Top modules"   items={mockModules}   /></CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  )
}
