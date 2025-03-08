import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from 'react'
import './App.css'
import { buildGame, LoadGameData, splitTeamNames, nbaTeamsAbbreviation, generateYouTubeLinks } from './api';
import { Card, CardContent, Typography, Chip, Box, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { youtubeData } from './YoutubeData';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: 16,
    padding: '16px',
  },
  chip: {
    marginTop: 8,
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px', // Add spacing between chips
  },
  link: {
    display: 'flex', // Ensure the link aligns properly
    alignItems: 'center', // Vertically center the link content
    textDecoration: 'none', // Remove underline from the link
  },

}));



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
  const [closeGameStatuses, setCloseGameStatuses] = useState<boolean[]>([]);
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
        const { builtGames, closeGameStatuses } = buildGame(gamesArray);//+

        // const builtGames: Map<string, number[]>, closeGameStatusestatusArr: boolean[] = buildGame(gamesArray);
        setGamesData(builtGames);
        console.log("builtGAmes are " + builtGames);
        console.log(builtGames);
        setCloseGameStatuses(closeGameStatuses);
        console.log("closeGameStatuses are " + closeGameStatuses);



        const youtubeLinks = generateYouTubeLinks(youtubeData, Array.from(builtGames.keys()) as string[]);
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

  // async function handleChange(event: SelectChangeEvent<any>, child: ReactNode): Promise<void> {
  //   const date = event.target.value;
  //   const nbaData = await LoadGameData(date);
  //   setSelectedDate(date);
  //   setGamesData(nbaData);
  //   const gamesArray = nbaData.response || [];
  //   // const results = isCloseGame(builtGames);
  //   const builtGames = buildGame(gamesArray);
  //   setGamesData(builtGames);
  //   const youtubeLinks = generateYouTubeLinks(youtubeData, Array.from(builtGames.keys()) as string[]);
  //   setYoutubeLinks(youtubeLinks);
  // }

  const handleDateChange = async (date: string) => {
    console.log("inside handleDateChange");

    console.log("date is " + date);
    const nbaData = await LoadGameData(date);
    console.log("nbaData is " + nbaData);
    console.log(nbaData);
    const gamesArray = nbaData.response || [];
    const { builtGames, closeGameStatuses } = buildGame(gamesArray);//+
    console.log("builtGames are " + builtGames);
    console.log(builtGames);
    setGamesData(builtGames);
    setCloseGameStatuses(closeGameStatuses);

    const youtubeLinks = generateYouTubeLinks(youtubeData, Array.from(builtGames.keys()));
    setYoutubeLinks(youtubeLinks);
  };

  return (

    <div>
         <Header onDateChange={handleDateChange} />

      {/* <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Date</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedDate}
            label="Date"
            onChange={(event) => handleChange(event, child)}}
          >
            <MenuItem value={"March 5, 2025"}>March 5, 2025</MenuItem>
            <MenuItem value={"March 6, 2025"}>March 6, 2025</MenuItem>
            <MenuItem value={"March 7, 2025"}>March 7, 2025</MenuItem>
          </Select>
        </FormControl>
      </Box> */}
      {Array.from(gamesData.entries()).map(([gameKey, scores]: [string, number[]], i: number) => {
        const teamNames = splitTeamNames(gameKey);
        if (!teamNames) return null;

        const { visitorTeam, homeTeam } = teamNames;
        const [visitorScore, homeScore] = scores;

        const homeAbbreviation = nbaTeamsAbbreviation.get(homeTeam) || homeTeam;
        const visitorAbbreviation = nbaTeamsAbbreviation.get(visitorTeam) || visitorTeam;
        const currLink = youtubeLinks?.get(gameKey) || '';
        return (
          <Card className={classes.card} key={`${homeTeam}-${visitorTeam}`}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {homeTeam} vs {visitorTeam}
              </Typography>
              {!closeGameStatuses[i] && <Typography variant="body1">
                {homeAbbreviation} {homeScore} - {visitorAbbreviation} {visitorScore}
              </Typography>}
              {!closeGameStatuses[i] && currLink && (
                <a href={currLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Chip
                    label="Not a Close Game, But Watch Highlights Anyway!"
                    color="error"
                    className={classes.chip}
                  />
                </a>
              )}
              {closeGameStatuses[i] && (
                <Box className={classes.chipContainer}>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* Chip to indicate the game is close */}
                    <Chip
                      label="Close Game"
                      color="success"
                      className={classes.chip}
                    />

                    {/* Chip to watch highlights (only shown if a link is available) */}
                    {currLink && (
                      <a href={currLink} target="_blank" rel="noopener noreferrer" className={classes.link}>
                        <Chip
                          label="Watch Highlights!"
                          color="primary"
                          className={classes.chip}
                          clickable // Make the chip clickable
                        />
                      </a>
                    )}
                  </Stack>
                </Box>

              )}
              {/* {closeGameStatuses[i] && (
                <a href={currLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Chip
                    label="Close Game - Watch Highlights!"
                    color="success"
                    className={classes.chip}
                  />
                </a>
              )} */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default App
