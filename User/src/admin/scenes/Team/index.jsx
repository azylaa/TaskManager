import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,IconButton, TextField, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import ToastContext from "/src/context/ToastContext";
import Header from "/src/admin/components/Header";
import ViewListIcon from '@mui/icons-material/ViewList';

const Task = () => {
  const { toast } = useContext(ToastContext);
  const [data, setData] = useState([]); // Define state for users data
  const [tasks, setTasks] = useState([]); // Define state for tasks data
  const [newDeadline, setDeadline] = useState(""); // Define state for users data
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false); // State variable for controlling "Add Task" dialog visibility
  const [openViewTasksDialog, setOpenViewTasksDialog] = useState(false); // State variable for controlling "View Tasks" dialog visibility
  const [newTask, setNewTask] = useState(""); // State variable for new task input
  const [selectedUserId, setSelectedUserId] = useState(null); // State variable to store the selected user's ID

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/")
    }
    getUsers().then(data => setData(data));
  }, []);

  const APICALL = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/tasks/${selectedUserId}`, { headers: { "authorization": localStorage.getItem('token') } });
      setTasks(response.data);
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };  
  
  const getUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users`, { headers: { "authorization": localStorage.getItem('token') } });
      return response.data.map((user, index) => ({
        ...user,
        id: user._id // Assuming _id is a unique identifier for each user
      }));
    } catch (error) {
      toast.error(error.response.message)
    }
  };

  const handleAddButtonClick = (userId) => {
    setOpenAddTaskDialog(true); // Open the "Add Task" dialog when the "Add" button is clicked
    setSelectedUserId(userId); // Set the selected user's ID
  };

  const handleViewTasksButtonClick = async (userId) => {
    setSelectedUserId(userId); // Set the selected user's ID
    setOpenViewTasksDialog(true); // Open the "View Tasks" dialog when the "View Tasks" button is clicked
    await APICALL(); // Fetch tasks associated with the selected user
  };

  const handleCloseAddTaskDialog = () => {
    setOpenAddTaskDialog(false); // Close the "Add Task" dialog
  };

  const handleCloseViewTasksDialog = () => {
    setOpenViewTasksDialog(false); // Close the "View Tasks" dialog
  };

  const handleChange = (e) => {
    setNewTask(e.target.value); // Update the new task input value
  };
  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleAddTask = () => {
    axios.post('http://localhost:3000/tasks', {
        task: newTask,
        deadline: newDeadline,
        user: selectedUserId, // Use the selected user's ID for the task
        status: "Pending"
    }, { headers: { "authorization": localStorage.getItem('token') } })
        .then((res) => {
            toast.success("Task Added Successfully");
            setNewTask(""); // Clear the new task input field
            handleCloseAddTaskDialog(); // Close the "Add Task" dialog after adding the task
            APICALL(); // Fetch updated tasks associated with the selected user
        })
        .catch((e) => {
            toast.error(e.message);
        });
  };

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  // Function to open delete confirmation dialog
  const handleOpenDeleteConfirmation = (userId) => {
    setSelectedUserId(userId); // Set the selected user's ID
    setOpenDeleteConfirmation(true); // Open the delete confirmation dialog
  };
  // Function to close delete confirmation dialog
  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false); // Close the delete confirmation dialog
  };

  const handleDeleteUser = (userId) => {
    // First, delete the tasks affiliated with the user
    axios.delete(`http://localhost:3000/tasks/user/${userId}`, { headers: { "authorization": localStorage.getItem('token') } })
      .then(() => {
        // Once the tasks are deleted, proceed to delete the user
        axios.delete(`http://localhost:3000/user/${userId}`, { headers: { "authorization": localStorage.getItem('token') } })
          .then(() => {
            // If both tasks and user are deleted successfully
            toast.success("User and affiliated tasks deleted successfully");
            // Filter out the deleted user from the data state
            setData(data.filter(user => user.id !== userId));
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  

  const formatDate = (date) => {
    const dateObj = moment(date);
    return dateObj.format('DD/MM/YYYY');
};
const formatTime = (Time) => {
    const dateObj = moment(Time);
    return dateObj.format('hh:mm A');
};

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team" />
      <Box m="20px 0">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                {/* Use IconButton instead of Button */}
                <IconButton
                  color="secondary"
                  aria-label="add task"
                  onClick={() => handleAddButtonClick(user.id)}
                >
                  <AddIcon />
                </IconButton>
                  {/* Use IconButton instead of Button */}
                  <IconButton
                    color="secondary"
                    aria-label="view tasks"
                    onClick={() => handleViewTasksButtonClick(user.id)}
                  >
                    <ViewListIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() =>  handleOpenDeleteConfirmation(user.id)}
                  >
                     <DeleteIcon style={{ color: 'red' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Dialog for adding new task */}
      <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task"
            type="text"
            fullWidth
            value={newTask}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Deadline"
            type="date" // Set type to "date" for date input
            fullWidth
            value={newDeadline}
            onChange={handleDeadlineChange}
            InputLabelProps={{
              shrink: true, // Ensure the label "shrinks" when there's a value
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTaskDialog} color= "secondary">Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for viewing tasks */}
      <Dialog open={openViewTasksDialog} onClose={handleCloseViewTasksDialog} maxWidth="md" fullWidth>
        <DialogTitle>Tasks for User ID: {selectedUserId}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task ID</TableCell>
                <TableCell>Task Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Date Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task._id}</TableCell>
                  <TableCell>{task.task}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{formatDate(task.createdAt)}</TableCell>
                  <TableCell>{formatDate(task.deadline)}</TableCell>
                  <TableCell>{formatDate(task.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewTasksDialog} color= "secondary" >Close</Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation dialog for user deletion */}
        {openDeleteConfirmation && (
          <Dialog open={openDeleteConfirmation} onClose={handleCloseDeleteConfirmation}>
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
              <Typography color="textPrimary">Are you sure you want to delete this user?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteConfirmation} color="secondary">Cancel</Button>
              <Button onClick={() => {
                handleDeleteUser(selectedUserId);
                handleCloseDeleteConfirmation();
              }} color="error" variant="contained">Delete</Button>
            </DialogActions>
          </Dialog>
        )}
    </Box>
  );
};

export default Task;
