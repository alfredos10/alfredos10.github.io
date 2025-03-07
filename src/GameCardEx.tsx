import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Define your custom styles using makeStyles
const useStyles = makeStyles({
  card: {
    marginBottom: 16, // Space between cards
    padding: '16px',   // Padding inside the card
  },
  chip: {
    marginTop: 8, // Space between text and the Chip component
  },
});

const GameCardEx = () => {
    console.log("inside gameCardEx");
  // Get styles from the hook
  const classes = useStyles();

  // Example data (Replace with dynamic data in real use case)
  const homeTeam = "Denver Nuggets";
  const visitorTeam = "Charlotte Hornets";
  const homeScore = 107;
  const visitorScore = 104;
  const homeAbbreviation = "DEN";
  const visitorAbbreviation = "CHA";
  const highlightStatus = true; // You can set this based on game conditions

  // Conditional highlight logic (e.g., close game if difference is <= 5)
  const isCloseGame = Math.abs(homeScore - visitorScore) <= 5;
    console.log("homeTeam is " + homeTeam);
  return (
    <Card className={classes.card} key={`${homeTeam}-${visitorTeam}`}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {homeTeam} vs {visitorTeam}
        </Typography>
        <Typography variant="body1">
          {homeAbbreviation} {homeScore} - {visitorAbbreviation} {visitorScore}
        </Typography>
        {isCloseGame && highlightStatus && (
          <Chip label="Close Game - Watch Highlights!" color="success" className={classes.chip} />
        )}
      </CardContent>
    </Card>
  );
};

export default GameCardEx;