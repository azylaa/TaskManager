import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Table, TableHead, TableBody, TableCell, TableRow, IconButton,  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
import ToastContext from "/src/context/ToastContext";
import { useTheme } from "@mui/material/styles";

const Task = () => {
    const { toast } = useContext(ToastContext);
    const [tasks, setTasks] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(""); // State for selected deadline date
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks
    const navigate = useNavigate();
    const theme = useTheme();

    const fetchTasks = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:3000/tasks/${userId}`, {
                headers: { "authorization": localStorage.getItem('token') }
            });
            setTasks(response.data);
            // Initially set filtered tasks to all tasks
            setFilteredTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            // Handle error (e.g., show error message)
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Returns date in local format without time
    };

    // State to manage delete confirmation dialog
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    // State to manage update confirmation dialog
    const [openUpdateConfirmation, setOpenUpdateConfirmation] = useState(false);

    // Function to handle opening update confirmation dialog
    const handleOpenUpdateConfirmation = (taskId) => {
        const selectedTask = tasks.find(task => task._id === taskId);
        if (selectedTask.status === "Completed") {
            toast.error("Cannot update details of a completed task");
        } else {
            setSelectedTaskId(taskId); 
            setOpenUpdateConfirmation(true);
        }
    };

    const handleOpenDeleteConfirmation = (taskId) => {
        setSelectedTaskId(taskId);
        setOpenDeleteConfirmation(true);
    };

    // Function to close update confirmation dialog
    const handleCloseUpdateConfirmation = () => {
        setSelectedTaskId(null); // Reset selectedTaskId
        setOpenUpdateConfirmation(false);
    };


    const handleEdit = (taskId) => {
        const selectedTask = tasks.find(task => task._id === taskId);
        if (selectedTask.status === "Completed") {
            toast.error("Cannot edit details of a completed task.");
        } else {
            setEditedTask(selectedTask);
            setSelectedTaskId(taskId);
            setOpenEditDialog(true);
        }
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedTaskId(null);
        setEditedTask({});
    };

    const handleUpdateTask = async () => {
        try {
            const taskToUpdate = tasks.find(task => task._id === selectedTaskId);
            if (taskToUpdate.status === "Completed") {
                toast.error("Cannot update details of a completed task.");
                return;
            }

            await axios.put(`http://localhost:3000/tasks/update/${selectedTaskId}`, editedTask, {
                headers: { "authorization": localStorage.getItem('token') }
            });

            setOpenEditDialog(false);
            setSelectedTaskId(null);
            setEditedTask({});
            fetchTasks();
            toast.success("Task updated successfully");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/delete/${taskId}`, {
                headers: { "authorization": localStorage.getItem('token') }
            });
            setTasks(tasks.filter(task => task._id !== taskId));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            const taskToUpdate = tasks.find(task => task._id === taskId);
            if (taskToUpdate.status === "Completed") {
                toast.error("Cannot update status of a completed task.");
                return;
            }

            const updatedTaskData = {
                status: newStatus,
                updatedAt: new Date()
            };

            await axios.put(`http://localhost:3000/tasks/updateStat/${taskId}`, updatedTaskData, {
                headers: { "authorization": localStorage.getItem('token') }
            });

            fetchTasks();
            toast.success("Task status updated successfully");
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status");
        }
    };

    const handleDateFilter = (e) => {
        const selectedDate = e.target.value;
        console.log("Selected date:", selectedDate); // Log the selected date
        setSelectedDate(selectedDate);
        // Filter tasks based on selected deadline date
        const filtered = tasks.filter(task => {
            // Check if task.deadline is defined before splitting
            const taskDeadline = task.deadline?.split('T')[0];
            // Compare the extracted date with the selected date
            return taskDeadline === selectedDate;
        });
        setFilteredTasks(filtered);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Filter tasks based on search query
        const filtered = tasks.filter(task => task.task.toLowerCase().includes(query.toLowerCase()));
        setFilteredTasks(filtered);
    };

    return (
        <Box m="20px">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="10px">
                    {/* Your Tasks heading */}
                    <Typography variant="h1" gutterBottom>
                        Your Tasks
                    </Typography>
                    {/* Search inputs */}
                    <Box display="flex">
                        {/* Search input for Task Name */}
                        <Box mr="20px">
                            <Typography variant="subtitle1" gutterBottom>
                                Search by Task Name
                            </Typography>
                            <TextField
                                label="Task Name"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </Box>
                        {/* Date filter input */}
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Filter by Deadline
                            </Typography>
                            <TextField
                                type="date"
                                value={selectedDate}
                                onChange={handleDateFilter}
                            />
                        </Box>
                    </Box>
                </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Task Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date Created</TableCell>
                        <TableCell>Date Updated</TableCell>
                        <TableCell>Deadline</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                   {filteredTasks.map((task) => (
                        <TableRow key={task._id}>
                            <TableCell>{task.task}</TableCell>
                            <TableCell>
                                <Typography color={task.status === 'Completed' ? 'secondary.main' : (task.status === 'Pending' ? 'orange' : 'textPrimary')}>
                                    {task.status}
                                </Typography>
                            </TableCell>
                            <TableCell>{formatDate(task.createdAt)}</TableCell>
                            <TableCell>{formatDate(task.updatedAt)}</TableCell>
                            <TableCell>{formatDate(task.deadline)}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(task._id)}>
                                    <EditIcon style={{ color: 'orange' }} />
                                </IconButton>
                                <IconButton onClick={() => handleOpenDeleteConfirmation(task._id)}>
                                    <DeleteIcon style={{ color: 'red' }} />
                                </IconButton>
                                {/* Pass taskId to handleOpenUpdateConfirmation */}
                                <IconButton onClick={() => handleOpenUpdateConfirmation(task._id)}>
                                    <UpdateIcon style={{ color: theme.palette.secondary.main }} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Edit Task Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Task Name"
                        type="text"
                        fullWidth
                        value={editedTask.task || ''}
                        onChange={(e) => setEditedTask({ ...editedTask, task: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Deadline"
                        type="date"
                        fullWidth
                        value={editedTask.deadline ? editedTask.deadline.split('T')[0] : ''}
                        onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="secondary" >Cancel</Button>
                    <Button onClick={handleUpdateTask} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>
                        {/* Delete Task Confirmation Dialog */}
                        <Dialog open={openDeleteConfirmation} onClose={() => setOpenDeleteConfirmation(false)}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography color="textPrimary" >Are you sure you want to delete this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirmation(false)} color="secondary">Cancel</Button>
                    <Button onClick={() => {
                        handleDelete(selectedTaskId);
                        setOpenDeleteConfirmation(false);
                    }} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Update Task Confirmation Dialog */}
            <Dialog open={openUpdateConfirmation} onClose={handleCloseUpdateConfirmation}>
                <DialogTitle>Update Task</DialogTitle>
                <DialogContent>
                    <Typography color="textPrimary" >Are you sure you want to update this task?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateConfirmation} color="secondary">Cancel</Button>
                    <Button onClick={() => {
                        handleUpdateStatus(selectedTaskId, 'Completed'); // Use selectedTaskId
                        handleCloseUpdateConfirmation(); // Close dialog
                    }} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Task;
