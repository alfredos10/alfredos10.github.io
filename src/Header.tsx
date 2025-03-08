import React, { useEffect, useRef, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS


interface HeaderProps {
    onDateChange: (date: string) => void;
}


const Header: React.FC<HeaderProps> = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState('2025-03-08'); // Default date
    const hasLoadedInitialData = useRef(false); // Flag to track if initial data has been loaded
    // Handle date change
    const handleDateChange = async (event: { target: { value: any; }; }) => {
        const date = event.target.value;
        setSelectedDate(date); // Update selected date
        onDateChange(date); // Trigger parent component to load data
    };

    // Call onDateChange when the component mounts
    useEffect(() => {
        if (!hasLoadedInitialData.current) {
            onDateChange(selectedDate); // Load data for the default date
            hasLoadedInitialData.current = true;
        }
    }, [onDateChange, selectedDate]);

    return (
        <header
            style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                padding: '40px 20px',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Basketball net overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'url(https://www.transparenttextures.com/patterns/basketball.png)',
                    opacity: 0.1,
                    pointerEvents: 'none',
                }}
            />

            {/* Title with basketball icons */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px', // Space between icons and title
                }}
            >
                {/* Left basketball icon */}
                <i
                    className="fas fa-basketball-ball"
                    style={{ fontSize: '3rem', animation: 'bounce 2s infinite' }}
                />

                {/* Title */}
                <h1
                    style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        margin: 0,
                        animation: 'fadeIn 2s ease-in-out',
                    }}
                >
                    Close Game
                </h1>

                {/* Right basketball icon */}
                <i
                    className="fas fa-basketball-ball"
                    style={{ fontSize: '3rem', animation: 'bounce 2s infinite 1s' }}
                />
            </div>

            {/* Subtitle */}
            <p
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 300,
                    marginTop: '10px',
                    animation: 'slideIn 1.5s ease-in-out',
                }}
            >
                Your destination for thrilling NBA highlights
            </p>

            {/* Date Picker */}
            <Box sx={{ minWidth: 120, marginTop: '20px' }}>
                <FormControl fullWidth>
                    <InputLabel id="date-select-label" style={{ color: 'white' }}>
                        Date
                    </InputLabel>
                    <Select
                        labelId="date-select-label"
                        id="date-select"
                        value={selectedDate}
                        label="Date"
                        onChange={handleDateChange}
                        style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        <MenuItem value="2025-03-06">March 5, 2025</MenuItem>
                        <MenuItem value="2025-03-07">March 6, 2025</MenuItem>
                        <MenuItem value="2025-03-08">March 7, 2025</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* CSS Animations */}
            <style>
                {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateX(-20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @media (max-width: 768px) {
            h1 {
              font-size: 3rem;
            }
            p {
              font-size: 1.2rem;
            }
            .fas.fa-basketball-ball {
              font-size: 2rem;
            }
          }
        `}
            </style>
        </header>
    );
};

export default Header;