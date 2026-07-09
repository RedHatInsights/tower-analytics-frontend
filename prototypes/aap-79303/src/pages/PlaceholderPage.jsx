import {
  PageSection,
  Title,
  Card,
  CardBody,
  Content,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core'

function PlaceholderPage({ title, variant = 'current' }) {
  const isProposed = variant === 'proposed'

  return (
    <>
      <PageSection>
        <Title headingLevel="h1">{title}</Title>
      </PageSection>
      <PageSection>
        <Card>
          <CardBody>
            <EmptyState>
              <Title headingLevel="h2" size="lg">
                {isProposed ? '✦ Proposed Design' : 'Current Design'}
              </Title>
              <EmptyStateBody>
                {isProposed
                  ? `This screen will show the proposed redesign of ${title}.`
                  : `This screen mirrors the current production experience for ${title}.`}
              </EmptyStateBody>
            </EmptyState>
          </CardBody>
        </Card>
      </PageSection>
    </>
  )
}

export default PlaceholderPage
