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


export function generateYouTubeLinks(jsonInput: any, teamMatchups: string[]): Map<string, string> {
  const linksMap = new Map<string, string>();

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
    "CLIPPERS": "Los Angeles Clippers",
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
  // Get the current date in PST
  const currentDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Regular expression to match the pattern "| FULL GAME HIGHLIGHTS | <current date>"
  const pattern = new RegExp(`\\| FULL GAME HIGHLIGHTS \\| ${currentDate}$`);

  // Iterate through the items in the JSON input
  jsonInput.items.forEach((item: any) => {
    const title = item.snippet.title;
    const videoId = item.id.videoId;

    // Check if the title matches the pattern
    if (pattern.test(title)) {
      // Extract the teams from the title (e.g., "WARRIORS at NETS")
      const teamsInTitle = title.split(" | ")[0];

      // Split into home and away teams
      const [awayTeamAbbr, homeTeamAbbr] = teamsInTitle.split(" at ");

      // Map abbreviated team names to full team names
      const awayTeam = teamNameMap[awayTeamAbbr.toUpperCase()];
      const homeTeam = teamNameMap[homeTeamAbbr.toUpperCase()];

      // Check if the teams are in the teamMatchups array
      const matchup = teamMatchups.find((matchup) => {
        const [team1, team2] = matchup.split(" - ");
        return (
          (team1 === awayTeam && team2 === homeTeam) ||
          (team1 === homeTeam && team2 === awayTeam)
        );
      });

      // If a matchup is found, add the link and teams to the result
      if (matchup) {
        const youtubeLink = `https://www.youtube.com/watch?v=${videoId}&ab_channel=NBA`;
        linksMap.set(matchup, youtubeLink);
      }
    }
  });

  return linksMap;
}

// function generateYouTubeLinks(jsonInput: any): string[] {
//   const links: string[] = [];

//   // Regular expression to match the pattern
//   const pattern = /\| FULL GAME HIGHLIGHTS \|/;
//   // Iterate through the items in the JSON input
//   jsonInput.items.forEach((item: any) => {
//     const title = item.snippet.title;
//     console.log(`Title: ${title}`);
//     const videoId = item.id.videoId;

//     // Check if the title matches the pattern
//     if (pattern.test(title)) {
//       // Build the YouTube link
//       const youtubeLink = `https://www.youtube.com/watch?v=${videoId}&ab_channel=NBA`;
//       links.push(youtubeLink);
//     }
//   });

//   return links;
// }

