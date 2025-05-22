import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../src/context/authContext";
// export const columns = [
//     {
//         name:"S No",
//         selector: (row) => row.sno
//     },
//     {
//         name:"Department Name",
//         selector: (row) => row.dep_name,
//         sortable: true  
//     },
//     {
//         name: "Action",
//         selector: (row) => row.action
//     },
// ]
export const columns = [
    {
        name: <span className="font-semibold text-gray-700 uppercase tracking-wider text-sm">S No</span>,
        selector: (row) => row.sno,
        width: "70px"
    },
    {
        name: <span className="font-semibold text-gray-700 uppercase tracking-wider text-sm">Department Name</span>,
        selector: (row) => <span className="text-base font-medium">{row.dep_name}</span>,
        sortable: true  
    },
    {
        name: <span className="font-semibold text-gray-700 uppercase tracking-wider text-sm">Action</span>,
        selector: (row) => row.action,
        center: true,
    },
];

export const DepartmentButtons = ({Id, onDepartmentDelete}) => {
    const navigate = useNavigate()
    const {baseUrl} = useAuth();
    const handleDelete =  async (id) => {
        const confirm = window.confirm("Do you want to delete?")
        if(confirm){
            try{
                const response = await axios.delete(`${baseUrl}/api/department/${id}`,{
                    headers : {
                        "Authorization" : `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if(response.data.success){
                   onDepartmentDelete();
                }
            } catch(error){
                if(error.response && !error.response.data.success){
                alert(error.response.data.error)
                }
            }
        }
    };
    return (
        <div className="flex flex-wrap gap-2">
            <button
                className="px-3 py-1 rounded bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition"
                onClick={() => navigate(`/admin-dashboard/department/${Id}`)}
                title="Edit Department"
            >
                Edit
            </button>
            <button
                className="px-3 py-1 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
                onClick={() => handleDelete(Id)}
                title="Delete Department"
            >
                Delete
            </button>
        </div>
    )
}