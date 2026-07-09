import {
  PageSection,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Tabs,
  Tab,
  Alert,
  AlertActionLink,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core'
import { useState } from 'react'
import { CurrentPageHeader } from '../../shared/CurrentPageHeader'
import { DateRangeSelect } from '../../shared/MockToolbar'

const orgs = ['Platform Engineering', 'Security Ops', 'Infrastructure', 'Database Team', 'Network Ops', 'IT Operations']
const colors = ['#06c', '#009596', '#f4c145', '#ec7a08', '#c9190b', '#3e8635']

function GroupedBarPlaceholder({ activeTab }) {
  const weeks = ['May 19', 'May 26', 'Jun 2', 'Jun 9']
  const data = weeks.map((w) => ({
    week: w,
    values: orgs.map((_, i) => Math.floor(Math.random() * 80 + 20)),
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
            <span style={{ fontSize: '11px', color: '#6a6e73' }}>{group.week}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutPlaceholder({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '16px 0' }}>
      <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
        <svg viewBox="0 0 160 160" width="160" height="160">
          {orgs.map((_, i) => {
            const startAngle = (i / orgs.length) * 2 * Math.PI - Math.PI / 2
            const endAngle = ((i + 1) / orgs.length) * 2 * Math.PI - Math.PI / 2
            const x1 = 80 + 60 * Math.cos(startAngle)
            const y1 = 80 + 60 * Math.sin(startAngle)
            const x2 = 80 + 60 * Math.cos(endAngle)
            const y2 = 80 + 60 * Math.sin(endAngle)
            const ix1 = 80 + 35 * Math.cos(startAngle)
            const iy1 = 80 + 35 * Math.sin(startAngle)
            const ix2 = 80 + 35 * Math.cos(endAngle)
            const iy2 = 80 + 35 * Math.sin(endAngle)
            return (
              <path
                key={i}
                d={`M ${ix1} ${iy1} L ${x1} ${y1} A 60 60 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A 35 35 0 0 0 ${ix1} ${iy1}`}
                fill={colors[i]}
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

export default function CurrentOrganizationStatistics() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <CurrentPageHeader title="Organization Statistics" />
      <Toolbar style={{ borderBottom: 'thin solid var(--pf-t--global--border--color--100)' }}>
        <ToolbarContent>
          <ToolbarItem>
            <DateRangeSelect />
          </ToolbarItem>
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
                  <AlertActionLink><a href="#">Hosts by organization report</a></AlertActionLink>
                  <AlertActionLink><a href="#">Jobs/Tasks by organization report</a></AlertActionLink>
                </>
              }
            >
              The organization statistics page has been converted to a set of reports. Please use our new, more full-featured reports by following the links below.
            </Alert>
          </GridItem>
          <GridItem span={12}>
            <Card>
              <Tabs activeKey={activeTab} onSelect={(_, k) => setActiveTab(k)}>
                <Tab eventKey={0} title="Jobs" />
                <Tab eventKey={1} title="Hosts" />
              </Tabs>
              <CardBody>
                <GroupedBarPlaceholder activeTab={activeTab} />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card>
              <CardTitle><h2>Job Runs by Organization</h2></CardTitle>
              <CardBody>
                <DonutPlaceholder label="Job Runs" />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card>
              <CardTitle><h2>Usage by Organization (Tasks)</h2></CardTitle>
              <CardBody>
                <DonutPlaceholder label="Tasks" />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  )
}