// Example usage
export const jsonInput = {
  "kind": "youtube#searchListResponse",
  "etag": "iGVCjGLdKAhNGV7u-ntctQ7BrUk",
  "nextPageToken": "CBkQAA",
  "regionCode": "US",
  "pageInfo": {
    "totalResults": 1000000,
    "resultsPerPage": 25
  },
  "items": [
    {
      "kind": "youtube#searchResult",
      "etag": "OFT7agn43b3iCrDlQv_yGfa2nJo",
      "id": {
        "kind": "youtube#video",
        "videoId": "y4-5Hz1Q0SI"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:25:53Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "WARRIORS at NETS | FULL GAME HIGHLIGHTS | March 6, 2025",
        "description": "The Warriors defeated the Nets, 121-119 tonight in Brooklyn. Stephen Curry contributed a team-high 40 points to go with 7 three ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/y4-5Hz1Q0SI/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/y4-5Hz1Q0SI/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/y4-5Hz1Q0SI/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:25:53Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "Hr5vzjXHpA1AmlRnW2g0WOQQURU",
      "id": {
        "kind": "youtube#video",
        "videoId": "pIUNFzJa_9c"
      },
      "snippet": {
        "publishedAt": "2025-03-07T06:26:26Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "KNICKS at LAKERS | FULL GAME HIGHLIGHTS | March 6, 2025",
        "description": "Never miss a moment with the latest news, trending stories and highlights to bring you closer to your favorite players and teams.",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/pIUNFzJa_9c/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/pIUNFzJa_9c/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/pIUNFzJa_9c/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T06:26:26Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "KzKEzUz-FKclQ3Xv5Fhelri1jSQ",
      "id": {
        "kind": "youtube#video",
        "videoId": "9gUMtcW_MoU"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:18:26Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "76ERS at CELTICS | FULL GAME HIGHLIGHTS | March 6, 2025",
        "description": "The Celtics defeated the 76ers, 123-105 tonight in Boston. Jayson Tatum contributed a team-high 35 points to go with 7 rebounds ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/9gUMtcW_MoU/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/9gUMtcW_MoU/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/9gUMtcW_MoU/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:18:26Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "eEKCMgP8bEVpWlRCIqF6v-zPONk",
      "id": {
        "kind": "youtube#video",
        "videoId": "6OUpYwH7g0g"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:22:00Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "PACERS at HAWKS | FULL GAME HIGHLIGHTS | March 6, 2025",
        "description": "The Hawks defeated the Pacers, 124-118 tonight in Atlanta. Georges Niang contributed a team-high 24 points to go with 6 ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/6OUpYwH7g0g/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/6OUpYwH7g0g/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/6OUpYwH7g0g/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:22:00Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "sZkQa95dv3x3EYYgAwV4H6SQSMA",
      "id": {
        "kind": "youtube#video",
        "videoId": "xWoVjLOp8BU"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:13:36Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "BULLS at MAGIC | FULL GAME HIGHLIGHTS | March 6, 2025",
        "description": "The Bulls defeated the Magic, 125-123 tonight in Orlando. Coby White contributed a team-high 44 points to go with 7 three ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/xWoVjLOp8BU/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/xWoVjLOp8BU/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/xWoVjLOp8BU/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:13:36Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "sJSpEZHMorjxfD1aQQr2l1OWBdc",
      "id": {
        "kind": "youtube#video",
        "videoId": "urzerE7nX3E"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:46:33Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "ROCKETS at PELICANS | FULL GAME HIGHLIGHTS | March 6, 2025",
        "description": "The Rockets defeated the Pelicans, 109-97 tonight in New Orleans. Alperen Sengun contributed a team-high 22 points to go with ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/urzerE7nX3E/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/urzerE7nX3E/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/urzerE7nX3E/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:46:33Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "dUdSHrBny7fLLticnwo1hqWKSjY",
      "id": {
        "kind": "youtube#video",
        "videoId": "KRrGXIkbW8E"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:33:01Z",
        "channelId": "UC0LrZO9wORIqn_aRJtKdgfA",
        "title": "Atlanta Hawks vs Indiana Pacers Full Game Highlights - March 6, 2025 | NBA Regular Season",
        "description": "GAMETIME HIGHLIGHTS is your home for ALL NBA HIGHLIGHTS! SUBSCRIBE Here: https://bit.ly/3S8ObFW #nbahighlights ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/KRrGXIkbW8E/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/KRrGXIkbW8E/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/KRrGXIkbW8E/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "GAMETIME HIGHLIGHTS",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:33:01Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "Nqn07jyUPJ7l9A2Kw1nbsY61Bws",
      "id": {
        "kind": "youtube#video",
        "videoId": "cES0gJVSUcQ"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:22:38Z",
        "channelId": "UCqQo7ewe87aYAe7ub5UqXMw",
        "title": "Golden State Warriors vs Brooklyn Nets - Full Game Highlights | March 6, 2025 NBA Season",
        "description": "Golden State Warriors vs Brooklyn Nets - Full Game Highlights | March 6, 2025 | 2024-25 NBA Regular Season ⛽ SUBSCRIBE ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/cES0gJVSUcQ/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/cES0gJVSUcQ/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/cES0gJVSUcQ/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "House of Highlights",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:22:38Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "-63gZgDaCaY06YHkXmhc0Ja_zV0",
      "id": {
        "kind": "youtube#video",
        "videoId": "Pv53aZ74lrg"
      },
      "snippet": {
        "publishedAt": "2025-03-07T00:00:05Z",
        "channelId": "UCUnRn1f78foyP26XGkRfWsA",
        "title": "Women-Led Games Showcase | March 2025",
        "description": "Women-Led Games Showcase returns for our March event on March 6th, 4pm PT/ 7pm ET! Hosted by pinkfairyflower, we'll be ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/Pv53aZ74lrg/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/Pv53aZ74lrg/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/Pv53aZ74lrg/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "GameSpot Trailers",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T00:00:05Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "_Oz2LKmLzqseNDUljCXaE2xeYgk",
      "id": {
        "kind": "youtube#video",
        "videoId": "FI7vzvAt4LE"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:22:38Z",
        "channelId": "UC0LrZO9wORIqn_aRJtKdgfA",
        "title": "Boston Celtics vs Philadelphia 76ers Full Game Highlights - March 6, 2025 | NBA Regular Season",
        "description": "GAMETIME HIGHLIGHTS is your home for ALL NBA HIGHLIGHTS! SUBSCRIBE Here: https://bit.ly/3S8ObFW #nbahighlights ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/FI7vzvAt4LE/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/FI7vzvAt4LE/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/FI7vzvAt4LE/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "GAMETIME HIGHLIGHTS",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:22:38Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "2wJKhbzsRBQ8Jvrv824RNYxFvSk",
      "id": {
        "kind": "youtube#video",
        "videoId": "AMXy_sYLmFk"
      },
      "snippet": {
        "publishedAt": "2025-03-07T02:57:47Z",
        "channelId": "UCqQo7ewe87aYAe7ub5UqXMw",
        "title": "Philadelphia 76ers vs Boston Celtics - Full Game Highlights | March 6, 2025 NBA Season",
        "description": "Philadelphia 76ers vs Boston Celtics - Full Game Highlights | March 6, 2025 | 2024-25 NBA Regular Season ⛽ SUBSCRIBE TO ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/AMXy_sYLmFk/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/AMXy_sYLmFk/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/AMXy_sYLmFk/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "House of Highlights",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T02:57:47Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "1TPOR4C618Zczd04PIDIqpY7XcY",
      "id": {
        "kind": "youtube#video",
        "videoId": "GubvfgQ0vSE"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:29:03Z",
        "channelId": "UC0LrZO9wORIqn_aRJtKdgfA",
        "title": "Golden State Warriors vs Brooklyn Nets Full Game Highlights - March 6, 2025 | NBA Regular Season",
        "description": "GAMETIME HIGHLIGHTS is your home for ALL NBA HIGHLIGHTS! SUBSCRIBE Here: https://bit.ly/3S8ObFW #nbahighlights ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/GubvfgQ0vSE/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/GubvfgQ0vSE/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/GubvfgQ0vSE/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "GAMETIME HIGHLIGHTS",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:29:03Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "RyZ-WEhLcUIdfN63JhJArQji3h8",
      "id": {
        "kind": "youtube#video",
        "videoId": "mY_gTNcGoCU"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:17:49Z",
        "channelId": "UC0LrZO9wORIqn_aRJtKdgfA",
        "title": "Chicago Bulls vs Orlando Magic Full Game Highlights - March 6, 2025 | NBA Regular Season",
        "description": "GAMETIME HIGHLIGHTS is your home for ALL NBA HIGHLIGHTS! SUBSCRIBE Here: https://bit.ly/3S8ObFW #nbahighlights ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/mY_gTNcGoCU/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/mY_gTNcGoCU/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/mY_gTNcGoCU/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "GAMETIME HIGHLIGHTS",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:17:49Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "GqTzPikGmtBi361wfSBo91kcWFc",
      "id": {
        "kind": "youtube#video",
        "videoId": "y0wc1JbrE3M"
      },
      "snippet": {
        "publishedAt": "2025-03-07T06:09:16Z",
        "channelId": "UCqQo7ewe87aYAe7ub5UqXMw",
        "title": "New York Knicks vs Los Angeles Lakers - Full Game Highlights | March 6, 2025 | 2024-25 NBA Season",
        "description": "New York Knicks vs Los Angeles Lakers - Full Game Highlights | March 6, 2025 | 2024-25 NBA Regular Season ⛽ SUBSCRIBE ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/y0wc1JbrE3M/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/y0wc1JbrE3M/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/y0wc1JbrE3M/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "House of Highlights",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T06:09:16Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "Z0J6mLhSwlmVIesuN7SzCTa02tU",
      "id": {
        "kind": "youtube#video",
        "videoId": "U936MmbH7CQ"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:51:38Z",
        "channelId": "UC0LrZO9wORIqn_aRJtKdgfA",
        "title": "Houston Rockets vs New Orleans Pelicans Full Game Highlights - March 6, 2025 | NBA Regular Season",
        "description": "GAMETIME HIGHLIGHTS is your home for ALL NBA HIGHLIGHTS! SUBSCRIBE Here: https://bit.ly/3S8ObFW #nbahighlights ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/U936MmbH7CQ/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/U936MmbH7CQ/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/U936MmbH7CQ/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "GAMETIME HIGHLIGHTS",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:51:38Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "1M94bj9d-ASPaU2tPvg0Imi5uEw",
      "id": {
        "kind": "youtube#video",
        "videoId": "NeNFGifLk_o"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:18:52Z",
        "channelId": "UCEjOSbbaOfgnfRODEEMYlCw",
        "title": "Golden State Warriors Full Team Highlights vs Nets | March 6, 2025 | FreeDawkins",
        "description": "Join Our Telegram Channel For Exclusive And Early Releases - https://t.me/FreeDawkinsOfficial ❗ Support and Join this channel ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/NeNFGifLk_o/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/NeNFGifLk_o/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/NeNFGifLk_o/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "FreeDawkins",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:18:52Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "osOD_kCQqjMSIZjsWNOZiE_Jk34",
      "id": {
        "kind": "youtube#video",
        "videoId": "0QJcnweF2HM"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:28:16Z",
        "channelId": "UC4AdyrgAPEPZUILlQu7_NHg",
        "title": "Los Angeles Lakers vs New York Knicks Full Highlights 1st Qtr | Mar 6 | 2025 NBA Highlights",
        "description": "nba #nbahighlights #nbahighlightstoday #nbagamehighlight Los Angeles Lakers vs New York Knicks Full Highlights 1st Qtr | Mar ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/0QJcnweF2HM/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/0QJcnweF2HM/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/0QJcnweF2HM/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Warriors Empire",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:28:16Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "2HjlmNLS3FRQguOs2kDFcFdE2fE",
      "id": {
        "kind": "youtube#video",
        "videoId": "ZiAOiyc-I3A"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:21:42Z",
        "channelId": "UCqQo7ewe87aYAe7ub5UqXMw",
        "title": "Warriors vs Nets 😱 INTENSE ENDING - FINAL 3 MINUTES 🔥 March 6, 2025",
        "description": "Golden State Warriors vs Brooklyn Nets - Full Game Highlights | March 6, 2025 | 2024-25 NBA Regular Season ⛽ SUBSCRIBE ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/ZiAOiyc-I3A/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/ZiAOiyc-I3A/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/ZiAOiyc-I3A/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "House of Highlights",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:21:42Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "wJ_ofnRKeWmnWKGOlpWtK7zWy1Q",
      "id": {
        "kind": "youtube#video",
        "videoId": "OcM9CErZfPs"
      },
      "snippet": {
        "publishedAt": "2025-03-07T05:42:25Z",
        "channelId": "UCqQo7ewe87aYAe7ub5UqXMw",
        "title": "Knicks vs Lakers GOES TO OVERTIME 😱 WILD Final 2 Minutes 🔥 March 6, 2025",
        "description": "New York Knicks vs Los Angeles Lakers - Full Game Highlights | March 6, 2025 | 2024-25 NBA Regular Season ⛽ SUBSCRIBE ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/OcM9CErZfPs/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/OcM9CErZfPs/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/OcM9CErZfPs/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "House of Highlights",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T05:42:25Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "iHXTzGDy531rIWoN8MJsdkyqWFw",
      "id": {
        "kind": "youtube#video",
        "videoId": "9lc_EZ1pS34"
      },
      "snippet": {
        "publishedAt": "2025-03-07T05:09:58Z",
        "channelId": "UCqFMzb-4AUf6WAIbl132QKA",
        "title": "NHL Highlights | Canadiens vs. Oilers | March 06, 2025",
        "description": "Watch full game highlights from the matchup between the Montréal Canadiens and the Edmonton Oilers on March 06, 2025, ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/9lc_EZ1pS34/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/9lc_EZ1pS34/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/9lc_EZ1pS34/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NHL",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T05:09:58Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "cqMZWRQNMZvrp-fqH8EPoykQ-JY",
      "id": {
        "kind": "youtube#video",
        "videoId": "eggtrczhG5k"
      },
      "snippet": {
        "publishedAt": "2025-03-06T18:27:16Z",
        "channelId": "UCVEUrGYpMXPkJqO5-egU2dQ",
        "title": "New York Yankees vs Minnesota Twins Full Game Highlights Mar 6, 2025 | MLB Highlights 2025",
        "description": "Yankees #Twins #MLB New York Yankees vs Minnesota Twins [FULL GAME] Highlights Mar 6, 2025 | MLB Highlights 2025 New ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/eggtrczhG5k/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/eggtrczhG5k/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/eggtrczhG5k/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Let's Go Yankees",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-06T18:27:16Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "RyAmAkRb3cDNyiRU7-d5w8BAmqs",
      "id": {
        "kind": "youtube#video",
        "videoId": "ucd6vxaffvw"
      },
      "snippet": {
        "publishedAt": "2025-03-06T21:39:54Z",
        "channelId": "UCpRRJy1szEIiumx1idE4-Mw",
        "title": "Knicks vs. Lakers Live Streaming Scoreboard, Play-By-Play, Highlights, Stats &amp; Analysis | NBA on TNT",
        "description": "New York Knicks vs. Los Angeles Lakers live on Knicks Now by Chat Sports for today's Warriors vs. Knicks NBA game. Tonight's ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/ucd6vxaffvw/default_live.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/ucd6vxaffvw/mqdefault_live.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/ucd6vxaffvw/hqdefault_live.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Knicks Now by Chat Sports",
        "liveBroadcastContent": "live",
        "publishTime": "2025-03-06T21:39:54Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "YoNCO2vBRzKI2AVLEFY2CdknDP8",
      "id": {
        "kind": "youtube#video",
        "videoId": "i6Cvpdap8Bw"
      },
      "snippet": {
        "publishedAt": "2025-03-07T06:08:28Z",
        "channelId": "UCEjOSbbaOfgnfRODEEMYlCw",
        "title": "Los Angeles Lakers Full Team Highlights vs Knicks | March  6, 2025 | FreeDawkins",
        "description": "Join Our Telegram Channel For Exclusive And Early Releases - https://t.me/FreeDawkinsOfficial ❗ Support and Join this channel ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/i6Cvpdap8Bw/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/i6Cvpdap8Bw/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/i6Cvpdap8Bw/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "FreeDawkins",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T06:08:28Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "5tKbbDe5EOtsX0tlK8Hw7qMkZCk",
      "id": {
        "kind": "youtube#video",
        "videoId": "tKUHE1KDCNU"
      },
      "snippet": {
        "publishedAt": "2025-03-06T02:41:29Z",
        "channelId": "UCWJ2lWNubArHWmf3FIHbfcQ",
        "title": "TRAIL BLAZERS at CELTICS | FULL GAME HIGHLIGHTS | March 5, 2025",
        "description": "The Celtics defeated the Trail Blazers, 128-118 tonight in Boston. Payton Pritchard finished with a team-high 43 points along with ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/tKUHE1KDCNU/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/tKUHE1KDCNU/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/tKUHE1KDCNU/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "NBA",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-06T02:41:29Z"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "_CbVTLFN_ygrgoMNVHuhHxdbD2Y",
      "id": {
        "kind": "youtube#video",
        "videoId": "4S33CDLOCGc"
      },
      "snippet": {
        "publishedAt": "2025-03-07T03:47:43Z",
        "channelId": "UCJfwOC9hns1fuZv8nhLGQDw",
        "title": "Germany vs. Brazil (2nd Place Game) | 2025 World Baseball Classic Qualifiers",
        "description": "Germany takes on Brazil in the World Baseball Classic Qualifiers! 4 teams are vying for 2 spots in the 2026 World Baseball ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/4S33CDLOCGc/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/4S33CDLOCGc/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/4S33CDLOCGc/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "World Baseball Classic",
        "liveBroadcastContent": "none",
        "publishTime": "2025-03-07T03:47:43Z"
      }
    }
  ]
};








export const LoadGameData: any = async () => {
    console.log("inside LoadGameData");
    try {
        const todayDate = getNextDaysDateInPST();
        // searchByKeyword();
//         const youtubeLinks = generateYouTubeLinks(jsonInput);
// console.log(youtubeLinks); // Output: Array of YouTube links
        console.log("nextDayDate is " + todayDate);
        // await handleClientLoad();
        console.log("loaded client");
        const response = await fetchGames(todayDate);
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
        const options = {
            method: 'GET',
            url: 'https://api-nba-v1.p.rapidapi.com/games',
            // params: {date: date},
            params: {date: '2025-03-07'},

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

// Process API response and extract games
export function buildGame(games: any[]): Map<string, number[]> {
    const builtGames = new Map<string, number[]>();

    games.forEach((game) => {
        if (!checkNull(game)) {
            builtGames.set(getTeamNames(game), getScores(game));
        }
    });

    return builtGames;
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

// Determine if a game is close
export function isCloseGame(dailyGames: Map<string, number[]>): boolean[] {
    return Array.from(dailyGames.values()).map((scoreArr) => checkOT(scoreArr) || checkScore(scoreArr));
}

// Check if a game went to overtime
function checkOT(scores: number[]): boolean {
    return scores.length > 4;
}

// Check if the final score difference is within 5 points
function checkScore(score: number[]): boolean {
    return Math.abs(score[0] - score[1]) <= 5;
}

// Display results
// function showResults(games: Map<string, number[]>, results: boolean[]): void {
//     Array.from(games.keys()).forEach((teamName, index) => {
//         console.log(`${teamName} : ${results[index]}`);
//     });
// }

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

// const useStyles = makeStyles({
//   card: {
//     marginBottom: 16, // Space between cards
//     padding: '16px',   // Padding inside the card
//   },
//   chip: {
//     marginTop: 8, // Space between text and the Chip component
//   },
// });


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


// main().catch(console.error);

