



import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import axios from 'axios'

const apiUrl = process.env.REACT_APP_API_URL;
const FeedPage = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const [likes, setLikes] = useState([]); // To store like status for each video


  useEffect(() => {
    fetchVideos();

   
  }, []);


  const fetchVideos = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/videos/videos`);
      const updatedVideos = data.map(video => ({
        ...video,
        videoUrl: video.videoUrl.replace(/^http:/, 'https:') // Replace http with https
      }));
      setVideos(updatedVideos);
      setComments(updatedVideos.map(() => []));
      setLikes(updatedVideos.map(() => 0)); // Initially setting all likes to 0
    } catch (err) {
      console.error(err);
    }
  };
  



  const handleLike = (index) => {
    const token = localStorage.getItem("authToken"); // Ensure the user is authenticated
    console.log("Token found:", token); 
    if (!token) {
      console.log('no token present')
      alert("You must be logged in to like.");
      return;
    }
    setLikes((prevLikes) => {
      const newLikes = [...prevLikes];
      newLikes[index] = newLikes[index] === 1 ? 0 : 1; // Toggle between 0 and 1
      return newLikes;
    });
  };
  
  const handleCommentClick = () => setIsCommentDialogOpen(true);


  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("authToken"); // Ensure the user is authenticated
    console.log("Token found:", token); 
    if (!token) {
      console.log('no token present')
      alert("You must be logged in to submit a comment.");
      return;
    }
  
    try {
      const videoId = videos[currentIndex]?._id;
      const response = await axios.post(
        `${apiUrl}/videos/comment/${videoId}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } } // Pass the token for backend validation
      );
  
      const newComment = { text: commentText };
      setComments((prevComments) => {
        const updatedComments = [...prevComments];
        updatedComments[currentIndex].push(newComment);
        return updatedComments;
      });
      setCommentText("");
      setIsCommentDialogOpen(false);
    } catch (err) {
      console.error("Failed to submit comment:", err);
    }
  };
  

 

  const handleDownload = async () => {
    const videoUrl = videos[currentIndex]?.videoUrl;
    if (videoUrl) {
      try {
        console.log("Attempting to download video from:", videoUrl);
        const response = await fetch(videoUrl);
        if (!response.ok) {
          console.error(`Failed to fetch video. Status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `video-${currentIndex + 1}.mp4`;
        link.click();
  
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading the video:", error);
      }
    }
  };
  
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = videoRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setCurrentIndex(index);
              // Set video quality to 360p when it comes into view
              videoRefs.current[index].playbackRate = 1; // Default playbackRate
              videoRefs.current[index].setAttribute("playsinline", "true"); // Important for mobile
              videoRefs.current[index].setAttribute("muted", "muted");
              videoRefs.current[index].setAttribute("poster", ""); // Optional poster image to hide loading screen
              console.log("Video at index", index, "set to 360p");
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the video is in view
    );

    videoRefs.current.forEach((video) => {
      observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "90vh",
      backgroundColor: "#1a1a1a",
      mt: 4,
    }}
  >
    <Box
      ref={containerRef}
      sx={{
        width: 350,
        height: 550,
        backgroundColor: "#2e2e2e",
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
        overflow: "auto",
        backgroundImage: "linear-gradient(135deg, #232323, #1a1a1a)",
        backgroundSize: "cover",
      }}
    >
      {videos.map((video, index) => (
        <CardMedia
          key={video._id}
          component="video"
          src={video.videoUrl}
          controls
          ref={(el) => (videoRefs.current[index] = el)}
          autoPlay={index === currentIndex}
          loop
          muted
          controlsList="nodownload noplaybackrate"
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ))}
    </Box>
  
    <Box
      sx={{
        position: "absolute",
        top: "70%",
        right: "34%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <IconButton
        sx={{ color: "#8e44ad", "&:hover": { color: "#9b59b6" } }}
        onClick={() => handleLike(currentIndex)}
      >
        <FavoriteIcon />
      </IconButton>
      <Typography sx={{ color: "#ddd", fontSize: "0.8rem", textAlign: "center" }}>
        {likes[currentIndex] || 0} {/* Display the like count (0 or 1) */}
      </Typography>
      <IconButton
        sx={{ color: "#8e44ad", "&:hover": { color: "#9b59b6" } }}
        onClick={handleCommentClick}
      >
        <CommentIcon />
      </IconButton>
      <IconButton
        sx={{ color: "#8e44ad", "&:hover": { color: "#9b59b6" } }}
        onClick={handleDownload}
      >
        <DownloadIcon />
      </IconButton>
    </Box>
  
    <Button
      variant="contained"
      sx={{
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#8e44ad",
        color: "#fff",
        width: 60,
        height: 60,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": { backgroundColor: "#9b59b6" },
        boxShadow: "0 8px 20px rgba(142, 68, 173, 0.8)",
      }}
      onClick={() => navigate("/upload")}
    >
      <AddIcon />
    </Button>
  
    <Dialog
      open={isCommentDialogOpen}
      onClose={() => setIsCommentDialogOpen(false)}
    >
      <DialogTitle sx={{ backgroundColor: "#2e2e2e", color: "#ddd" }}>Add a Comment</DialogTitle>
      <DialogContent>
        <TextField
          label="Comment"
          variant="outlined"
          fullWidth
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ backgroundColor: "#1a1a1a", borderRadius: 10, input: { color: "#ddd" } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCommentDialogOpen(false)} sx={{ color: "#8e44ad" }}>
          Cancel
        </Button>
        <Button onClick={handleCommentSubmit} color="primary">
          Post
        </Button>
      </DialogActions>
    </Dialog>
  
    <Box
      sx={{
        padding: "10px",
        color: "#ddd",
        maxHeight: "200px",
        overflowY: "auto",
        backgroundColor: "#1a1a1a",
      }}
    >
      {comments[currentIndex]?.map((comment, index) => (
        <Typography key={index} sx={{ marginBottom: "8px" }}>
          {comment.text}
        </Typography>
      ))}
    </Box>
  </Box>
  
  );
};

export default FeedPage;
