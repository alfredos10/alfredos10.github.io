// src/components/GameList.tsx
import React, { useEffect, useState } from 'react';
import { fetchGames } from '../api';
import { addHighlightFlag } from '../utils';
import { GameWithHighlights } from '../types';
import GameCard from './GameCard';
import { CircularProgress, Box, Typography } from '@mui/material';

const GameList: React.FC = () => {
  const [games, setGames] = useState<GameWithHighlights[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      const data = await fetchGames();
      const gamesWithHighlights = addHighlightFlag(data);
      setGames(gamesWithHighlights);
      setLoading(false);
    };
    loadGames();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ marginTop: 2 }}>
        Today's NBA Games
      </Typography>
      {games.length > 0 ? (
        games.map((game) => <GameCard key={game.id} game={game} />)
      ) : (
        <Typography variant="body1" align="center">
          No games today.
        </Typography>
      )}
    </Box>
  );
};

export default GameList;