import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Button,
  List,
  ListItem,
  Divider,
  Content,
  Flex,
  FlexItem,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
} from '@patternfly/react-core'
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'
import { mockPlans, categoryLabels, frequencyLabels, manualTimeLabels, statusMap } from '../../data/savingsPlanner'

const formatMoney = (v) => `$${Math.round(v).toLocaleString()}`

function SavingsChart({ projections, isMoney }) {
  const metric = isMoney ? 'savings' : 'hours'
  const data   = projections.map((p) => ({
    ...p,
    hours: Math.round(p.savings / 15),
  }))
  const maxVal = Math.max(...data.map((p) => p[metric]), 1)
  const format = isMoney ? formatMoney : (v) => `${v}h`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }}>
      {data.map((p) => {
        const pct = (p[metric] / maxVal) * 100
        return (
          <div key={p.period} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '70px', textAlign: 'right', fontSize: '13px', flexShrink: 0 }}>
              {p.period}
            </div>
            <div style={{ flex: 1, height: '22px', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--pf-t--global--color--status--success--default)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
            </div>
            <div style={{ width: '80px', fontSize: '13px', fontWeight: 500 }}>
              {format(p[metric])}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function SavingsPlannerDetail() {
  const { id }       = useParams()
  const location     = useLocation()
  const navigate     = useNavigate()
  const [isMoney, setIsMoney] = useState(true)

  const plan = mockPlans.find((p) => p.id === parseInt(id))

  if (!plan) {
    return (
      <PageSection>
        <Content component="p">Plan not found.</Content>
        <Button variant="link" onClick={() => navigate('/savings-planner')}>Back to Savings Planner</Button>
      </PageSection>
    )
  }

  const isStatistics  = location.pathname.endsWith('/statistics')
  const activeKey     = isStatistics ? 'statistics' : 'details'
  const jobStatus     = statusMap[plan.automation_status?.status] ?? statusMap.not_running
  const totalSavings  = plan.projections[plan.projections.length - 1]?.savings ?? 0
  const totalHours    = Math.round(totalSavings / 15)

  return (
    <>
      {/* ── Breadcrumb + Title + Tabs ── */}
      <div>
        <div style={{ padding: '16px 24px 0' }}>
          <Breadcrumb style={{ marginBottom: '4px' }}>
            <BreadcrumbItem>
              <Link to="/savings-planner">Savings Planner</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{plan.name}</BreadcrumbItem>
          </Breadcrumb>
          <Title headingLevel="h2" size="xl" style={{ marginBottom: '8px' }}>{plan.name}</Title>
        </div>
        <Tabs
          activeKey={activeKey}
          onSelect={(_, key) => {
            if (key === 'details')    navigate(`/savings-planner/${id}`)
            if (key === 'statistics') navigate(`/savings-planner/${id}/statistics`)
          }}
        >
          {/* ── Details Tab ── */}
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>}>
            <PageSection hasBodyWrapper={false} style={{ paddingTop: '24px' }}>
              <DescriptionList isHorizontal columnModifier={{ default: '3Col' }}>
                <DescriptionListGroup>
                  <DescriptionListTerm>Name</DescriptionListTerm>
                  <DescriptionListDescription>{plan.name}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Automation type</DescriptionListTerm>
                  <DescriptionListDescription>{categoryLabels[plan.category] ?? plan.category}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>{plan.description || '—'}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Manual time</DescriptionListTerm>
                  <DescriptionListDescription>{manualTimeLabels[plan.manual_time] ?? plan.manual_time ?? '—'}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Run on hosts</DescriptionListTerm>
                  <DescriptionListDescription>{plan.hosts ?? '—'}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Frequency</DescriptionListTerm>
                  <DescriptionListDescription>{frequencyLabels[plan.frequency_period] ?? plan.frequency_period}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Template</DescriptionListTerm>
                  <DescriptionListDescription>
                    {plan.template_details
                      ? <Button variant="link" style={{ padding: 0 }}>{plan.template_details.name}</Button>
                      : '—'
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Last job status</DescriptionListTerm>
                  <DescriptionListDescription>
                    {jobStatus.status
                      ? <Label variant="outline" status={jobStatus.status}>{jobStatus.label}</Label>
                      : <span>{jobStatus.label}</span>
                    }
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Last updated</DescriptionListTerm>
                  <DescriptionListDescription>
                    {new Date(plan.modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>

              {plan.tasks?.length > 0 && (
                <>
                  <Divider style={{ margin: '24px 0' }} />
                  <Title headingLevel="h3" size="md" style={{ marginBottom: '12px' }}>Tasks</Title>
                  <List>
                    {plan.tasks.map((task, i) => (
                      <ListItem key={i}>{task}</ListItem>
                    ))}
                  </List>
                </>
              )}

              <div style={{ marginTop: '32px', display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={() => navigate(`/savings-planner/${id}/edit`)}>Edit plan</Button>
                <Button variant="secondary" isDanger>Delete plan</Button>
              </div>
            </PageSection>
          </Tab>

          {/* ── Statistics Tab ── */}
          <Tab eventKey="statistics" title={<TabTitleText>Statistics</TabTitleText>}>
            <PageSection hasBodyWrapper={false} style={{ paddingTop: '24px' }}>
              <Grid hasGutter>
                <GridItem span={9}>
                  <Card isPlain>
                    <CardHeader>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ width: '100%' }}>
                        <FlexItem>
                          <CardTitle>{plan.name}</CardTitle>
                        </FlexItem>
                        <FlexItem>
                          <ToggleGroup aria-label="Savings view toggle">
                            <ToggleGroupItem text="Money" isSelected={isMoney}  onChange={() => setIsMoney(true)} />
                            <ToggleGroupItem text="Time"  isSelected={!isMoney} onChange={() => setIsMoney(false)} />
                          </ToggleGroup>
                        </FlexItem>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <SavingsChart projections={plan.projections} isMoney={isMoney} />
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
                            {isMoney ? formatMoney(totalSavings) : `${totalHours}h`}
                          </Title>
                          <Content component="small" style={{ color: 'var(--pf-t--global--color--nonstatus--gray--default)' }}>
                            Projected over 3 years
                          </Content>
                        </CardBody>
                      </Card>
                    </FlexItem>

                    <FlexItem>
                      <Button variant="link" icon={<InfoCircleIcon />} onClick={() => {}}>
                        Automation formula
                      </Button>
                    </FlexItem>
                  </Flex>
                </GridItem>
              </Grid>
            </PageSection>
          </Tab>
        </Tabs>
      </div>
    </>
  )
}
