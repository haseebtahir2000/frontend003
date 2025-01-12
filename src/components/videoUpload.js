

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Card, CardContent, CircularProgress, IconButton } from '@mui/material';
import api from "../services/api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios'
const UploadPage = () => {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("authToken");
  console.log('upload userid',userId);
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) {
      alert('Please select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userId', userId);

    setLoading(true);

    try {
    
      const response = await axios.post(`${apiUrl}/videos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${userId}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setVideo(null);
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Create Account to upload, like, and comment on the Video';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    navigate('/');
  };

  return (
<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #0d0d0d, #1e1e1e)', // Gradient background
  }}
>
  <Card
    sx={{
      maxWidth: 500,
      width: '100%',
      backgroundColor: '#1a1a1a',
      color: '#f0f0f0',
      borderRadius: '15px',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
    }}
  >
    <CardContent>
      <Typography
        variant="h5"
        sx={{
          color: '#ff4081',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 'bold',
        }}
      >
        Upload Your Video
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            style={{
              margin: '10px 0',
              backgroundColor: '#1e1e1e',
              color: '#f0f0f0',
              padding: '10px',
              borderRadius: '10px',
              border: '2px solid #ff4081',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
            }}
             onFocus={(e) => {
              e.target.style.boxShadow = '0 0 8px rgba(255, 64, 129, 0.8)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />
        </Box>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            marginBottom: '15px',
            backgroundColor: '#1e1e1e',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ff4081' },
              '&:hover fieldset': { borderColor: '#ff4081' },
              '&.Mui-focused fieldset': { borderColor: '#ff4081' },
            },
          }}
          InputLabelProps={{
            style: { color: '#ff4081' },
          }}
          inputProps={{
            style: { color: '#f0f0f0' },
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            marginBottom: '20px',
            backgroundColor: '#1e1e1e',
            borderRadius: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ff4081' },
              '&:hover fieldset': { borderColor: '#ff4081' },
              '&.Mui-focused fieldset': { borderColor: '#ff4081' },
            },
          }}
          InputLabelProps={{
            style: { color: '#ff4081' },
          }}
          inputProps={{
            style: { color: '#f0f0f0' },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: loading ? '#444' : '#ff4081',
            color: '#f0f0f0',
            borderRadius: '10px',
            padding: '12px',
            boxShadow: '0 5px 15px rgba(255, 64, 129, 0.4)',
            '&:hover': {
              backgroundColor: loading ? '#444' : '#ff1e5c',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
          startIcon={
            loading ? <CircularProgress size={24} sx={{ color: '#f0f0f0' }} /> : <CloudUploadIcon />
          }
        >
          {loading ? 'Uploading...' : 'Upload Video'}
        </Button>
        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={handleNavigation}
          sx={{
            mt: 2,
            backgroundColor: '#00bcd4',
            color: '#f0f0f0',
            borderRadius: '10px',
            padding: '12px',
            boxShadow: '0 5px 15px rgba(0, 188, 212, 0.4)',
            '&:hover': {
              backgroundColor: '#0097a7',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          Watch Reels
        </Button>
      </form>
    </CardContent>
  </Card>
</Box>
  );
};

export default UploadPage;
