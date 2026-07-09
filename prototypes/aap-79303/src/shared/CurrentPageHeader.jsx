/**
 * Faithful recreation of the current PageHeader component from the main app.
 * Uses the same border-top / border-bottom styling pattern.
 */
import { PageSection, Title, Content } from '@patternfly/react-core'

const styles = `
  .current-page-header-section {
    border-top: thin solid var(--pf-t--global--border--color--100);
    border-bottom: thin solid var(--pf-t--global--border--color--100);
    padding-top: 16px;
    padding-bottom: 16px;
    background-color: var(--pf-t--global--background--color--100);
  }
  .current-page-header-section h1 {
    font-size: var(--pf-t--global--font--size--heading--h1);
    font-weight: var(--pf-t--global--font--weight--heading--default);
  }
`

export function CurrentPageHeader({ title, description }) {
  return (
    <>
      <style>{styles}</style>
      <PageSection hasBodyWrapper={false} className="current-page-header-section">
        <Title headingLevel="h1">{title}</Title>
        {description && (
          <Content component="p" style={{ paddingTop: 4, opacity: 0.8 }}>
            {description}
          </Content>
        )}
      </PageSection>
    </>
  )
}
