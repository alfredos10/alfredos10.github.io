// src/types.ts
export interface Game {
    id: number;
    date: string;
    home_team: {
      full_name: string;
      abbreviation: string;
    };
    visitor_team: {
      full_name: string;
      abbreviation: string;
    };
    home_team_score: number;
    visitor_team_score: number;
  }
  
  export interface GameWithHighlights extends Game {
    isCloseGame: boolean;
  }