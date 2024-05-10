const express = require('express')
var cors = require('cors');
const mongoose = require("mongoose");
const UserModel = require ('../TaskManager1/modal/userModal')
const TaskModel = require ('../TaskManager1/modal/taskModal')
const TeamModel = require ('../TaskManager1/modal/teamModal')
const app = express()
const port = 3000
app.use(cors())

app.use(express.json())

const mongoURI = 'mongodb://127.0.0.1:27017/task-manager';
const options = {
};

mongoose.connect(mongoURI, options)
	.then(() => {
		console.log('Connected to MongoDB');
		// Start your application or perform additional operations
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
	});

    app.get('/users', async (req, res) => {
        try {
            const users = await UserModel.find({ role: 'Member' }); // Retrieve users with role 'Member'
            res.json(users); // Send the filtered users as a JSON response
        } catch (err) {
            res.status(500).json({ message: "Internal server error", error: err });
        }
    });
    

app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

//count the number of male and female members
app.get('/member-count', async (req, res) => {
    try {
        const memberCount = await UserModel.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Transform the data for a more readable response
        const result = {
            male: 0,
            female: 0
        };

        memberCount.forEach(member => {
            if (member._id === 'Male') {
                result.male = member.count;
            } else if (member._id === 'Female') {
                result.female = member.count;
            }
        });

        res.json(result);
    } catch (error) {
        console.error('Error counting members:', error);
        res.status(500).json({ error: 'An error occurred while counting members' });
    }
});
//count the top 5 most highest number of completed tasks per member
app.get('/top-members', async (req, res) => {
    try {
        // Aggregate completed tasks per member
        const topMembers = await TaskModel.aggregate([
            { $match: { status: 'Completed' } }, // Filter completed tasks
            {
                $group: {
                    _id: '$user', // Group by user
                    totalCompletedTasks: { $sum: 1 } // Count completed tasks
                }
            },
            { $sort: { totalCompletedTasks: -1 } }, // Sort by totalCompletedTasks in descending order
            { $limit: 5 }, // Limit to top 5 members
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $addFields: {
                    firstName: { $arrayElemAt: ["$userData.firstName", 0] } // Extract first name from userData array
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the output
                    user: "$firstName", // Rename the user field to firstName
                    totalCompletedTasks: 1 // Include the totalCompletedTasks field in the output
                }
            }
        ]);

        // Return the top members with their total completed tasks
        res.json(topMembers);
    } catch (error) {
        console.error('Error fetching top members:', error);
        res.status(500).json({ error: 'An error occurred while fetching top members' });
    }
});

//calendar
app.get('/task-calendar', async (req, res) => {
    try {
        const aggregatedData = await TaskModel.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userData"
            }
          },
          {
            $project: {
              _id: 1,
              task: 1,
              status: 1,
              deadline: 1,
              user: { $arrayElemAt: ["$userData.firstName", 0] } // Extract the first name from the userData array
            }
          }
        ]);

        res.json(aggregatedData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});


app.get('/tasks', async (req, res) => {
    try {
        const aggregatedData = await TaskModel.aggregate([
          {
            $group: {
              _id: "$user",
              Pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
              Completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
            }
          },
          {
            $lookup: {
                from: "users",
                localField: "user", 
                foreignField: "_id",
                as: "userData"
              }
              
          },
          {
            $project: {
              user: { $concat: ["$userData.firstName"] },
              Pending: 1,
              Completed: 1
            }
          }
        ]);

        res.json(aggregatedData);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

app.get('/task-count/:year', async (req, res) => {
    try {
      const { year } = req.params;
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
  
      const pendingCounts = await TaskModel.aggregate([
        {
          $match: {
            status: 'Pending',
            deadline: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $month: '$deadline' },
            count: { $sum: 1 }
          }
        }
      ]);
  
      const completedCounts = await TaskModel.aggregate([
        {
          $match: {
            status: 'Completed',
            deadline: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { $month: '$deadline' },
            count: { $sum: 1 }
          }
        }
      ]);
  
      const pendingCountsPerMonth = pendingCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
  
      const completedCountsPerMonth = completedCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});
  
      res.json({ year, pending: pendingCountsPerMonth, completed: completedCountsPerMonth });
    } catch (error) {
      console.error('Error fetching task counts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

app.delete('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});


app.get('/tasks/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await TaskModel.find({ user: userId });
        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found" });
        }
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { user, task, status, deadline } = req.body;
        const newTask = await TaskModel.create({ user, task, status, deadline });
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

app.post('/create', (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
    })

app.delete('/tasks/delete/:taskId', async (req, res) => {
    const _id = req.params.taskId;

    try {
        // Find the task by ID and remove it
        const deletedTask = await TaskModel.findByIdAndDelete(_id);

        if (!deletedTask) {
            // If the task was not found, send a 404 response
            return res.status(404).json({ message: "Task not found" });
        }

        // Fetch the updated list of tasks after deletion
        const updatedTasks = await TaskModel.find();

        // Send a success response with the updated list of tasks
        res.status(200).json({ message: "Task deleted successfully", tasks: updatedTasks });
    } catch (error) {
        // If an error occurred, send a 500 response with the error message
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.delete('/tasks/user/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Delete tasks associated with the user
      await TaskModel.deleteMany({ user: userId });
      res.status(200).json({ message: 'Tasks deleted successfully' });
    } catch (error) {
      console.error('Error deleting tasks:', error);
      res.status(500).json({ error: 'An error occurred while deleting tasks' });
    }
  });

app.put('/tasks/update/:taskId', async (req, res) => {
    const _id = req.params.taskId;
    const task = req.body; // This should contain the updated task data

    try {
        // Find the task by ID and update it with the new data
        const updatedTask = await TaskModel.findByIdAndUpdate(_id, task, { new: true });


        if (!updatedTask) {
            // If the task was not found, send a 404 response
            return res.status(404).json({ message: "Task not found" });
        }

        // Send a success response with the updated task data
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        // If an error occurred, send a 500 response with the error message
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.put('/tasks/updateStat/:taskId', async (req, res) => {
    const _id = req.params.taskId;
    const { status } = req.body; // Destructure the status field from the request body

    try {
        // Find the task by ID and update its status field with the new status
        const updatedTask = await TaskModel.findByIdAndUpdate(_id, { status }, { new: true });

        if (!updatedTask) {
            // If the task was not found, send a 404 response
            return res.status(404).json({ message: "Task not found" });
        }

        // Send a success response with the updated task data
        res.status(200).json({ message: "Status updated successfully", task: updatedTask });
    } catch (error) {
        // If an error occurred, send a 500 response with the error message
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
       
        res.json({ email: user.email, userId: user._id, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port`, port);
});