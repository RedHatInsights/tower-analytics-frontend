import { Link, useParams } from 'react-router-dom'
import {
  PageSection,
  Breadcrumb,
  BreadcrumbItem,
  Title,
  Label,
  LabelGroup,
  Tooltip,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core'
import AutomationCalculator from '../AutomationCalculator'

const TAGS = {
  operations:   { name: 'Operations',   description: 'Useful to engineers who manage day-to-day Ansible operations.' },
  executive:    { name: 'Executive',    description: 'Useful to executives who monitor Ansible operations across the company.' },
  savings:      { name: 'Savings',      description: 'Provides information on cost savings from automation.' },
  'job-runs':   { name: 'Job runs',     description: 'Tracks job execution data over time.' },
  'time-series':{ name: 'Time series',  description: 'Displays data as a time series for trend analysis.' },
  organization: { name: 'Organization', description: 'Breaks data down by organization.' },
  hosts:        { name: 'Hosts',        description: 'Provides information about managed hosts.' },
  modules:      { name: 'Modules',      description: 'Tracks Ansible module usage.' },
}

const reportMeta = {
  'job-run-rate': {
    name: 'Job Run Rate',
    description: 'Track the rate of job runs across your clusters over time.',
    tags: ['operations', 'job-runs', 'time-series'],
    component: null,
  },
  'templates-by-org': {
    name: 'Templates by Organization',
    description: 'See how templates are distributed across organizations.',
    tags: ['executive', 'organization'],
    component: null,
  },
  'hosts-by-org': {
    name: 'Hosts by Organization',
    description: 'View the number of managed hosts per organization.',
    tags: ['executive', 'organization', 'hosts'],
    component: null,
  },
  'jobs-tasks-by-org': {
    name: 'Jobs and Tasks by Organization',
    description: 'Analyze job and task usage broken down by organization.',
    tags: ['executive', 'organization', 'job-runs'],
    component: null,
  },
  'module-usage': {
    name: 'Module Usage',
    description: 'Track which Ansible modules are most frequently used.',
    tags: ['operations', 'modules'],
    component: null,
  },
  'automation-calculator': {
    name: 'Automation Calculator',
    description: 'The calculated savings of the job templates running across the company in comparison to the cost of completing these jobs manually. You can use this report to get an idea of the ROI from your automation, as well as identify which templates are contributing to this savings the most.',
    tags: ['savings'],
    component: AutomationCalculator,
  },
}

function ReportTags({ tags }) {
  if (!tags?.length) return null
  return (
    <LabelGroup style={{ marginTop: 6 }}>
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

function ReportPlaceholder() {
  return (
    <PageSection>
      <EmptyState headingLevel="h2" titleText="Coming soon">
        <EmptyStateBody>
          This report is being built out in the prototype.
        </EmptyStateBody>
      </EmptyState>
    </PageSection>
  )
}

export default function ReportDetail() {
  const { slug }   = useParams()
  const meta       = reportMeta[slug]
  const name       = meta?.name ?? slug
  const ReportComponent = meta?.component

  return (
    <>
      {/* ── Breadcrumb + Title ── */}
      <div style={{ padding: '16px 24px 12px' }}>
        <Breadcrumb style={{ marginBottom: '4px' }}>
          <BreadcrumbItem>
            <Link to="/reports">Reports</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{name}</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h2" size="xl" style={{ marginBottom: 4 }}>{name}</Title>
        {meta?.description && (
          <p style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}>{meta.description}</p>
        )}
        <ReportTags tags={meta?.tags} />
      </div>

      {/* ── Report content ── */}
      {ReportComponent
        ? <ReportComponent embedded />
        : <ReportPlaceholder />
      }
    </>
  )
}
