import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';


const MainTask = ({ selectedUser }) => {
  const [addTask, setAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null,
    status: null,
    assignedTo: "",
  });

  const allStatus = [
    { name: 'pending', code: 'p' },
    { name: 'in progress', code: 'ip' },
    { name: 'completed', code: 'c' }
  ];

  const token = localStorage.getItem("authToken");

  const authHeader = { "Authorization": token };

  const getLoggedInUser = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);

      return decodedToken;
    }
    return false;
  }

  useEffect(() => {
    const user = getLoggedInUser();
    setIsAdmin(user);
    console.log("logged in user :", user);

  }, []);

  const fetchTasks = async () => {
    try {
      //   const token = localStorage.getItem("token"); // Get the token from localStorage
      // if (!token) {
      //   console.error("No token found, please login again.");
      //   return;
      // }
      const response = await axios.get("http://localhost:3000/api/tasks/mytasks", {
        headers: { "Content-Type": "application/json", ...authHeader },
      });
      console.log("Fetched tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response ? error.response.data : error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/users", {
        headers: { "Content-Type": "application/json", ...authHeader },
      });
      console.log("Fetched users:", response.data);
      setUsers(response.data);

      // const storedUser = JSON.parse(localStorage.getItem("user"));
      // setLoggedInUser(storedUser);
    } catch (error) {
      console.error("Error fetching users:", error.response ? error.response.data : error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData(prev => ({ ...prev, assignedTo: selectedUser._id || selectedUser.id }));
    }
  }, [selectedUser]);

  const handleChange = (eOrField, maybeValue) => {
    if (eOrField && eOrField.target) {
      const { name, value } = eOrField.target;
      setFormData(prevData => ({ ...prevData, [name]: value }));
    } else {
      const field = eOrField;
      setFormData(prevData => ({ ...prevData, [field]: maybeValue }));
    }
  };

  const openAddTask = () => {
    setFormData(prev => ({
      title: "",
      description: "",
      dueDate: null,
      status: null,
      assignedTo: prev.assignedTo || "",
    }));
    setEditingTask(null);
    setAddTask(true);
  };

  const closeForm = () => {
    setAddTask(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      assignedTo: isAdmin.role === "admin" ? formData.assignedTo : isAdmin._id,
    };
    console.log("Payload:", JSON.stringify(payload));

    try {

      let response;

      if (editingTask) {
        response = await axios.post(`http://localhost:3000/api/tasks/update/${editingTask._id}`, payload, {
          headers: { "Content-Type": "application/json", ...authHeader },
        });
        toast("Task updated successfully!");
      } else {
        response = await axios.post("http://localhost:3000/api/tasks", payload, {
          headers: { "Content-Type": "application/json", ...authHeader },
        });
        toast("Task created successfully!");
      }
      console.log("Response:", response.data);
      fetchTasks();
      closeForm();
    } catch (error) {
      console.error("Error creating/updating task:", error.response ? error.response.data : error);
      toast.error("Error creating/updating task");
    }
  };

  console.log("Auth Header:", authHeader);

  const handleDelete = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/tasks/delete/${taskId}`,
        {},  // empty data payload
        { headers: { "Content-Type": "application/json", ...authHeader } }
      );


      fetchTasks();
      toast("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error.response ? error.response.data : error);
      toast.error("Error deleting task");
    }
    console.log("Deleting Task ID:", taskId);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      assignedTo: task.assignedTo
        ? (typeof task.assignedTo === 'object' ? task.assignedTo._id : task.assignedTo)
        : "",
    });
    setAddTask(true);
  };

  const renderTaskCards = () => {
    return (
      <div>
        <Grid container spacing={2}>
          {tasks.map((task) => (
          // const canEditOrDelete = isAdmin && (isAdmin.role === "admin" || task.assignedTo === isAdmin._id);
          // return(
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card variant="outlined" sx={{ backgroundColor: '#d6eaf8' }} className='shadow-xl'>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  <strong>Due Date:</strong>
                  <span className='border p-1 rounded-2xl bg-red-100 font-bold'>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  {task.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> <span>{task.status}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Assigned To:</strong> {task.assignedTo && typeof task.assignedTo === "object" ? task.assignedTo.username : task.assignedTo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Assigned By:</strong> {task.createdBy && typeof task.createdBy === "object" ? task.createdBy.username : task.createdBy}
                </Typography>
                {/* {isAdmin?.role === "admin" && ( */}
                {/* {canEditOrDelete ? ( */}
                  <div style={{ marginTop: 10 }}>
                    <EditSquareIcon
                      onClick={() => handleEdit(task)}
                      className='m-2 cursor-pointer'
                    />
                    <DeleteOutlineIcon
                      onClick={() => handleDelete(task._id)}
                      color="error"
                      className="m-2 cursor-pointer"
                    />
                  </div>
                  {/* ) : null} */}
              </CardContent>
            </Card>
          </Grid>
          // );
        ))}
        </Grid>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <Button variant="contained" onClick={openAddTask} endIcon={<AddTaskIcon />} className="h-max w-max">
          Add Task
        </Button>
      </div>

      {addTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-200 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={closeForm}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold mb-4">
              {editingTask ? "Edit Task" : "Add Task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <InputText
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <InputText
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <Calendar
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <Dropdown
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.value)}
                  options={allStatus}
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select a Status"
                  className="w-full"
                />
              </div>
              {/* {IsAdmin = true && IsAdmin} */}
              {isAdmin?.role === "admin" && (

                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign To</label>
                  <Dropdown
                    value={formData.assignedTo || ""}
                    onChange={(e) => handleChange('assignedTo', e.value)}
                    options={users}
                    optionLabel="username"
                    optionValue="_id"
                    placeholder="Select a User"
                    className="w-full"
                  // disabled={isAdmin && isAdmin.role === "user"}
                  />
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<AddTaskIcon />}
                  className="h-max w-max"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found</p>
        ) : (
          renderTaskCards()
        )}
      </div>
    </div>
  );
};

export default MainTask;
