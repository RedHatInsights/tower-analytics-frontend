import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import '@patternfly/react-core/dist/styles/base.css'
import { AppNavigation } from './Navigation'
import PrototypeIntro from './pages/PrototypeIntro'

// Pages
import Clusters from './pages/current/Clusters'
import JobExplorer from './pages/current/JobExplorer'
import OrganizationStatistics from './pages/current/OrganizationStatistics'
import Reports from './pages/current/Reports'
import SavingsPlanner from './pages/current/SavingsPlanner'
import Notifications from './pages/Notifications'

const basename = import.meta.env.BASE_URL

function App() {
  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppNavigation>
        <Routes>
          <Route path="/" element={<PrototypeIntro />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/job-explorer" element={<JobExplorer />} />
          <Route path="/organization-statistics" element={<OrganizationStatistics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/savings-planner" element={<SavingsPlanner />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppNavigation>
    </Router>
  )
}

export default App
