import axios from 'axios';

import { format, toZonedTime } from 'date-fns-tz';
import { addDays } from 'date-fns';


// const PATH = "/Users/alfredosantana/desktop/closegame/closegame/src/main/java/todaysGames/gamesData.txt";

// const scopes = "youtube.googleapis.com";
// The Calendar entry to create
//  var resource = {
//     "summary": "Appointment",
//     "location": "Somewhere",
//     "start": {
//       "dateTime": "2011-12-16T10:00:00.000-07:00"
//     },
//     "end": {
//       "dateTime": "2011-12-16T10:25:00.000-07:00"
//     }
//   };

/**
* This function searches for videos related to the keyword 'dogs'. The video IDs and titles
* of the search results are logged to Apps Script's log.
*
* Note that this sample limits the results to 25. To return more results, pass
* additional parameters as documented here:
*   https://developers.google.com/youtube/v3/docs/search/list
*/
// function searchByKeyword() {
//     var results = YouTube.Search.list('id,snippet', {q: 'dogs', maxResults: 25});
//     for(var i in results.items) {
//       var item = results.items[i];
//       Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
//     }
//   }

// async function handleClientLoad() {
//   gapi.load('client'a, initClient);
// }


// function signIn() {
//   gapi.auth2.getAuthInstance().signIn();
// }

// function makeRequest() {
//   gapi.client.request({
//     'path': '/calendar/v3/calendars/primary/events',
//     'method': 'POST',
//     'body': resource
//   }).then(function(resp) {
//       console.log(resp);
//       console.log(resp.result);
//   //   writeResponse(resp.result);
//   });
// }



// function getTodayDateFormatted(): string {
//     const today = new Date();

//     // Get year, month, and day
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const day = String(today.getDate()).padStart(2, '0');

//     // Format as "YYYY-MM-DD"
//     return `${year}-${month}-${day}`;
//   }

//   function getTodaysDateInEST(): string {
//     const now = new Date(); // Current UTC time
//     console.log("now is " + now.toDateString);
//     const estTime = toZonedTime(now, 'America/New_York'); // Convert to EST
//     console.log("estTime is " + estTime.toDateString);
//     // Format the date as "YYYY-MM-DD" in EST
//     return format(estTime, 'yyyy-MM-dd');
//   }

function getNextDaysDateInPST(): string {
  const now = new Date(); // Current UTC time
  const pstTime = toZonedTime(now, 'America/Los_Angeles'); // Convert to PST
  const nextDay = addDays(pstTime, 1); // Add 1 day to the current PST date

  // Format the date as "YYYY-MM-DD" in PST
  return format(nextDay, 'yyyy-MM-dd');
}

function generateHighlightName(team1: string, team2: string): string {
  // Get the current date
  const currentDate = new Date();

  // Format the date as "Month Day, Year"
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Generate the highlight name
  const highlightName = `${team1.toUpperCase()} at ${team2.toUpperCase()} | FULL GAME HIGHLIGHTS | ${formattedDate}`;

  return highlightName;
}

// Example usage:
const team1 = "Warriors";
const team2 = "Nets";
const highlightName = generateHighlightName(team1, team2);
console.log(highlightName); // Output: WARRIORS at NETS | FULL GAME HIGHLIGHTS | March 6, 2025

// function handleClientLoad() {
//   // Load the API client and auth2 library
//   gapi.load('client:auth2', initClient);
// }

// function initClient() {
//   gapi.client.init({
//       apiKey: YOUTUBE_API_KEY,
//       // discoveryDocs: discoveryDocs,
//       clientId: GOOGLE_CLIENT_ID,
//       scope: scopes
//   }).then(function () {
//     console.log('Client library loaded and initialized.');
//     // Listen for sign-in state changes.
//     // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

//     // Handle the initial sign-in state.
//     // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

//     // authorizeButton.onclick = handleAuthClick;
//     // signoutButton.onclick = handleSignoutClick;
//   });
// }

