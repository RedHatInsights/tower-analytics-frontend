import { PageSection, Title, Content, Label, LabelGroup } from '@patternfly/react-core'

const tagColors = {
  financial:   'grey',
  performance: 'blue',
  executive:   'green',
  savings:     'teal',
  operations:  'purple',
}

export function PageHeader({ title, description, tags, titleHeadingLevel = 'h1', titleSize = 'xl' }) {
  return (
    <PageSection hasBodyWrapper={false} style={{ padding: '16px 24px' }}>
      <Title headingLevel={titleHeadingLevel} size={titleSize} style={{ marginBottom: 4 }}>{title}</Title>
      {description && (
        <Content component="p" style={{ margin: 0, opacity: 0.8 }}>
          {description}
        </Content>
      )}
      {tags?.length > 0 && (
        <LabelGroup style={{ marginTop: 6 }}>
          {tags.map((tag) => (
            <Label key={tag} color={tagColors[tag] ?? 'grey'}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </Label>
          ))}
        </LabelGroup>
      )}
    </PageSection>
  )
}
