import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Nav,
  NavList,
  NavItem,
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

const navItems = [
  { name: 'PROTOTYPE INTRODUCTION', path: '/' },
  { name: 'Organization Statistics', path: '/organization-statistics' },
  { name: 'Job Explorer', path: '/job-explorer' },
  { name: 'Clusters', path: '/clusters' },
  { name: 'Reports', path: '/reports' },
  { name: 'Savings Planner', path: '/savings-planner' },
  { name: 'Notifications', path: '/notifications' },
]

export function AppNavigation({ children }) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
          <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>
            Ansible Automation Platform
          </span>
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
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <NavItem key={item.path} isActive={isActive}>
                  <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.name}
                  </Link>
                </NavItem>
              )
            })}
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
