import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from './page';
import FanPage from './fan/page';
import DashboardPage from './dashboard/page';
import { StadiumProvider } from '../context/StadiumContext';
import { ThemeProvider } from '../context/ThemeContext';

// Mock window.open for PDF print window triggers
beforeAll(() => {
  window.open = jest.fn();
});

describe('App Route Page Render Tests', () => {
  it('should render the Landing Page successfully', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Predict Disruption/i)).toBeInTheDocument();
    expect(screen.getByText(/Smart Stadium OS/i)).toBeInTheDocument();
  });

  it('should render the Fan Page successfully', () => {
    render(
      <StadiumProvider>
        <ThemeProvider>
          <FanPage />
        </ThemeProvider>
      </StadiumProvider>
    );
    expect(screen.getByText(/Spectator Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/Voice Dictation Support/i)).toBeInTheDocument();
  });

  it('should render the Dashboard Page successfully', () => {
    render(
      <StadiumProvider>
        <ThemeProvider>
          <DashboardPage />
        </ThemeProvider>
      </StadiumProvider>
    );
    expect(screen.getByText(/Live Stadium Digital Twin/i)).toBeInTheDocument();
    expect(screen.getByText(/Sustainability Grid Ledger/i)).toBeInTheDocument();
  });
});
