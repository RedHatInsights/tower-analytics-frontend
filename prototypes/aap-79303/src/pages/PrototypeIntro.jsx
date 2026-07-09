import {
  Card,
  CardBody,
  CardTitle,
  Gallery,
  PageSection,
  Title,
  List,
  ListItem,
  Content,
  Flex,
  FlexItem,
  Button,
} from '@patternfly/react-core'
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon'

function PrototypeIntro() {
  return (
    <>
      <PageSection>
        <Card style={{ backgroundColor: '#0066cc', color: 'white', borderRadius: '8px' }}>
          <CardBody style={{ padding: '48px' }}>
            <Title headingLevel="h1" size="2xl" style={{ color: '#fff', marginBottom: '12px' }}>
              Welcome to the Ansible UX Team's Automation Analytics Prototype
            </Title>
            <Content component="p" style={{ color: '#ffffff', fontSize: '16px', marginBottom: '16px', maxWidth: '1500px' }}>
              This prototype explores UX improvements to the Automation Analytics experience,
              including navigation and page header changes. Use the navigation on the left to
              compare the current experience against the proposed designs.
            </Content>
            <Flex gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>Related Jira:</span>
              </FlexItem>
              <FlexItem>
                <Button
                  variant="link"
                  component="a"
                  href="https://issues.redhat.com/browse/AAP-79303"
                  target="_blank"
                  icon={<ExternalLinkAltIcon style={{ color: '#ffffff' }} />}
                  iconPosition="end"
                  style={{ color: '#ffffff', padding: 0 }}
                >
                  AAP-79303
                </Button>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </PageSection>

      <PageSection>
        <Card isPlain style={{
          border: '1px dashed #8a8d90',
          borderRadius: '8px',
          backgroundColor: '#f0f0f0',
          marginBottom: '32px'
        }}>
          <CardBody>
            <Title headingLevel="h3" size="md" style={{ marginBottom: '12px' }}>
              Important Notes
            </Title>
            <List>
              <ListItem>
                This prototype shows the intended experience for Automation Analytics UX improvements
              </ListItem>
              <ListItem>
                Mock data and placeholder screens are used throughout
              </ListItem>
              <ListItem>
                Once implementation begins, the UI framework has pre-baked functionality so it may look slightly different, but the functionality should remain the same
              </ListItem>
            </List>
          </CardBody>
        </Card>

        <Gallery hasGutter minWidths={{ default: '300px' }}>
          <Card>
            <CardTitle>How to Use This Prototype</CardTitle>
            <CardBody>
              <List>
                <ListItem>
                  <strong>Automation Analytics — Current:</strong> The existing experience as it appears in production today
                </ListItem>
                <ListItem>
                  <strong>Automation Analytics — Proposed:</strong> The redesigned experience with UX improvements
                </ListItem>
              </List>
            </CardBody>
          </Card>

          <Card>
            <CardTitle>Key Changes Being Explored</CardTitle>
            <CardBody>
              <List>
                <ListItem>Page header styling and border treatment</ListItem>
                <ListItem>Navigation structure improvements</ListItem>
                <ListItem>Content spacing and visual hierarchy</ListItem>
              </List>
            </CardBody>
          </Card>
        </Gallery>
      </PageSection>
    </>
  )
}

export default PrototypeIntro