export function generateYouTubeLinks(jsonInput: any, teamMatchups: string[]): Map<string, string> {
  const linksMap = new Map<string, string>();
  console.log("Team matchups: ", teamMatchups);
  console.log("JSON input: ", jsonInput);

  // Map of abbreviated team names to full team names
  const teamNameMap: { [key: string]: string } = {
    "WARRIORS": "Golden State Warriors",
    "NETS": "Brooklyn Nets",
    "PACERS": "Indiana Pacers",
    "HAWKS": "Atlanta Hawks",
    "CELTICS": "Boston Celtics",
    "HORNETS": "Charlotte Hornets",
    "BULLS": "Chicago Bulls",
    "CAVALIERS": "Cleveland Cavaliers",
    "MAVERICKS": "Dallas Mavericks",
    "NUGGETS": "Denver Nuggets",
    "PISTONS": "Detroit Pistons",
    "ROCKETS": "Houston Rockets",
    "CLIPPERS": "LA Clippers",
    "LAKERS": "Los Angeles Lakers",
    "GRIZZLIES": "Memphis Grizzlies",
    "HEAT": "Miami Heat",
    "BUCKS": "Milwaukee Bucks",
    "TIMBERWOLVES": "Minnesota Timberwolves",
    "PELICANS": "New Orleans Pelicans",
    "KNICKS": "New York Knicks",
    "THUNDER": "Oklahoma City Thunder",
    "MAGIC": "Orlando Magic",
    "76ERS": "Philadelphia 76ers",
    "SUNS": "Phoenix Suns",
    "TRAIL BLAZERS": "Portland Trail Blazers",
    "KINGS": "Sacramento Kings",
    "SPURS": "San Antonio Spurs",
    "RAPTORS": "Toronto Raptors",
    "JAZZ": "Utah Jazz",
    "WIZARDS": "Washington Wizards"
  };

  const partialTeamNameMap: { [key: string]: string } = {
    // Eastern Conference
    HAWKS: 'Atlanta Hawks',
    CELTICS: 'Boston Celtics',
    NETS: 'Brooklyn Nets',
    HORNETS: 'Charlotte Hornets',
    BULLS: 'Chicago Bulls',
    CAVALIERS: 'Cleveland Cavaliers',
    PISTONS: 'Detroit Pistons',
    PACERS: 'Indiana Pacers',
    HEAT: 'Miami Heat',
    BUCKS: 'Milwaukee Bucks',
    KNICKS: 'New York Knicks',
    MAGIC: 'Orlando Magic',
    '76ERS': 'Philadelphia 76ers', // Note: Special characters like numbers are allowed
    RAPTORS: 'Toronto Raptors',
    WIZARDS: 'Washington Wizards',

    // Western Conference
    MAVERICKS: 'Dallas Mavericks',
    NUGGETS: 'Denver Nuggets',
    WARRIORS: 'Golden State Warriors',
    ROCKETS: 'Houston Rockets',
    CLIPPERS: 'LA Clippers',
    LAKERS: 'Los Angeles Lakers',
    GRIZZLIES: 'Memphis Grizzlies',
    TIMBERWOLVES: 'Minnesota Timberwolves',
    PELICANS: 'New Orleans Pelicans',
    THUNDER: 'Oklahoma City Thunder',
    SUNS: 'Phoenix Suns',
    TRAILBLAZERS: 'Portland Trail Blazers', // Note: "Trailblazers" is a common alternative spelling
    BLAZERS: 'Portland Trail Blazers', // Short form
    KINGS: 'Sacramento Kings',
    SPURS: 'San Antonio Spurs',
    JAZZ: 'Utah Jazz',
  };

  // Get the current date in PST
  // const currentDate = new Date().toLocaleString('en-US', {
  //   timeZone: 'America/Los_Angeles',
  //   month: 'long',
  //   day: 'numeric',
  //   year: 'numeric'
  // });

  // Regex pattern to match "highlights" case-insensitively
  const highlightsPattern = new RegExp('highlights', 'i');

  // Map of team abbreviations to full team names
  // const teamNameMap: { [key: string]: string } = {
  //   GSW: 'Golden State Warriors',
  //   BKN: 'Brooklyn Nets',
  //   LAL: 'Los Angeles Lakers',
  //   MEM: 'Memphis Grizzlies',
  //   DAL: 'Dallas Mavericks',
  //   // Add all other NBA teams here
  // };

  // Example team matchups (replace with your actual data)
  // const teamMatchups = [
  //   'Golden State Warriors - Brooklyn Nets',
  //   'Los Angeles Lakers - Golden State Warriors',
  //   'Memphis Grizzlies - Dallas Mavericks',
  //   // Add all other matchups here
  // ];

  // Map to store the YouTube links for each matchup
  // const linksMap = new Map<string, string>();

  jsonInput.items.forEach((item: any) => {
    const title = item.snippet.title;
    const videoId = item.id.videoId;

    // Check if the title contains "highlights" (case-insensitive)
    if (highlightsPattern.test(title)) {

      // Regex to extract teams in "TEAM1 at TEAM2" format
      const atRegex = /([A-Za-z\s]+)\s+at\s+([A-Za-z\s]+)/i;
      // Regex to extract teams in "TEAM1 vs TEAM2" format
      const vsRegex = /([A-Za-z\s]+)\s+vs\.?\s+([A-Za-z\s]+)(?:\s+-\s+[A-Za-z\s]+)?/i;

      let team1: string | undefined;
      let team2: string | undefined;

      // First, try to match "TEAM1 at TEAM2"
      const atMatch = title.match(atRegex);
      if (atMatch) {
        [, team1, team2] = atMatch;
      } else {
        // If "at" format not found, try "TEAM1 vs TEAM2"
        const vsMatch = title.match(vsRegex);
        if (vsMatch) {
          [, team1, team2] = vsMatch;

        }
      }

      if (team1 && team2) {
        // Normalize team names (trim and convert to uppercase for abbreviation lookup)
        const team1Normalized = team1.trim().toUpperCase();
        const team2Normalized = team2.trim().toUpperCase();

        // Function to resolve full team name using both maps
        const resolveTeamName = (team: string): string => {
          // Check if the team is an abbreviation (e.g., "GSW")
          if (teamNameMap[team]) {
            return teamNameMap[team];
          }
          // Check if the team is a partial name (e.g., "CLIPPERS")
          const partialMatch = Object.keys(partialTeamNameMap).find((key) =>
            team.includes(key)
          );
          if (partialMatch) {
            return partialTeamNameMap[partialMatch];
          }
          // If no match, return the original team name
          return team;
        };

        // Resolve full team names
        const fullTeam1 = resolveTeamName(team1Normalized);
        const fullTeam2 = resolveTeamName(team2Normalized);

        // Check if the teams are in the teamMatchups array
        const matchup = teamMatchups.find((matchup) => {
          const [teamA, teamB] = matchup.split(' - ');
          return (
            (teamA === fullTeam1 && teamB === fullTeam2) ||
            (teamA === fullTeam2 && teamB === fullTeam1)
          );
        });

        // If a matchup is found, add the link and teams to the result
        if (matchup) {
          const youtubeLink = `https://www.youtube.com/watch?v=${videoId}&ab_channel=NBA`;
          linksMap.set(matchup, youtubeLink);
        }
      } else {
        console.log(`No teams found in title: ${title}`);
      }
    }
  });

  // Track whether an "at" match has already been found for a specific team matchup
  const atMatchesFound = new Set<string>();

  jsonInput.items.forEach((item: any) => {
    const title = item.snippet.title;
    const videoId = item.id.videoId;

    if (highlightsPattern.test(title)) {

      let team1: string | undefined;
      let team2: string | undefined;

      // Regex to extract teams in "TEAM1 at TEAM2" format
      const atRegex = /([A-Za-z\s]+)\s+at\s+([A-Za-z\s]+)/i;
      // Regex to extract teams in "TEAM1 vs TEAM2" format (with trailing words stripped)
      const vsRegex = /([A-Za-z\s]+)\s+vs\.?\s+([A-Za-z\s]+)(?:\s+-\s+[A-Za-z\s]+)?/i;

      // First, try to match "TEAM1 at TEAM2"
      const atMatch = title.match(atRegex);
      const vsMatch = title.match(vsRegex);

      if (atMatch) {
        [, team1, team2] = atMatch;
      } else {
        // If "at" format not found, try "TEAM1 vs TEAM2"
        if (vsMatch) {
          [, team1, team2] = vsMatch;
        }
      }

      if (team1 && team2) {
        // Normalize team names (trim and convert to uppercase for abbreviation lookup)
        const team1Normalized = team1.trim().toUpperCase();
        const team2Normalized = team2.trim().toUpperCase();

        // Function to resolve full team name using both maps
        const resolveTeamName = (team: string): string => {
          // Check if the team is an abbreviation (e.g., "GSW")
          if (teamNameMap[team]) {
            return teamNameMap[team];
          }
          // Check if the team is a partial name (e.g., "HEAT")
          const partialMatch = Object.keys(partialTeamNameMap).find((key) =>
            team.includes(key)
          );
          if (partialMatch) {
            return partialTeamNameMap[partialMatch];
          }
          // If no match, return the original team name
          return team;
        };

        // Resolve full team names
        const fullTeam1 = resolveTeamName(team1Normalized);
        const fullTeam2 = resolveTeamName(team2Normalized);

        // Create a matchup key using the resolved team names
        const teams = [fullTeam1, fullTeam2].sort(); // Sort team names alphabetically
        const matchupKey = `${teams[0]} vs ${teams[1]}`;
        // Check if this matchup already has an "at" match
        if (atMatch) {
          if (!atMatchesFound.has(matchupKey)) {
            atMatchesFound.add(matchupKey); // Mark this matchup as having an "at" match
          } else {
            // Skip this match because an "at" match has already been found for this matchup
            return; // Skip to the next item
          }
        } else if (vsMatch) {
          if (!atMatchesFound.has(matchupKey)) {
          } else {
            // Skip this match because an "at" match has already been found for this matchup
            return; // Skip to the next item
          }
        }

        // Check if the teams are in the teamMatchups array
        const matchup = teamMatchups.find((matchup) => {
          const [teamA, teamB] = matchup.split(' - ');
          return (
            (teamA === fullTeam1 && teamB === fullTeam2) ||
            (teamA === fullTeam2 && teamB === fullTeam1)
          );
        });

        // If a matchup is found, add the link and teams to the result
        if (matchup) {
          const youtubeLink = `https://www.youtube.com/watch?v=${videoId}&ab_channel=NBA`;
          linksMap.set(matchup, youtubeLink);
        }
      } else {
        console.log(`No teams found in title: ${title}`);
      }
    }
  });

  // Regular expression to match the pattern "| FULL GAME HIGHLIGHTS | <current date>"
  // const pattern = new RegExp(`\\| FULL GAME HIGHLIGHTS \\| March 6, 2025`);

  // const pattern = new RegExp(`\\| FULL GAME HIGHLIGHTS \\| ${currentDate}$`);

  // Iterate through the items in the JSON input
  // jsonInput.items.forEach((item: any) => {
  //   const title = item.snippet.title;
  //   const videoId = item.id.videoId;
  //   console.log(`Title: ${title} - Video ID: ${videoId}`);

  //   // Check if the title matches the pattern
  //   if (pattern.test(title)) {
  //       console.log("Match found!");
  //     // Extract the teams from the title (e.g., "WARRIORS at NETS")
  //     const teamsInTitle = title.split(" | ")[0];
  //     console.log(`Teams in title: ${teamsInTitle}`);


  //     // Split into home and away teams
  //     const [awayTeamAbbr, homeTeamAbbr] = teamsInTitle.split(" at ");

  //     // Map abbreviated team names to full team names
  //     const awayTeam = teamNameMap[awayTeamAbbr.toUpperCase()];
  //     const homeTeam = teamNameMap[homeTeamAbbr.toUpperCase()];

  //     // Check if the teams are in the teamMatchups array
  //     const matchup = teamMatchups.find((matchup) => {
  //       console.log("teamsMatchup: ${matchup} - awayTeam: ${awayTeam} - homeTeam: ${homeTeam} - title: ${title} - videoId: ${videoId} - match");
  //       const [team1, team2] = matchup.split(" - ");
  //       return (
  //         (team1 === awayTeam && team2 === homeTeam) ||
  //         (team1 === homeTeam && team2 === awayTeam)
  //       );
  //     });

  //     // If a matchup is found, add the link and teams to the result
  //     if (matchup) {
  //       const youtubeLink = `https://www.youtube.com/watch?v=${videoId}&ab_channel=NBA`;
  //       linksMap.set(matchup, youtubeLink);
  //     }
  //   }
  // });

  return linksMap;
}



