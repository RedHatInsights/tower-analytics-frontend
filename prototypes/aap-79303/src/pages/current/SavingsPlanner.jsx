import {
  PageSection,
  Card,
  CardBody,
  CardTitle,
  CardFooter,
  Gallery,
  Button,
  Label,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Progress,
  ProgressSize,
} from '@patternfly/react-core'
import { CurrentPageHeader } from '../../shared/CurrentPageHeader'

const plans = [
  {
    id: 1,
    name: 'Server Patching Automation',
    description: 'Automate monthly server patching across 200 hosts.',
    tasks: 8,
    templates: 3,
    manualTime: 40,
    automatedTime: 5,
    savings: 35,
    currency: 'USD',
    totalSavings: 14700,
  },
  {
    id: 2,
    name: 'User Provisioning Workflow',
    description: 'Automate user onboarding and offboarding processes.',
    tasks: 5,
    templates: 2,
    manualTime: 20,
    automatedTime: 2,
    savings: 18,
    currency: 'USD',
    totalSavings: 7560,
  },
  {
    id: 3,
    name: 'Network Config Management',
    description: 'Automate network configuration pushes across all routers.',
    tasks: 12,
    templates: 5,
    manualTime: 60,
    automatedTime: 8,
    savings: 52,
    currency: 'USD',
    totalSavings: 21840,
  },
  {
    id: 4,
    name: 'Security Compliance Scans',
    description: 'Schedule and automate weekly compliance scans.',
    tasks: 6,
    templates: 2,
    manualTime: 16,
    automatedTime: 1,
    savings: 15,
    currency: 'USD',
    totalSavings: 6300,
  },
]

function PlanCard({ plan }) {
  const automationPct = Math.round((1 - plan.automatedTime / plan.manualTime) * 100)
  return (
    <Card>
      <CardTitle>{plan.name}</CardTitle>
      <CardBody>
        <p style={{ fontSize: '13px', color: '#6a6e73', marginBottom: '16px' }}>{plan.description}</p>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '13px' }}>
          <span><strong>{plan.tasks}</strong> tasks</span>
          <span><strong>{plan.templates}</strong> templates</span>
        </div>
        <p style={{ fontSize: '12px', color: '#6a6e73', marginBottom: '4px' }}>Time savings</p>
        <Progress
          value={automationPct}
          size={ProgressSize.sm}
          title={`${automationPct}% time saved`}
          style={{ marginBottom: '8px' }}
        />
        <p style={{ fontSize: '12px', color: '#6a6e73' }}>{plan.manualTime}h manual → {plan.automatedTime}h automated</p>
      </CardBody>
      <CardFooter>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#3e8635' }}>
            ${plan.totalSavings.toLocaleString()} saved/yr
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" size="sm">Edit</Button>
            <Button variant="link" size="sm">Delete</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function CurrentSavingsPlanner() {
  return (
    <>
      <CurrentPageHeader title="Savings Planner" />
      <Toolbar style={{ borderBottom: 'thin solid var(--pf-t--global--border--color--100)' }}>
        <ToolbarContent>
          <ToolbarItem align={{ default: 'alignEnd' }}>
            <Button variant="primary">Add plan</Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <PageSection hasBodyWrapper={false}>
        <Gallery hasGutter minWidths={{ default: '300px' }}>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Gallery>
      </PageSection>
    </>
  )
}
