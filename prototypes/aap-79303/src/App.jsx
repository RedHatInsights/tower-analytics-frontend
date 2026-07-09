import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import '@patternfly/react-core/dist/styles/base.css'
import { AppNavigation } from './Navigation'
import PrototypeIntro from './pages/PrototypeIntro'
import PlaceholderPage from './pages/PlaceholderPage'

// Current pages (faithful recreation of the existing app)
import CurrentClusters from './pages/current/Clusters'
import CurrentJobExplorer from './pages/current/JobExplorer'
import CurrentOrganizationStatistics from './pages/current/OrganizationStatistics'
import CurrentReports from './pages/current/Reports'
import CurrentSavingsPlanner from './pages/current/SavingsPlanner'
import CurrentNotifications from './pages/current/Notifications'

const basename = import.meta.env.BASE_URL

function App() {
  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppNavigation>
        <Routes>
          <Route path="/" element={<PrototypeIntro />} />

          {/* Current experience */}
          <Route path="/current/clusters" element={<CurrentClusters />} />
          <Route path="/current/job-explorer" element={<CurrentJobExplorer />} />
          <Route path="/current/organization-statistics" element={<CurrentOrganizationStatistics />} />
          <Route path="/current/reports" element={<CurrentReports />} />
          <Route path="/current/savings-planner" element={<CurrentSavingsPlanner />} />
          <Route path="/current/notifications" element={<CurrentNotifications />} />

          {/* Proposed experience — placeholders until designs are built out */}
          <Route path="/proposed/clusters" element={<PlaceholderPage title="Clusters" variant="proposed" />} />
          <Route path="/proposed/job-explorer" element={<PlaceholderPage title="Job Explorer" variant="proposed" />} />
          <Route path="/proposed/organization-statistics" element={<PlaceholderPage title="Organization Statistics" variant="proposed" />} />
          <Route path="/proposed/reports" element={<PlaceholderPage title="Reports" variant="proposed" />} />
          <Route path="/proposed/savings-planner" element={<PlaceholderPage title="Savings Planner" variant="proposed" />} />
          <Route path="/proposed/notifications" element={<PlaceholderPage title="Notifications" variant="proposed" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppNavigation>
    </Router>
  )
}

export default App
