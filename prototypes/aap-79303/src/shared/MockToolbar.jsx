import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  SearchInput,
  Button,
} from '@patternfly/react-core'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import { useState } from 'react'

export function MockToolbar({ filters = [], showSearch = true, actions }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selected, setSelected] = useState(filters[0]?.label ?? 'Name')

  return (
    <Toolbar style={{ borderBottom: 'thin solid var(--pf-t--global--border--color--100)' }}>
      <ToolbarContent>
        <ToolbarItem>
          <Select
            isOpen={isFilterOpen}
            onSelect={(_, val) => { setSelected(val); setIsFilterOpen(false) }}
            onOpenChange={setIsFilterOpen}
            toggle={(ref) => (
              <MenuToggle ref={ref} onClick={() => setIsFilterOpen(!isFilterOpen)} isExpanded={isFilterOpen} icon={<FilterIcon />}>
                {selected}
              </MenuToggle>
            )}
          >
            <SelectList>
              {filters.map((f) => (
                <SelectOption key={f.key} value={f.label}>{f.label}</SelectOption>
              ))}
            </SelectList>
          </Select>
        </ToolbarItem>
        {showSearch && (
          <ToolbarItem>
            <SearchInput
              placeholder={`Filter by ${selected.toLowerCase()}`}
              value={searchValue}
              onChange={(_, v) => setSearchValue(v)}
              onClear={() => setSearchValue('')}
              style={{ minWidth: '220px' }}
            />
          </ToolbarItem>
        )}
        {actions && (
          <ToolbarItem align={{ default: 'alignEnd' }}>
            {actions}
          </ToolbarItem>
        )}
      </ToolbarContent>
    </Toolbar>
  )
}

export function DateRangeSelect() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState('Past 2 weeks')
  const options = ['Past week', 'Past 2 weeks', 'Past month', 'Past 3 months', 'Custom range']

  return (
    <Select
      isOpen={isOpen}
      onSelect={(_, val) => { setSelected(val); setIsOpen(false) }}
      onOpenChange={setIsOpen}
      toggle={(ref) => (
        <MenuToggle ref={ref} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen}>
          {selected}
        </MenuToggle>
      )}
    >
      <SelectList>
        {options.map((o) => <SelectOption key={o} value={o}>{o}</SelectOption>)}
      </SelectList>
    </Select>
  )
}
