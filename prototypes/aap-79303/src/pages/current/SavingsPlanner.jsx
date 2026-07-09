import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageSection,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  Gallery,
  Button,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarFilter,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Dropdown,
  DropdownList,
  DropdownItem,
  SearchInput,
  TextInput,
  Pagination,
  Content,
  Flex,
  FlexItem,
} from '@patternfly/react-core'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon'
import SortAmountDownIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-down-icon'
import SortAmountUpIcon from '@patternfly/react-icons/dist/esm/icons/sort-amount-up-icon'
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import { PageHeader } from '../../shared/PageHeader'
import { mockPlans, categoryLabels, frequencyLabels, statusMap } from '../../data/savingsPlanner'

const automationStatusOptions = ['Successful', 'Failed', 'Running', 'Not running']
const categoryOptions          = ['IT Infrastructure', 'Development', 'Line of business', 'Security']
const sortFields               = ['Modified', 'Name', 'Projected savings']

function PlanCard({ plan, isSelected, onSelect, onDelete }) {
  const navigate   = useNavigate()
  const [kebabOpen, setKebabOpen] = useState(false)
  const { name, description, category, frequency_period, template_details, automation_status, projected_savings, modified } = plan
  const jobStatus   = statusMap[automation_status?.status] ?? statusMap.not_running
  const modifiedDate = new Date(modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Card isFullHeight>
      <CardHeader
        selectableActions={{
          selectableActionId: `select-plan-${plan.id}`,
          selectableActionAriaLabelledby: `plan-${plan.id}-name`,
          name: `select-plan-${plan.id}`,
          isChecked: isSelected,
          onChange: () => onSelect(plan.id),
        }}
        actions={{
          actions: (
            <Dropdown
              isOpen={kebabOpen}
              onOpenChange={setKebabOpen}
              toggle={(ref) => (
                <MenuToggle ref={ref} variant="plain" onClick={() => setKebabOpen(!kebabOpen)} aria-label="Plan actions">
                  <EllipsisVIcon />
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem onClick={() => { setKebabOpen(false); navigate(`/savings-planner/${plan.id}/edit`) }}>Edit</DropdownItem>
                <DropdownItem onClick={() => { setKebabOpen(false) }}>Manage tasks</DropdownItem>
                <DropdownItem onClick={() => { setKebabOpen(false) }}>Link template</DropdownItem>
                <DropdownItem onClick={() => { setKebabOpen(false); onDelete(plan.id) }} isDanger>Delete</DropdownItem>
              </DropdownList>
            </Dropdown>
          ),
        }}
      >
        <CardTitle>
          <Button
            variant="link"
            style={{ padding: 0, fontSize: 'inherit', fontWeight: 600 }}
            onClick={() => navigate(`/savings-planner/${plan.id}`)}
          >
            {name}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardBody>
        {description && (
          <Content component="p" style={{ fontSize: '13px', marginBottom: '12px', opacity: 0.8 }}>
            {description}
          </Content>
        )}

        <Flex direction={{ default: 'column' }} gap={{ default: 'gapSm' }}>
          <FlexItem>
            <Content component="small" style={{ opacity: 0.7 }}>Frequency</Content>
            <Content component="p" style={{ fontSize: '13px', margin: 0 }}>
              {frequencyLabels[frequency_period] ?? frequency_period}
            </Content>
          </FlexItem>

          <FlexItem>
            <Content component="small" style={{ opacity: 0.7 }}>Template</Content>
            <Content component="p" style={{ fontSize: '13px', margin: 0 }}>
              {template_details
                ? <Button variant="link" style={{ padding: 0, fontSize: '13px' }}>{template_details.name}</Button>
                : <Button variant="link" style={{ padding: 0, fontSize: '13px' }}>Link template</Button>
              }
            </Content>
          </FlexItem>

          <FlexItem>
            <Content component="small" style={{ opacity: 0.7 }}>Last job status</Content>
            <div style={{ marginTop: '2px' }}>
              {jobStatus.status
                ? <Label variant="outline" status={jobStatus.status}>{jobStatus.label}</Label>
                : <Content component="small">{jobStatus.label}</Content>
              }
            </div>
          </FlexItem>

          <FlexItem>
            <Content component="small" style={{ opacity: 0.7 }}>Last updated</Content>
            <Content component="p" style={{ fontSize: '13px', margin: 0 }}>{modifiedDate}</Content>
          </FlexItem>
        </Flex>
      </CardBody>

      <CardFooter>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Button
              variant="link"
              style={{ padding: 0, fontSize: '16px', fontWeight: 600, color: 'var(--pf-t--global--color--status--success--default)' }}
              onClick={() => navigate(`/savings-planner/${plan.id}/statistics`)}
            >
              ${projected_savings.toLocaleString()}/yr
            </Button>
          </FlexItem>
          <FlexItem>
            <Label color="grey">{categoryLabels[category] ?? category}</Label>
          </FlexItem>
        </Flex>
      </CardFooter>
    </Card>
  )
}

export default function SavingsPlanner() {
  const [plans, setPlans]       = useState(mockPlans)
  const [selected, setSelected] = useState(new Set())

  // Toolbar
  const [variant, setVariant]                  = useState('basic')
  const [query, setQuery]                      = useState('')
  const [keyword, setKeyword]                  = useState('')
  const [filters, setFilters]                  = useState({ 'Automation status': '', Category: '' })
  const [automationStatusOpen, setAStatusOpen] = useState(false)
  const [categoryOpen, setCategoryOpen]        = useState(false)
  const [filterAttr, setFilterAttr]            = useState('Name')
  const [filterAttrOpen, setFilterAttrOpen]    = useState(false)

  // Sort
  const [sortField, setSortField]    = useState('Modified')
  const [sortFieldOpen, setSortFOpen]= useState(false)
  const [sortDir, setSortDir]        = useState('desc')

  // Pagination
  const [page, setPage]       = useState(1)
  const [perPage, setPerPage] = useState(10)

  const setFilter   = (key, val) => { setFilters((f) => ({ ...f, [key]: val })); setPage(1) }
  const clearFilter = (key)      => setFilters((f) => ({ ...f, [key]: '' }))
  const clearAll    = ()         => { setFilters({ 'Automation status': '', Category: '' }); setKeyword('') }
  const hasFilters  = keyword || Object.values(filters).some(Boolean)

  const toggleSelect = (id) => setSelected((s) => {
    const next = new Set(s)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const deletePlan = (id) => {
    setPlans((ps) => ps.filter((p) => p.id !== id))
    setSelected((s) => { const next = new Set(s); next.delete(id); return next })
  }

  const bulkDelete = () => {
    setPlans((ps) => ps.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  const filtered = useMemo(() => {
    let rows = plans
    if (keyword) {
      const kw = keyword.toLowerCase()
      rows = rows.filter((p) => p.name.toLowerCase().includes(kw))
    }
    if (filters['Automation status']) {
      const target = filters['Automation status'].toLowerCase().replace(' ', '_')
      rows = rows.filter((p) => (p.automation_status?.status ?? 'not_running') === target)
    }
    if (filters.Category) {
      const target = Object.entries(categoryLabels).find(([, v]) => v === filters.Category)?.[0]
      if (target) rows = rows.filter((p) => p.category === target)
    }

    return [...rows].sort((a, b) => {
      let cmp = 0
      if (sortField === 'Modified')          cmp = new Date(a.modified) - new Date(b.modified)
      if (sortField === 'Name')              cmp = a.name.localeCompare(b.name)
      if (sortField === 'Projected savings') cmp = a.projected_savings - b.projected_savings
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [plans, keyword, filters, sortField, sortDir])

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
      <PageHeader title="Savings Planner" />

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
                  onSelect={(_, val) => { setFilterAttr(val); setFilterAttrOpen(false) }}
                  onOpenChange={setFilterAttrOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} icon={<FilterIcon />} onClick={() => setFilterAttrOpen(!filterAttrOpen)} isExpanded={filterAttrOpen} aria-label="Select filter attribute">
                      {filterAttr}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {['Name', 'Automation status', 'Category'].map((c) => <SelectOption key={c} value={c}>{c}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarItem>

              {/* Name keyword */}
              <ToolbarFilter
                labels={keyword ? [keyword] : []}
                deleteLabel={() => setKeyword('')}
                deleteLabelGroup={() => setKeyword('')}
                categoryName="Name"
                showToolbarItem={filterAttr === 'Name'}
              >
                <SearchInput
                  aria-label="Filter by name"
                  placeholder="Filter by name"
                  value={keyword}
                  onChange={(_, v) => setKeyword(v)}
                  onClear={() => setKeyword('')}
                  style={{ minWidth: '220px' }}
                />
              </ToolbarFilter>

              {/* Automation status */}
              <ToolbarFilter
                labels={filters['Automation status'] ? [filters['Automation status']] : []}
                deleteLabel={() => clearFilter('Automation status')}
                deleteLabelGroup={() => clearFilter('Automation status')}
                categoryName="Automation status"
                showToolbarItem={filterAttr === 'Automation status'}
              >
                <Select
                  isOpen={automationStatusOpen}
                  onSelect={(_, val) => { setFilter('Automation status', val); setAStatusOpen(false) }}
                  onOpenChange={setAStatusOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setAStatusOpen(!automationStatusOpen)} isExpanded={automationStatusOpen} aria-label="Select automation status">
                      {filters['Automation status'] || 'Any status'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {automationStatusOptions.map((s) => <SelectOption key={s} value={s}>{s}</SelectOption>)}
                  </SelectList>
                </Select>
              </ToolbarFilter>

              {/* Category */}
              <ToolbarFilter
                labels={filters.Category ? [filters.Category] : []}
                deleteLabel={() => clearFilter('Category')}
                deleteLabelGroup={() => clearFilter('Category')}
                categoryName="Category"
                showToolbarItem={filterAttr === 'Category'}
              >
                <Select
                  isOpen={categoryOpen}
                  onSelect={(_, val) => { setFilter('Category', val); setCategoryOpen(false) }}
                  onOpenChange={setCategoryOpen}
                  toggle={(ref) => (
                    <MenuToggle ref={ref} onClick={() => setCategoryOpen(!categoryOpen)} isExpanded={categoryOpen} aria-label="Select category">
                      {filters.Category || 'Any category'}
                    </MenuToggle>
                  )}
                >
                  <SelectList>
                    {categoryOptions.map((c) => <SelectOption key={c} value={c}>{c}</SelectOption>)}
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
                placeholder='name ~ "patching" AND category = "security"'
                aria-label="Advanced filter query"
                style={{ width: '100%' }}
              />
            </ToolbarItem>
          )}

          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <Select
                isOpen={sortFieldOpen}
                selected={sortField}
                onSelect={(_, val) => { setSortField(val); setSortFOpen(false) }}
                onOpenChange={setSortFOpen}
                toggle={(ref) => (
                  <MenuToggle ref={ref} onClick={() => setSortFOpen(!sortFieldOpen)} isExpanded={sortFieldOpen} style={{ width: '160px' }}>
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

          {selected.size > 0 && (
            <ToolbarItem>
              <Button variant="plain" isDanger onClick={bulkDelete}>
                Delete ({selected.size})
              </Button>
            </ToolbarItem>
          )}

          <ToolbarItem>
            <Button variant="primary">Add plan</Button>
          </ToolbarItem>

          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Pagination {...paginationProps} isCompact />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <PageSection hasBodyWrapper={false}>
        <Gallery hasGutter minWidths={{ default: '307px' }}>
          {paginated.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selected.has(plan.id)}
              onSelect={toggleSelect}
              onDelete={deletePlan}
            />
          ))}
        </Gallery>
      </PageSection>

      <PageSection hasBodyWrapper={false}>
        <Pagination {...paginationProps} variant="bottom" />
      </PageSection>
    </>
  )
}
