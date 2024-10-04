import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./Pages/Login";
import Home from "./Pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./Pages/Admin";
import User from "./Pages/User";
import SuperAdmin from "./Pages/SuperAdmin";
import NotFound from "./Pages/NotFound";
import Header from "./components/Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import axios from "axios";
import UserDetails from "./Pages/UserDetails";
import ApprovedUsersList from "./Pages/ApprovedUsersList";
import Approveduser from "./Pages/Approveduser";
import SalesPersonDashboard from "./Pages/SalesPersonDashboard";
import SalesAdmin from "./Pages/SalesAdmin";
import CreateOrg from "./Pages/CreateOrg";
import OnboardingTeam from "./Pages/OnboardingTeam";
import OrgForm from "./Pages/OrgForm";
import OrgTable from "./Pages/OrgTable";
import OrgDashboard from "./Pages/OrgDashboard";
import SearchByPan from "./Pages/SearchByPan";
import OrganizationDetails from "./Pages/OrganizationDetails";
import UserRegistration from "./Pages/UserRegistration";
import OrgApprovalPage from "./Pages/OrgApprovalPage";
import LandingPage from "./Pages/LandingPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/OS/user-details`, {
        withCredentials: true, // To include cookies with the request
      })
      .then((response) => {
        if (response.data.success) {
          console.log("response at user side", response.data.user);
          // Update redux store with user details
          dispatch(
            setUserDetails({
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role,
              department: response.data.user.department || null,
            })
          );
        }
      })
      .catch((error) => {
        console.error("Token validation failed", error);
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
        <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Home />}>
          <Route index element={<LandingPage/>}/>
            
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/approveduser/:id" element={<Approveduser />} />
            <Route path="/ApprovedUsersList" element={<ApprovedUsersList />} />
            {/* Protected routes */}
            <Route path="/dashboard" element={<Admin />} />
            <Route path="/userpage" element={<User />} />
            <Route path="/superAdmin" element={<SuperAdmin />} />
            <Route
              path="/salesPersonDashboard"
              element={<SalesPersonDashboard />}
            />
            <Route path="/salesAdmin" element={<SalesAdmin />} />
            {/* <Route path='/OnBoard' element={<OnboardDashboard/>}> */}
            <Route path="/OnboardingTeam" element={<OnboardingTeam />} />
            <Route path="/createOrg/:orgId" element={<CreateOrg />} />
            {/* </Route> */}
            <Route path="/SalesAdmin" element={<SalesAdmin />} />
            <Route path="/superAdmin/OrgDashboard" element={<OrgDashboard />} />
            <Route
              path="/OrgDashboard/superAdmin/CreateOrg"
              element={<CreateOrg />}
            />
            <Route
              path="/OrgDashboard/superAdmin/allOrg"
              element={<OrgTable />}
            />
            <Route
              path="/OrgDashboard/superAdmin/search-by-pan"
              element={<SearchByPan />}
            />
            <Route
              path="/OrgDashboard/superAdmin/OrgApprovalPage"
              element={<OrgApprovalPage />}
            />
            <Route
              path="/OrgDashboard/superAdmin/Create_User"
              element={<UserRegistration />}
            />
            <Route
              path="/OrgDashboard/superAdmin/org/:orgName"
              element={<OrganizationDetails />}
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
