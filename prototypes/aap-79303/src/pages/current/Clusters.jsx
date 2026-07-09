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
} from '@patternfly/react-core'
import { CurrentPageHeader } from '../../shared/CurrentPageHeader'
import { DateRangeSelect } from '../../shared/MockToolbar'

const mockTemplates = [
  { name: 'Deploy Web App', count: 312, success: 287, failed: 25 },
  { name: 'Patching Workflow', count: 204, success: 191, failed: 13 },
  { name: 'Provision Servers', count: 187, success: 180, failed: 7 },
  { name: 'Security Hardening', count: 143, success: 138, failed: 5 },
  { name: 'Backup and Restore', count: 98, success: 94, failed: 4 },
]

const mockModules = [
  { name: 'ansible.builtin.copy', count: 4821 },
  { name: 'ansible.builtin.template', count: 3904 },
  { name: 'ansible.builtin.service', count: 2771 },
  { name: 'ansible.builtin.yum', count: 2340 },
  { name: 'ansible.builtin.command', count: 1987 },
]

function BarChartPlaceholder() {
  const bars = [
    { label: 'Jun 3', success: 78, failed: 12 },
    { label: 'Jun 4', success: 91, failed: 8 },
    { label: 'Jun 5', success: 54, failed: 21 },
    { label: 'Jun 6', success: 110, failed: 5 },
    { label: 'Jun 7', success: 88, failed: 14 },
    { label: 'Jun 8', success: 43, failed: 9 },
    { label: 'Jun 9', success: 67, failed: 11 },
    { label: 'Jun 10', success: 95, failed: 7 },
    { label: 'Jun 11', success: 102, failed: 18 },
    { label: 'Jun 12', success: 76, failed: 6 },
    { label: 'Jun 13', success: 88, failed: 10 },
    { label: 'Jun 14', success: 114, failed: 4 },
  ]
  const maxVal = Math.max(...bars.map(b => b.success + b.failed))

  return (
    <div style={{ padding: '16px 0', height: '260px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, background: '#06c', display: 'inline-block' }} /> Successful
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 12, height: 12, background: '#c9190b', display: 'inline-block' }} /> Failed
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        {bars.map((bar) => (
          <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ height: `${(bar.failed / maxVal) * 160}px`, background: '#c9190b', minHeight: 2 }} />
              <div style={{ height: `${(bar.success / maxVal) * 160}px`, background: '#06c', minHeight: 2 }} />
            </div>
            <span style={{ fontSize: '11px', color: '#6a6e73', whiteSpace: 'nowrap' }}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TemplateRow({ item }) {
  const pct = Math.round((item.success / item.count) * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--pf-t--global--border--color--100)' }}>
      <span style={{ flex: 1, fontSize: '14px' }}>{item.name}</span>
      <span style={{ fontSize: '13px', color: '#6a6e73', minWidth: 50, textAlign: 'right' }}>{item.count} runs</span>
      <span style={{ fontSize: '13px', color: pct > 90 ? '#3e8635' : '#c9190b', minWidth: 40, textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

export default function CurrentClusters() {
  return (
    <>
      <CurrentPageHeader title="Clusters" />
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
            <Card>
              <CardTitle><h2>Job status</h2></CardTitle>
              <CardBody>
                <BarChartPlaceholder />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardTitle><h2>Top workflows</h2></CardTitle>
              <CardBody>
                {mockTemplates.map(t => <TemplateRow key={t.name} item={t} />)}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardTitle><h2>Top templates</h2></CardTitle>
              <CardBody>
                {mockTemplates.slice().reverse().map(t => <TemplateRow key={t.name} item={t} />)}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card>
              <CardTitle><h2>Top modules</h2></CardTitle>
              <CardBody>
                {mockModules.map((m, i) => (
                  <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--pf-t--global--border--color--100)', fontSize: '14px' }}>
                    <span>{m.name}</span>
                    <span style={{ color: '#6a6e73' }}>{m.count.toLocaleString()}</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  )
}
