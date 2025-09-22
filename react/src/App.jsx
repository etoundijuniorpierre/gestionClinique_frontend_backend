import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'


import PageLogin from "./pages/pagelogin"
import PageAdmin from "./pages/pageadmin"
import PageMedecin from "./pages/pagemedecin"
import Adminroute from './pages/adminrouter'
import ProtectedRoute from './composants/protectedroute'
import RoleBasedRoute from './composants/rolebasedroute'
import Medecinroute from './pages/medecinrouter'
import Calendrier from './composants/calendar'
import Secretaireroute from './pages/secretaireroute'
import { NotificationProvider } from './composants/notification'
import { LoadingProvider } from './composants/LoadingProvider'
import { ConfirmationProvider } from './composants/ConfirmationProvider'
import GlobalNotificationHandler from './composants/GlobalNotificationHandler'


function App() {
  return (
    <NotificationProvider>
      <LoadingProvider>
        <ConfirmationProvider>
          <Router>
            <GlobalNotificationHandler />
            <Routes>
              <Route path="/" element={<PageLogin />} />
              <Route path="/calendar" element={<Calendrier />} />
              <Route path="/pagemedecin" element={<PageMedecin />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<RoleBasedRoute allowedRoles={['ROLE_ADMIN']} />}>
                  <Route path='/admin/*' element={<Adminroute />} />
                </Route>
                <Route element={<RoleBasedRoute allowedRoles={['ROLE_MEDECIN']} />}>
                  <Route path='/medecin/*' element={<Medecinroute />} />
                </Route>
                <Route element={<RoleBasedRoute allowedRoles={['ROLE_SECRETAIRE']} />}>
                  <Route path='/secretaire/*' element={<Secretaireroute />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ConfirmationProvider>
      </LoadingProvider>
    </NotificationProvider>
  )
}

export default App
