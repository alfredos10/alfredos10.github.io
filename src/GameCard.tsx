// src/components/GameCard.tsx
import React from 'react';
import { GameWithHighlights } from '../types';
import { Card, CardContent, Typography, Chip } from '@mui/material';

interface GameCardProps {
  game: GameWithHighlights;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {game.home_team.full_name} vs {game.visitor_team.full_name}
        </Typography>
        <Typography variant="body1">
          {game.home_team.abbreviation} {game.home_team_score} - {game.visitor_team.abbreviation} {game.visitor_team_score}
        </Typography>
        {game.isCloseGame && (
          <Chip label="Close Game - Watch Highlights!" color="success" sx={{ marginTop: 1 }} />
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;