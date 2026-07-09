import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Nav,
  NavList,
  NavItem,
  NavExpandable,
  Page,
  PageSidebar,
  PageSidebarBody,
  Masthead,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  MastheadToggle,
  PageToggleButton,
} from '@patternfly/react-core'
import BarsIcon from '@patternfly/react-icons/dist/esm/icons/bars-icon'

const analyticsPages = [
  { name: 'Reports', path: '/reports' },
  { name: 'Savings Planner', path: '/savings-planner' },
  { name: 'Automation Calculator', path: '/automation-calculator' },
  { name: 'Organization Statistics', path: '/organization-statistics' },
  { name: 'Job Explorer', path: '/job-explorer' },
  { name: 'Clusters', path: '/clusters' },
  { name: 'Notifications', path: '/notifications' },
]

export function AppNavigation({ children }) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isGroupExpanded, setIsGroupExpanded] = useState(true)

  const isGroupActive = analyticsPages.some(
    (p) => location.pathname === p.path || location.pathname.startsWith(p.path + '/')
  )

  const Header = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <img
            src={`${import.meta.env.BASE_URL}aap-logo.png`}
            alt="Red Hat Ansible Automation Platform"
            style={{ height: '36px' }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent />
    </Masthead>
  )

  const Sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        <Nav aria-label="Navigation">
          <NavList>
            <NavExpandable
              title="Automation Analytics"
              isExpanded={isGroupExpanded}
              onExpand={(_, expanded) => setIsGroupExpanded(expanded)}
              isActive={isGroupActive}
            >
              {analyticsPages.map((page) => {
                const isActive =
                  location.pathname === page.path ||
                  location.pathname.startsWith(page.path + '/')
                return (
                  <NavItem key={page.path} isActive={isActive}>
                    <Link to={page.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {page.name}
                    </Link>
                  </NavItem>
                )
              })}
            </NavExpandable>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  )

  return (
    <Page masthead={Header} sidebar={Sidebar}>
      {children}
    </Page>
  )
}