export const LoadGameData: any = async (date: string | null) => {
  console.log("inside LoadGameData");
  try {
    const todayDate = getNextDaysDateInPST();
    // searchByKeyword();
    //         const youtubeLinks = generateYouTubeLinks(jsonInput);
    // console.log(youtubeLinks); // Output: Array of YouTube links
    console.log("nextDayDate is " + todayDate);
    // await handleClientLoad();
    const response = await fetchGames(date ? date : todayDate);
    return response;
    // const response = await axios.request(options);
    // console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}


// Fetch NBA games data from API
async function fetchGames(date: string): Promise<any> {
  try {
    console.log("inside fetch games");
    console.log("date in fetchGames is " + date);
    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/games',
      // params: { date: date },
      params: {date: '2025-03-08'},

      headers: {
        'x-rapidapi-key': '44698ba992mshb1ed670882daeb5p1e51e8jsn40da83b1be02',
        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    console.log("options in fetchGames are " + options);
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching games for ${date}:`, error);
    return null;
  }
}

// Function to build games and check if they are close
export function buildGame(games: any[]): { builtGames: Map<string, number[]>; closeGameStatuses: boolean[] } {
  const builtGames = new Map<string, number[]>();
  const closeGameStatuses: boolean[] = [];

  games.forEach((game) => {
    if (!checkNull(game)) {
      const teamNames = getTeamNames(game);
      const scores = getScores(game);
      builtGames.set(teamNames, scores);

      // Check if the game is close
      const isClose = isCloseGame(game);
      closeGameStatuses.push(isClose);
    }
  });

  return { builtGames, closeGameStatuses };
}

// Function to check if a single game is close
export function isCloseGame(game: any): boolean {
  return checkOT(game) || checkScore(getScores(game));
}

// Extract scores from game object
function getScores(game: any): number[] {
  const scores = game.scores;
  const visitorScore = scores.visitors.points ?? 0;
  const homeScore = scores.home.points ?? 0;
  return [visitorScore, homeScore];
}

// Check if scores are missing
function checkNull(game: any): boolean {
  return game.scores.visitors.points === null || game.scores.home.points === null;
}

// Extract team names from game object
function getTeamNames(game: any): string {
  return `${game.teams.visitors.name} - ${game.teams.home.name}`;
}

// Check if a game went to overtime
function checkOT(game: any): boolean {
  return game.scores.home.linescore.length > 4;
}

// Check if the final score difference is within 5 points
function checkScore(score: number[]): boolean {
  return Math.abs(score[0] - score[1]) <= 5;
}


// // Write games data to file
// async function writeGames(data: string) {
//     try {
//         await fs.writeFile(PATH, data);
//     } catch (error) {
//         console.error("Error writing file:", error);
//     }
// }

// Read games data from file
// async function readGames(): Promise<string> {
//     try {
//         return await fs.readFile(PATH, "utf-8");
//     } catch (error) {
//         console.error("Error reading file:", error);
//         return "";
//     }
// }


export function splitTeamNames(teamString: string): { homeTeam: string, visitorTeam: string } | null {
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

export const nbaTeamsAbbreviation = new Map<string, string>([
  ["Atlanta Hawks", "ATL"],
  ["Boston Celtics", "BOS"],
  ["Brooklyn Nets", "BKN"],
  ["Charlotte Hornets", "CHA"],
  ["Chicago Bulls", "CHI"],
  ["Cleveland Cavaliers", "CLE"],
  ["Dallas Mavericks", "DAL"],
  ["Denver Nuggets", "DEN"],
  ["Detroit Pistons", "DET"],
  ["Golden State Warriors", "GSW"],
  ["Houston Rockets", "HOU"],
  ["Indiana Pacers", "IND"],
  ["Los Angeles Clippers", "LAC"],
  ["Los Angeles Lakers", "LAL"],
  ["Memphis Grizzlies", "MEM"],
  ["Miami Heat", "MIA"],
  ["Milwaukee Bucks", "MIL"],
  ["Minnesota Timberwolves", "MIN"],
  ["New Orleans Pelicans", "NOP"],
  ["New York Knicks", "NYK"],
  ["Oklahoma City Thunder", "OKC"],
  ["Orlando Magic", "ORL"],
  ["Philadelphia 76ers", "PHI"],
  ["Phoenix Suns", "PHX"],
  ["Portland Trail Blazers", "POR"],
  ["Sacramento Kings", "SAC"],
  ["San Antonio Spurs", "SAS"],
  ["Toronto Raptors", "TOR"],
  ["Utah Jazz", "UTA"],
  ["Washington Wizards", "WAS"]
]);

export const visitorTeamsAbbreviation = new Map<string, string>([
  ["Atlanta Hawks", "ATL"],
  ["Boston Celtics", "BOS"],
  ["Brooklyn Nets", "BKN"],
  ["Charlotte Hornets", "CHA"],
  ["Chicago Bulls", "CHI"],
  ["Cleveland Cavaliers", "CLE"],
  ["Dallas Mavericks", "DAL"],
  ["Denver Nuggets", "DEN"],
  ["Detroit Pistons", "DET"],
  ["Golden State Warriors", "GSW"],
  ["Houston Rockets", "HOU"],
  ["Indiana Pacers", "IND"],
  ["Los Angeles Clippers", "LAC"],
  ["Los Angeles Lakers", "LAL"],
  ["Memphis Grizzlies", "MEM"],
  ["Miami Heat", "MIA"],
  ["Milwaukee Bucks", "MIL"],
  ["Minnesota Timberwolves", "MIN"],
  ["New Orleans Pelicans", "NOP"],
  ["New York Knicks", "NYK"],
  ["Oklahoma City Thunder", "OKC"],
  ["Orlando Magic", "ORL"],
  ["Philadelphia 76ers", "PHI"],
  ["Phoenix Suns", "PHX"],
  ["Portland Trail Blazers", "POR"],
  ["Sacramento Kings", "SAC"],
  ["San Antonio Spurs", "SAS"],
  ["Toronto Raptors", "TOR"],
  ["Utah Jazz", "UTA"],
  ["Washington Wizards", "WAS"]
]);
