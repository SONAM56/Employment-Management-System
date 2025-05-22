import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">S No</span>,
        selector: (row) => row.sno,
        width: "70px",
        cell: row => <span className="font-semibold text-gray-800">{row.sno}</span>
    },
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Emp ID</span>,
        selector: (row) => row.employeeId,
        width: '120px',
        cell: row => <span className="text-base text-gray-700">{row.employeeId}</span>
    },
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Name</span>,
        selector: (row) => row.name,
        width: "120px",
        cell: row => <span className="text-base text-gray-700">{row.name}</span>
    },  
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Leave Type</span>,
        selector: (row) => row.leaveType,
        width: '140px',
        cell: row => <span className="text-base text-gray-700">{row.leaveType}</span>
    },
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Department</span>,
        selector: (row) => row.department,
        width: "170px",
        cell: row => <span className="text-base text-gray-700">{row.department}</span>
    },
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Days</span>,
        selector: (row) => row.days,
        width: "180px",
        cell: row => <span className="text-base text-gray-700">{row.days}</span>
    },
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Status</span>,
        selector: (row) => row.status,
        width: "120px",
        cell: row => {
            let statusStyle = '';
            switch(row.status.toLowerCase()) {
                case 'approved':
                    statusStyle = 'bg-green-500 text-white';
                    break;
                case 'pending':
                    statusStyle = 'bg-yellow-500 text-white';
                    break;
                case 'rejected':
                    statusStyle = 'bg-red-500 text-white';
                    break;
                default:
                    statusStyle = 'bg-gray-500 text-white';
            }
            return (
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyle}`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            );
        }
    },
    {
        name: <span className="font-bold uppercase tracking-wider text-sm text-teal-700">Action</span>,
        selector: (row) => row.action,
        center: true,
        width: "1px"
    },
];

export const LeaveButtons = ({ Id }) => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${id}`);
    };
    
    return (
        <button 
            className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-semibold 
                     hover:bg-teal-700 transition-colors duration-200 flex items-center gap-1"
            onClick={() => handleView(Id)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
        </button>
    );
};