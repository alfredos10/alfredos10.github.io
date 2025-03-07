// import React, { useEffect, useState } from 'react';
// import { fetchGames, Game } from './api';
// import { isWorthWatching } from './utils';
// import { Container, Typography, Paper, Grid, Chip } from '@mui/material';

// const App: React.FC = () => {
//   const [games, setGames] = useState<Game[]>([]);

//   useEffect(() => {
//     const getGames = async () => {
//       const data = await fetchGames();
//       setGames(data);
//     };
//     getGames();
//   }, []);

//   return (
//     <Container>
//       <Typography variant="h3" align="center" gutterBottom>
//         NBA Games Today
//       </Typography>
//       <Grid container spacing={3}>
//         {games.map((game) => (
//           <Grid item xs={12} sm={6} md={4} key={game.id}>
//             <Paper elevation={3} style={{ padding: '16px' }}>
//               <Typography variant="h5">
//                 {game.home_team.full_name} vs {game.visitor_team.full_name}
//               </Typography>
//               <Typography variant="body1">
//                 {game.home_team.abbreviation} {game.home_team_score} - {game.visitor_team.abbreviation} {game.visitor_team_score}
//               </Typography>
//               {isWorthWatching(game) && (
//                 <Chip
//                   label="Worth Watching"
//                   color="primary"
//                   style={{ marginTop: '8px' }}
//                 />
//               )}
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default App;

function splitTeamNames(teamString: string): { homeTeam: string, visitorTeam: string } | null {
    const teams = teamString.trim().split(' - ');

    if (teams.length === 2) {
        return {
            visitorTeam: teams[0],  // The first part is the visitor team
            homeTeam: teams[1],     // The second part is the home team
        };
    }

    console.error("Invalid input format. Expected format: 'Visitor Team - Home Team'");
    return null;
}

// Updated GameList function
function displayGameList(gamesMap: Map<string, boolean>) {
    // Iterate over each game in the Map
    gamesMap.forEach((isHighlightWorthy, gameKey) => {
        const teamNames = splitTeamNames(gameKey);

        if (teamNames) {
            const { visitorTeam, homeTeam } = teamNames;
            const highlightStatus = isHighlightWorthy ? "Highlight Worthy" : "Not Highlight Worthy";
            
            console.log(`Game: ${visitorTeam} vs ${homeTeam} - Status: ${highlightStatus}`);
        } else {
            console.log(`Error with game data: ${gameKey}`);
        }
    });
}

// function splitTeamNames(teamString: string): { homeTeam: string, visitorTeam: string } | null {
//     // Trim any extra whitespace and split the string by the hyphen
//     const teams = teamString.trim().split(' - ');

//     // Ensure the input contains exactly two team names
//     if (teams.length === 2) {
//         return {
//             homeTeam: teams[1],    // The second part is the home team
//             visitorTeam: teams[0], // The first part is the visitor team
//         };
//     }

//     // If the input is invalid, return null
//     console.error("Invalid input format. Expected format: 'Visitor Team - Home Team'");
//     return null;
// }



// const GameList: React.FC<{ games: Game[] }> = ({ games }) => (
//     <div>
//       {games.map((game) => (
//         <div key={game.id} style={{ border: isHighlightWorthy(game) ? '2px solid gold' : 'none' }}>
//           <h3>{game.home_team.full_name} vs. {game.visitor_team.full_name}</h3>
//           <p>Score: {game.home_team_score} - {game.visitor_team_score}</p>
//         </div>
//       ))}
//     </div>
//   );
  