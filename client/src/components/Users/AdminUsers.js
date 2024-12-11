import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./AdminUsers.scss";

const AdminUsers = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/users/all`)
      .then((res) => {
        const data = res.data;
        setUsers(data);
      })
      .catch((err) => console.log("Couldn't receive users list"));
  }, []);

  const openUserDetails = (user) => {
    //props.handleUserDetails(user);
  };

  return (
    <div>
      <div>
        <h1>Users List</h1>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.email}</td>
              <td>{user.fname}</td>
              <td>{user.lname}</td>
              <td>{user.phoneNumber || 'N/A'}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => openUserDetails(user)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers; 