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
  { name: 'Organization Statistics', path: '/organization-statistics' },
  { name: 'Job Explorer', path: '/job-explorer' },
  { name: 'Clusters', path: '/clusters' },
  { name: 'Reports', path: '/reports' },
  { name: 'Savings Planner', path: '/savings-planner' },
  { name: 'Notifications', path: '/notifications' },
]

function NavLink({ name, basePath }) {
  const location = useLocation()
  const path = `${basePath}${analyticsPages.find(p => p.name === name)?.path ?? ''}`
  const isActive = location.pathname === path || location.pathname.startsWith(path + '/')
  return (
    <NavItem isActive={isActive}>
      <Link to={path} style={{ color: 'inherit', textDecoration: 'none' }}>
        {name}
      </Link>
    </NavItem>
  )
}

export function AppNavigation({ children }) {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const topNavItems = [
    { name: 'PROTOTYPE INTRODUCTION', path: '/' },
  ]

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
            {topNavItems.map((item) => (
              <NavItem
                key={item.path}
                isActive={location.pathname === item.path}
              >
                <Link to={item.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {item.name}
                </Link>
              </NavItem>
            ))}

            <NavExpandable
              title="Automation Analytics — Current"
              isExpanded
              isActive={location.pathname.startsWith('/current/')}
            >
              {analyticsPages.map((page) => {
                const path = `/current${page.path}`
                const isActive = location.pathname === path || location.pathname.startsWith(path + '/')
                return (
                  <NavItem key={path} isActive={isActive}>
                    <Link to={path} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {page.name}
                    </Link>
                  </NavItem>
                )
              })}
            </NavExpandable>

            <NavExpandable
              title="Automation Analytics — Proposed"
              isExpanded
              isActive={location.pathname.startsWith('/proposed/')}
            >
              {analyticsPages.map((page) => {
                const path = `/proposed${page.path}`
                const isActive = location.pathname === path || location.pathname.startsWith(path + '/')
                return (
                  <NavItem key={path} isActive={isActive}>
                    <Link to={path} style={{ color: 'inherit', textDecoration: 'none' }}>
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
