import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/authContext";

export const columns = [
    {
        name: <span className="font-semibold text-gray-800 text-sm uppercase">S No</span>,
        selector: (row) => row.sno,
        width: "70px"
    },
    {
        name: <span className="font-semibold text-gray-800 text-sm uppercase">Name</span>,
        selector: (row) => <span className="text-base">{row.name}</span>,
        sortable: true,
        width: "140px"
    },
    {
        name: <span className="font-semibold text-gray-800 text-sm uppercase">Image</span>,
        selector: (row) => row.profileImage,
        width: '90px'
    },
    {
        name: <span className="font-semibold text-gray-800 text-sm uppercase">Department</span>,
        selector: (row) => <span className="text-base">{row.dep_name}</span>,
        width: "140px"
    },
    {
        name: <span className="font-semibold text-gray-800 text-sm uppercase">DOB</span>,
        selector: (row) => <span className="font-mono text-base">{row.dob}</span>,
        sortable: true,
        width: "130px"
    },
    {
        name: <span className="font-semibold text-gray-800 text-sm uppercase">Action</span>,
        selector: (row) => row.action,
        center: true,
    },
];

export const fetchDepartments = async () =>{
      let departments;
      const {baseUrl} = useAuth();
      try{
        const response = await axios.get(`${baseUrl}/api/department`,{
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`
          },
        });
        if(response.data.success){
            departments = response.data.departments
        }
      } catch(error){
        if(error.response && !error.response.data.success){
          alert(error.response.data.error)
        }
      }
      return departments 
};

// employees for salary form
export const getEmployees = async (id) =>{
      const {baseUrl} = useAuth()
      let employees;
      try{
        const responnse = await axios.get(`${baseUrl}/api/employee/department/${id}`,{
          headers : {
            Authorization : `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(responnse)
        if(responnse.data.success){
            employees = responnse.data.employees
        }
      } catch(error){
        if(error.response && !error.response.data.success){
          alert(error.response.data.error);
        }
      }
      return employees 
};

export const EmployeeButtons = ({Id}) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-wrap gap-2">
            <button
                className="px-3 py-1 rounded bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition"
                title="View Employee"
                onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
            >
                View
            </button>
            <button
                className="px-3 py-1 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
                title="Edit Employee"
                onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
            >
                Edit
            </button>
            <button
                className="px-3 py-1 rounded font-semibold shadow transition"
                style={{ backgroundColor: "#f59e42", color: "#fff" }}
                title="Salary History"
                onClick={() => navigate(`/admin-dashboard/salary/history/${Id}`)}
            >
                Salary
            </button>
            
            <button
                className="px-3 py-1 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
                title="Leave Management"
                onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
            >
                Leave
            </button>
            <button
                className="px-3 py-1 rounded font-semibold shadow transition"
                style={{ backgroundColor: "blue", color: "white" }}
                title="Salary History"
                onClick={() => navigate(`/admin-dashboard/show-user-task/${Id}`)}
            >
                Show Tasks
            </button>
        </div>
    )
}
