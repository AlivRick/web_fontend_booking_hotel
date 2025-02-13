import React, { useEffect, useState } from 'react';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getAllUser } from '../utils/ApiFunction'; // Ensure the path is correct to your API call

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUser(); // Get all users from the API
        console.log(data); // Log the data to verify the structure
        setUsers(data); // Set the users in the state
      } catch (err) {
        setError('Error fetching users'); // Set an error message if the fetch fails
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <CircularProgress />; // Show loading spinner while fetching
  if (error) return <p style={{ color: 'red' }}>{error}</p>; // Show error message if there's an issue

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Roles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roleName ? user.roleName : 'No Role'}</TableCell> {/* Ensure no extra whitespace here */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
