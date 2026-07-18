import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { StadiumProvider, useStadiumState } from './StadiumContext';

// Simple helper component to check context values
const TestComponent = () => {
  const { liveStats, matchInfo, triggerNextMatchMinute } = useStadiumState();
  return (
    <div>
      <span data-testid="attendance">{liveStats.attendance}</span>
      <span data-testid="score">{matchInfo.score}</span>
      <span data-testid="minute">{matchInfo.minute}</span>
      <button data-testid="tick-btn" onClick={triggerNextMatchMinute}>Tick</button>
    </div>
  );
};

describe('StadiumContext Telemetry Provider Tests', () => {
  it('should initialize with starting parameters', () => {
    render(
      <StadiumProvider>
        <TestComponent />
      </StadiumProvider>
    );

    expect(screen.getByTestId('attendance')).toHaveTextContent('69420');
    expect(screen.getByTestId('score')).toHaveTextContent('USA 1 - 1 ENG');
    expect(screen.getByTestId('minute')).toHaveTextContent('72');
  });

  it('should advance the timeline when tick function is executed', () => {
    render(
      <StadiumProvider>
        <TestComponent />
      </StadiumProvider>
    );

    const btn = screen.getByTestId('tick-btn');
    act(() => {
      btn.click();
    });

    expect(screen.getByTestId('minute')).toHaveTextContent('73');
  });
});
