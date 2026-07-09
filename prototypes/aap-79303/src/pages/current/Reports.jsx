import {
  PageSection,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Gallery,
  Label,
  Button,
  Divider,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
} from '@patternfly/react-core'
import AngleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-left-icon'
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon'
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon'
import { useState } from 'react'
import { CurrentPageHeader } from '../../shared/CurrentPageHeader'

const reports = [
  { slug: 'job-run-rate', name: 'Job Run Rate', description: 'Track the rate of job runs across your clusters over time.', tags: ['performance'] },
  { slug: 'templates-by-org', name: 'Templates by Organization', description: 'See how templates are distributed across organizations.', tags: ['executive'] },
  { slug: 'hosts-by-org', name: 'Hosts by Organization', description: 'View the number of managed hosts per organization.', tags: ['executive'] },
  { slug: 'jobs-tasks-by-org', name: 'Jobs and Tasks by Organization', description: 'Analyze job and task usage broken down by organization.', tags: ['executive'] },
  { slug: 'module-usage', name: 'Module Usage', description: 'Track which Ansible modules are most frequently used.', tags: ['performance'] },
  { slug: 'automation-calculator', name: 'Automation Calculator', description: 'Calculate cost savings from automation.', tags: ['financial'] },
]

const tagColors = {
  performance: 'blue',
  executive: 'green',
  financial: 'gold',
}

function MiniBarChart() {
  const vals = [40, 65, 55, 80, 70, 90, 75]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80, padding: '8px 0' }}>
      {vals.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${v}%`, background: '#06c', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
      ))}
    </div>
  )
}

export default function CurrentReports() {
  const [selected, setSelected] = useState(reports[0].slug)
  const [isOpen, setIsOpen] = useState(false)
  const selectedReport = reports.find(r => r.slug === selected) ?? reports[0]
  const idx = reports.indexOf(selectedReport)

  return (
    <>
      <CurrentPageHeader title="Reports" />
      <Toolbar style={{ borderBottom: 'thin solid var(--pf-t--global--border--color--100)' }}>
        <ToolbarContent>
          <ToolbarItem>
            <span style={{ fontSize: '14px', color: '#6a6e73' }}>Showing {reports.length} reports</span>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <PageSection hasBodyWrapper={false}>
        {/* Selected report preview card */}
        <Card isCompact style={{ maxWidth: '100%', marginBottom: '25px' }}>
          <CardHeader
            actions={{
              actions: (
                <>
                  {selectedReport.tags.map((tag) => (
                    <Tooltip key={tag} content={tag}>
                      <Label color={tagColors[tag] ?? 'blue'}>{tag}</Label>
                    </Tooltip>
                  ))}
                  <Button
                    icon={<AngleLeftIcon />}
                    variant="plain"
                    aria-label="Previous report"
                    isDisabled={idx === 0}
                    onClick={() => setSelected(reports[idx - 1].slug)}
                  />
                  <Dropdown
                    isPlain
                    onSelect={() => setIsOpen(false)}
                    toggle={(ref) => (
                      <MenuToggle
                        ref={ref}
                        onClick={() => setIsOpen(!isOpen)}
                        isExpanded={isOpen}
                        icon={<CaretDownIcon />}
                        style={{ color: 'var(--pf-t--global--text--color--100)' }}
                      >
                        {selectedReport.name}
                      </MenuToggle>
                    )}
                    isOpen={isOpen}
                  >
                    <DropdownList>
                      {reports.map((r) => (
                        <DropdownItem key={r.slug} onClick={() => { setSelected(r.slug); setIsOpen(false) }}>
                          {r.name}
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  </Dropdown>
                  <Button
                    icon={<AngleRightIcon />}
                    variant="plain"
                    aria-label="Next report"
                    isDisabled={idx >= reports.length - 1}
                    onClick={() => setSelected(reports[idx + 1].slug)}
                  />
                </>
              ),
            }}
            style={{ paddingTop: '16px', paddingBottom: '16px', paddingRight: 0 }}
          >
            <CardTitle>
              <a href="#" style={{ color: 'var(--pf-t--global--color--brand--default)' }}>
                {selectedReport.name}
              </a>
            </CardTitle>
          </CardHeader>
          <Divider />
          <CardBody>
            <MiniBarChart />
            <p style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>{selectedReport.description}</p>
          </CardBody>
          <CardFooter style={{ paddingBottom: '16px' }}>
            <a href="#" style={{ float: 'right', color: 'var(--pf-t--global--color--brand--default)' }}>
              View full report
            </a>
          </CardFooter>
        </Card>

        {/* Gallery of all report cards */}
        <Gallery hasGutter minWidths={{ sm: '307px', md: '307px', lg: '307px' }}>
          {reports.map((report) => (
            <Card
              key={report.slug}
              isClickable
              isSelected={selected === report.slug}
              onClick={() => setSelected(report.slug)}
              style={{ cursor: 'pointer' }}
            >
              <CardTitle>
                <a href="#" style={{ color: 'var(--pf-t--global--color--brand--default)' }} onClick={(e) => { e.preventDefault(); setSelected(report.slug) }}>
                  {report.name}
                </a>
              </CardTitle>
              <CardBody>
                <p style={{ fontSize: '13px', color: '#6a6e73' }}>{report.description}</p>
              </CardBody>
              <CardFooter>
                {report.tags.map((tag) => (
                  <Label key={tag} color={tagColors[tag] ?? 'blue'} style={{ marginRight: '4px' }}>{tag}</Label>
                ))}
              </CardFooter>
            </Card>
          ))}
        </Gallery>
      </PageSection>
    </>
  )
}
