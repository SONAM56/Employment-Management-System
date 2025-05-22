import Employee from "../models/Employee.js"
import Leave from "../models/Leave.js"
import  { io } from '../socket.js';
// const addLeave = async (req, res) => {
//     try {
//         const {userId, leaveType, startDate, endDate, reason} = req.body
//         const employee = await Employee.findOne({userId})
        
//         const newLeave = new Leave({
//             employeeId: employee._id, leaveType, startDate, endDate, reason
//         })

//         await newLeave.save()

//         return  res.status(200).json({success: true})
//     } catch (error){
//         console.log(error.message)
//         return res.status(500).json({success: false, error: "leave add server error"})
//     }
// }

const addLeave = async (req, res) => {
    try {
        const {userId, leaveType, startDate, endDate, reason} = req.body

        // Validate required fields
        if (!userId || !leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({
                success: false, 
                error: "All fields are required"
            });
        }

        // Find employee
        const employee = await Employee.findOne({userId})
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: "Employee not found"
            });
        }
        
        const newLeave = new Leave({
            employeeId: employee._id, 
            leaveType, 
            startDate, 
            endDate, 
            reason
        })

        // Save the new leave
        const savedLeave = await newLeave.save()
        if (!savedLeave) {
            return res.status(500).json({
                success: false,
                error: "Failed to save leave request"
            });
        }

        // Fetch complete leave data with populated fields
        const populatedLeave = await Leave.findById(savedLeave._id)
            .populate({
                path: 'employeeId',
                populate: [
                    { path: 'department', select: 'dep_name' },
                    { path: 'userId', select: 'name' }
                ]
            });

        if (!populatedLeave) {
            return res.status(500).json({
                success: false,
                error: "Leave saved but failed to retrieve details"
            });
        }

        // Emit socket event with populated data
        if (req.io) {
            req.io.emit('leaveAdded', populatedLeave);
            console.log('Leave added event emitted');
        } else {
            console.warn('Socket.io not initialized');
        }
        return res.status(201).json({
            success: true, 
            leave: populatedLeave,
            message: "Leave request submitted successfully"
        })

    } catch (error) {
        console.error("Leave Add Error:", error);
        return res.status(500).json({
            success: false, 
            error: error.message || "Internal server error while processing leave request"
        })
    }
}

const getLeave = async (req, res) => {
    try {
        const {id} = req.params;
        let leaves = await Leave.find({employeeId: id})
        // Check if the leaves array is empty instead
        if (leaves.length === 0){
            const employees = await Employee.findOne({userId: id});
            
            // Also add a check in case no employee is found
            if (employees) {
                leaves = await Leave.find({employeeId: employees._id});
            }
        }
        return res.status(200).json({sucess: true, leaves})
    } catch (error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "leaves display server error"})
    }
}

const getLeaves = async (req, res) => {
    try {
        // This will delete all leaves where the endDate is less than the current date
        await Leave.deleteMany({ endDate: { $lt: new Date() } });

        const leaves = await Leave.find().populate({
            path: 'employeeId',
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        })    
        return res.status(200).json({sucess: true, leaves})
    } catch (error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "leaves display server error"})
    }
}
const getLeaveDetail = async (req, res) => {
    try {
        const {id} = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: 'employeeId',
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name profileImage'
                }
            ]
        })    
        return res.status(200).json({sucess: true, leave})
    } catch (error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "leaves display server error"})
    }
}

const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status) {
            return res.status(400).json({
                success: false,
                error: "Status is required"
            });
        }

        // Use { new: true } to get the updated document
        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate({
            path: 'employeeId',
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name profileImage'
                }
            ]
        });

        if (!updatedLeave) {
            return res.status(404).json({
                success: false,
                error: "Leave not found"
            });
        }

        // Emit socket event for real-time updates
        if (req.io) {
            req.io.emit('statusUpdated', updatedLeave);
            console.log('Status updated event emitted');
        }

        return res.status(200).json({
            success: true,
            leave: updatedLeave,
            message: "Leave status updated successfully"
        });

    } catch (error) {
        console.error("Leave Update Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Error updating leave status"
        });
    }
};

const deleteLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const leave = await Leave.findByIdAndDelete(id);
        
        if (!leave) {
            return res.status(404).json({ 
                success: false, 
                error: "Leave not found" 
            });
        }

        // Emit socket event for real-time updates
        if (req.io) {
            req.io.emit('leaveDeleted', id);
        }

        return res.status(200).json({ 
            success: true, 
            message: "Leave deleted successfully" 
        });
    } catch (error) {
        console.error("Leave Delete Error:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Error deleting leave" 
        });
    }
};

export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave, deleteLeave }
