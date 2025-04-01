import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';

const AllUsers = ({ onUserSelect }) => {
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/users", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        // console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex relative m-3">
      <ToggleButton className='h-max w-max' value="list" aria-label="list" onClick={() => setVisible(true)}>
    <ViewListIcon />
  </ToggleButton>
      <Sidebar 
        visible={visible} 
        onHide={() => setVisible(false)} 
        position="left" 
        className="p-4" 
        style={{ width: '350px' }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <div className="flex gap-2">
            <InputText 
              className="h-8 flex-grow" 
              type="text" 
              placeholder="Search username" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              filteredUsers.map(user => (
                <button
                  key={user._id}
                  className="block w-full text-left bg-white p-2 rounded shadow hover:bg-blue-200 transition"
                  onClick={() => {
                    onUserSelect(user);
                    setVisible(false);
                  }}
                >
                  {user.username}
                </button>
              ))
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default AllUsers;
