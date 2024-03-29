import React, { useState } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, Typography, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { customErrorCloseStyle, customErrorTitleStyle, customToastStyle, customErrorIconStyle } from './toast'
function UserInputPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState(null);
  const [netraId, setNetraId] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const inputValue = e.target.value.toUpperCase();
    setSearchQuery(inputValue);

    // Return early if searchQuery is empty
    if (!inputValue) {
      setSearchResults([]);
      return;
    }

    // Determine the type of search based on input format
    if (/^\d{10}$/.test(inputValue)) {
      setSearchType('phone');
      try {
        const response = await axios.post('http://localhost:5000/api/search', { searchInput: inputValue });
        setSearchResults(response.data.slice(0, 5)); // Display only the first 5 results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else if (/^\d{1,9}$/.test(inputValue)) {
      setSearchType('partialPhone');
      try {
        const response = await axios.post('http://localhost:5000/api/search', { searchInput: inputValue });
        setSearchResults(response.data.slice(0, 5)); // Display only the first 5 results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else if (/^2[a-zA-Z0-9]+$/.test(inputValue)) {
      setSearchType('hallticketno');
      try {
        const response = await axios.post('http://localhost:5000/api/search', { searchInput: inputValue });
        setSearchResults(response.data.slice(0, 5)); // Display only the first 5 results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchType('name');
      try {
        const response = await axios.post('http://localhost:5000/api/search', { searchInput: inputValue });
        setSearchResults(response.data.slice(0, 5)); // Display only the first 5 results
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  const getResultText = (result) => {
    switch (searchType) {
      case 'name':
        return ` ${result.firstname}`;
      case 'hallticketno':
        return ` ${result.hallticketno}`;
      case 'phone':
        return `${result.phone}`;
      case 'partialPhone':
        return `${result.phone}`;
      default:
        return '';
    }
  };
 
  
  
  
  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/netra-id', {
        searchType: searchType,
        searchValue: searchQuery
      });
      // Handle the response from the backend
      console.log(response.data); // Log the retrieved Netra ID or handle it as needed
      setNetraId(response.data);
      if (response.data) {
        navigate('/options'); // Replace '/anotherpage' with your desired URL
      } else {
        // Display error message if Netra ID is null or invalid
        toast.error('Not a valid phone number, hall ticket number, or name.', {
          // position: toast.POSITION.TOP_CENTER,
          style: customToastStyle,
          icon: <div style={customErrorIconStyle}><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-13h-4v8h4V7zm-1 5h-2v-2h2v2z" /></svg></div>,
          closeButton: <div style={customErrorCloseStyle}><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L1 12h3v10h14V12h3L12 1zm5 11l-1.41 1.41L12 13.41l-3.59 3.59L7 12.59 10.59 9 7 5.41 8.41 4 12 7.59l3.59-3.59L17 5.41 13.41 9 17 12.59 15.59 14 12 10.41 8.41 14 7 12.59 10.59 9 12 10.41z" /></svg></div>,
          closeButtonClassName: 'error__close',
        })
      }
    } catch (error) {
      console.error('Error fetching Netra ID:', error);
    }
  };

  const handleResultClick = (result) => {
    setSearchQuery(getResultText(result).trim());
  };

  return (
    <Container maxWidth="sm" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ToastContainer position="top-center" />
      
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="h4" align="center">
            Welcome to KMIT Student Portal
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" align="center">
            Access your academic profile, attendance, results, and provide feedback.
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Enter Name, Hall Ticket No., or Phone No."
            fullWidth
            variant="outlined"
          />
        </Grid>
        
        <Grid item>
          <Button variant="contained" color="primary"  onClick={handleSearch} startIcon={<SearchIcon />}>
            Search
          </Button>
        </Grid>
        {/* Conditionally render the list of results only if searchQuery is not empty */}
        {searchQuery && (
          <Grid item>
            <List>
              {searchResults.map((result, index) => (
                <ListItem key={index} button onClick={() => handleResultClick(result)}>
                  <ListItemText primary={getResultText(result)} />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default UserInputPage;
