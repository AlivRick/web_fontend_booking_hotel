import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { approveRental, getRentals } from "../utils/ApiFunction";

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const result = await getRentals();
        setRentals(result || []);
        setFilteredRentals(result || []);
      } catch (error) {
        setErrorMessage(`Error fetching rentals: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleApprove = async (id) => {
    try {
      const result = await approveRental(id);
      setSuccessMessage(result);
      setRentals((prev) =>
        prev.map((rental) =>
          rental.id === id ? { ...rental, approved: true } : rental
        )
      );
      setFilteredRentals((prev) =>
        prev.map((rental) =>
          rental.id === id ? { ...rental, approved: true } : rental
        )
      );
    } catch (error) {
      setErrorMessage(`Error approving rental: ${error.message}`);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    setFilteredRentals(
      rentals.filter(
        (rental) =>
          rental.firstName.toLowerCase().includes(value) ||
          rental.lastName.toLowerCase().includes(value) ||
          rental.email.toLowerCase().includes(value)
      )
    );
  };

  if (loading) return <CircularProgress style={{ margin: "20px auto", display: "block" }} />;

  return (
    <div className="rental-list">
      <Typography variant="h4" gutterBottom>
        Rental Users Management
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={handleFilterChange}
      />

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.firstName}</TableCell>
                  <TableCell>{rental.lastName}</TableCell>
                  <TableCell>{rental.email}</TableCell>
                  <TableCell>
                    {rental.approved ? "Approved" : "Not Approved"}
                  </TableCell>
                  <TableCell>
                    {!rental.approved && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(rental.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No rental users available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RentalList;