// src/features/game/QuizGame.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import QuizGame from './QuizGame';

describe('QuizGame', () => {
  const mockData = {
    title: 'Test Quiz',
    question: 'What is 2+2?',
    options: ['3', '4', '5'],
    answer: 1, // '4'
  };

  it('renders question and options', () => {
    render(<QuizGame data={mockData} onWin={() => {}} />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onWin when correct answer is selected', async () => {
    const handleWin = vi.fn();
    vi.useFakeTimers();

    render(<QuizGame data={mockData} onWin={handleWin} />);

    fireEvent.click(screen.getByText('4'));

    // Use act to wrap timer advancements
    act(() => {
        vi.advanceTimersByTime(1000);
    });

    expect(handleWin).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('does not call onWin when incorrect answer is selected', async () => {
    const handleWin = vi.fn();
    vi.useFakeTimers();

    render(<QuizGame data={mockData} onWin={handleWin} />);

    fireEvent.click(screen.getByText('3'));

    act(() => {
        vi.advanceTimersByTime(1000);
    });

    expect(handleWin).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
