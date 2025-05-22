import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "../utils/PrivateRoutes";
import RoleBaseRoutes from "../utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList"
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import SalaryDetails from "./components/salary/SalaryDetails";
import Summary from "./components/EmployeeDashboard/Summary";
import LeaveList from "./components/leave/List";
import AddLeave from "./components/leave/Add";
import ActivityLog from "./components/activitylog/AcitivityLog";
import SetTime from "./components/activitylog/SetTime";
import Attendance from "./components/attendance/Attendance";
import { SocketProvider } from "./context/socketContext";
import AuthProvider from "./context/authContext";
import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";
import EmployeeAttendance from "./components/attendance/EmployeeAttendance";
import SalaryHistoryList from "./components/salary/SalaryHistoryList";
import ForgotPassword from "./pages/ForgotPassword";
import Code from "./pages/Code";
import ChangePassword from "./pages/ChangePassword";
import ShowUserTask from "./pages/ShowUserTask";
import AssignTask from "./pages/AssignTask";
import ShowIndividualTask from "./pages/ShowIndividualTask";
import GetAllTask from "./components/Task/GetAllTask";
import ShowEmployeeIndividualTask from "./components/Task/GetEmployeeIndividualTask";

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/admin-dashboard"/>}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/login/forgot" element={<ForgotPassword />} />
            <Route path="/login/verify/code" element={<Code />} />
            <Route path="/login/ChangePassword" element={<ChangePassword />} />
            
            <Route path="/admin-dashboard" element={
              <PrivateRoutes>
                <RoleBaseRoutes requiredRole={["admin"]}>
                  <AdminDashboard/>
                </RoleBaseRoutes>
              </PrivateRoutes>
            }>
               <Route index element={<AdminSummary/>}></Route>

              <Route path="/admin-dashboard/departments" element={<DepartmentList/>}></Route>
              <Route path="/admin-dashboard/add-department" element={<AddDepartment/>}></Route>
              <Route path="/admin-dashboard/department/:id" element={<EditDepartment/>}></Route>
              
              <Route path="/admin-dashboard/employees" element={<List/>}></Route>
              <Route path="/admin-dashboard/add-employee" element={<Add/>}></Route>
              <Route path="/admin-dashboard/employees/:id" element={<View/>}></Route>
              <Route path="/admin-dashboard/employees/edit/:id" element={<Edit/>}></Route>
              <Route path="/admin-dashboard/salary/history/:id" element={<SalaryHistoryList />} />
              <Route path="/admin-dashboard/salary/add" element={<AddSalary/>}></Route>
              <Route path="/admin-dashboard/salary" element={<ViewSalary/>}></Route>
              <Route path="/admin-dashboard/activitylog/view" element={<ActivityLog/>}></Route>
              <Route path="/admin-dashboard/activitylog/set-time" element={<SetTime/>}></Route>
              <Route path="/admin-dashboard/attendance" element={<Attendance/>}></Route>
              <Route path="/admin-dashboard/leaves" element={<Table/>}></Route>
              <Route path="/admin-dashboard/leaves/:id" element={<Detail/>}></Route>
              <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList/>}></Route>
              <Route path="/admin-dashboard/setting" element={<Setting/>}></Route>
              <Route path="/admin-dashboard/show-user-task/:id" element={<ShowIndividualTask />}></Route>
              <Route path="/admin-dashboard/show-user-task" element={<GetAllTask />}></Route>
              <Route path="/admin-dashboard/add-task" element={<AssignTask />}></Route>
            </Route> 
            <Route path="/employee-dashboard" element={
              <PrivateRoutes>
                <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                  <EmployeeDashboard/>
                </RoleBaseRoutes>
              </PrivateRoutes>
            }>
              <Route index element={<Summary/>}></Route>
              <Route path="/employee-dashboard/profile/:id" element={<View />}></Route>
              <Route path="/employee-dashboard/attendance/:id" element={<EmployeeAttendance />}></Route>
              <Route path="/employee-dashboard/leaves/:id" element={<LeaveList />}></Route>
              <Route path="/employee-dashboard/salary/:id" element={<SalaryDetails />} />
              <Route path="/employee-dashboard/add-leave" element={<AddLeave />}></Route>
              <Route path="/employee-dashboard/setting" element={<Setting />}></Route>
              <Route path="/employee-dashboard/show-task/:id" element={<ShowEmployeeIndividualTask />}></Route>

            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App
