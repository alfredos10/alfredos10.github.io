import { useEffect, useState } from 'react'
import './App.css'
import { buildGame, LoadGameData, splitTeamNames, nbaTeamsAbbreviation, generateYouTubeLinks, jsonInput } from './api';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  card: {
    marginBottom: 16, // Space between cards
    padding: '16px',   // Padding inside the card
  },
  chip: {
    marginTop: 8, // Space between text and the Chip component
  },
});



// function serializeMap(map: Map<string, any>): string {
//   return JSON.stringify(Array.from(map.entries()));
// }



// function deserializeMap(serializedMap: string): Map<string, any> {
//   return new Map(JSON.parse(serializedMap));
// }

// function loadMapFromFile(filePath: string): Map<string, any> {
//   const serializedMap = fs.readFileSync(filePath, 'utf-8');
//   return deserializeMap(serializedMap);
// }

// Function to save data as a file in the browser
// const saveMapToFile = (data: Map<string, number[]>, fileName: string) => {
//   const jsonString = JSON.stringify(Array.from(data.entries()));
//   const blob = new Blob([jsonString], { type: 'application/json' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = fileName;
//   link.click();
//   URL.revokeObjectURL(url);
// };

function App() {
  // LoadGameData();
  const classes = useStyles();

  // const gamesData = await LoadGameData();
  const [gamesData, setGamesData] = useState<Map<string, number[]> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [youtubeLinks, setYoutubeLinks] = useState<Map<string, string> | null>(null);
  // const [revealScore, setRevealScore] = useState<boolean>(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate an API call or async operation
        const data = await LoadGameData(); // Replace with your actual data fetching logic
        const gamesArray = data.response || [];
        // const results = isCloseGame(builtGames);
        const builtGames = buildGame(gamesArray);
        setGamesData(builtGames);
        console.log("builtGAmes are " + builtGames);
        console.log(builtGames);

        const youtubeLinks = generateYouTubeLinks(jsonInput, Array.from(builtGames.keys()) as string[]);
        setYoutubeLinks(youtubeLinks);
        console.log("youtubeLinks are " + youtubeLinks);
        console.log(youtubeLinks);


        // Save the data to a file
        // const filePath = '03-04-NBAGames.json';
        // saveMapToFile(builtGames, filePath);
        // console.log('Finished saving file');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gamesData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {Array.from(gamesData.entries()).map(([gameKey, scores]) => {
        const teamNames = splitTeamNames(gameKey);
        if (!teamNames) return null;

        const { visitorTeam, homeTeam } = teamNames;
        const [visitorScore, homeScore] = scores;
        const highlightStatus = Math.abs(visitorScore - homeScore) <= 5;

        const homeAbbreviation = nbaTeamsAbbreviation.get(homeTeam) || homeTeam;
        const visitorAbbreviation = nbaTeamsAbbreviation.get(visitorTeam) || visitorTeam;
        const currLink = youtubeLinks?.get(gameKey) || '';
        return (
          <Card className={classes.card} key={`${homeTeam}-${visitorTeam}`}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {homeTeam} vs {visitorTeam}
              </Typography>
              { !highlightStatus && <Typography variant="body1">
                {homeAbbreviation} {homeScore} - {visitorAbbreviation} {visitorScore}
              </Typography>}
              {!highlightStatus && currLink && (
                <a href={currLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Chip
                    label="Not a Close Game, But Watch Highlights Anyway!"
                    color="error"
                    className={classes.chip}
                  />
                </a>
              )}
              {/* <Chip
            label="Show"
            color="error"
            onClick={() => setRevealScore(!revealScore)}
            className={classes.chip}
          /> */}
              {highlightStatus && (
                <a href={currLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Chip
                    label="Close Game - Watch Highlights!"
                    color="success"
                    className={classes.chip}
                  />
                </a>
              )}

              {/* {highlightStatus && (
                <Chip label="Close Game - Watch Highlights!" color="success" className={classes.chip}  />
              )} */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default App
