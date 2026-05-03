import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';
import { questions } from '@/data/questions';

describe('QuizQuestion Component', () => {
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders question and options', () => {
    render(<QuizQuestion questionIndex={0} onAnswer={mockOnAnswer} />);
    expect(screen.getByText(questions[0].q)).toBeInTheDocument();
    questions[0].opts.forEach(opt => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('provides correct feedback for correct answer', () => {
    render(<QuizQuestion questionIndex={0} onAnswer={mockOnAnswer} />);
    
    const correctOptIndex = questions[0].ans;
    const correctOpt = screen.getByText(questions[0].opts[correctOptIndex]);
    
    fireEvent.click(correctOpt);
    
    expect(mockOnAnswer).toHaveBeenCalledWith(true);
    expect(screen.getByText(questions[0].feedback)).toBeInTheDocument();
  });

  it('provides feedback for wrong answer', () => {
    render(<QuizQuestion questionIndex={0} onAnswer={mockOnAnswer} />);
    
    const wrongOptIndex = (questions[0].ans + 1) % questions[0].opts.length;
    const wrongOpt = screen.getByText(questions[0].opts[wrongOptIndex]);
    
    fireEvent.click(wrongOpt);
    
    expect(mockOnAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByText(questions[0].wrongFeedback)).toBeInTheDocument();
  });

  it('handles last question button text', () => {
    const lastIndex = questions.length - 1;
    render(<QuizQuestion questionIndex={lastIndex} onAnswer={mockOnAnswer} />);
    
    const opt = screen.getByText(questions[lastIndex].opts[0]);
    fireEvent.click(opt);
    
    expect(screen.getByText(/See Results/i)).toBeInTheDocument();
  });

  it('advances on next button click', () => {
    render(<QuizQuestion questionIndex={0} onAnswer={mockOnAnswer} />);
    
    const opt = screen.getByText(questions[0].opts[0]);
    fireEvent.click(opt);
    
    const nextBtn = screen.getByText(/Next Question/i);
    fireEvent.click(nextBtn);
    
    expect(mockOnAnswer).toHaveBeenCalledWith(null);
  });

  it('prevents multiple selections', () => {
    render(<QuizQuestion questionIndex={0} onAnswer={mockOnAnswer} />);
    
    const opts = screen.getAllByRole('radio');
    fireEvent.click(opts[0]);
    fireEvent.click(opts[1]);
    
    expect(mockOnAnswer).toHaveBeenCalledTimes(1);
  });
});
