import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import '@patternfly/react-core/dist/styles/base.css'
import { AppNavigation } from './Navigation'

import Clusters from './pages/current/Clusters'
import JobExplorer from './pages/current/JobExplorer'
import OrganizationStatistics from './pages/current/OrganizationStatistics'
import Reports from './pages/current/Reports'
import ReportDetail from './pages/current/ReportDetail'
import SavingsPlanner from './pages/current/SavingsPlanner'
import SavingsPlannerDetail from './pages/current/SavingsPlannerDetail'
import Notifications from './pages/Notifications'
import AutomationCalculator from './pages/AutomationCalculator'

const basename = import.meta.env.BASE_URL

function App() {
  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppNavigation>
        <Routes>
          <Route path="/" element={<Navigate to="/reports" replace />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:slug" element={<ReportDetail />} />
          <Route path="/savings-planner" element={<SavingsPlanner />} />
          <Route path="/savings-planner/:id" element={<SavingsPlannerDetail />} />
          <Route path="/savings-planner/:id/statistics" element={<SavingsPlannerDetail />} />
          <Route path="/automation-calculator" element={<AutomationCalculator />} />
          <Route path="/organization-statistics" element={<OrganizationStatistics />} />
          <Route path="/job-explorer" element={<JobExplorer />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/reports" replace />} />
        </Routes>
      </AppNavigation>
    </Router>
  )
}

export default App
