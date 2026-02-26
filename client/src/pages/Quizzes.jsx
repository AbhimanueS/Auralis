import { useState } from 'react';

const QUIZ = [
  {
    q: 'What do you call a mood that’s too lazy to be sad?',
    options: ['Blah', 'Meh', 'Zzz', 'Nope'],
    correct: 1,
  },
  {
    q: 'Best way to calm down when stressed?',
    options: ['Scream into a pillow', 'Eat the whole fridge', 'Take 3 deep breaths', 'Refresh Twitter 50 times'],
    correct: 2,
  },
  {
    q: 'A brain on a Monday morning is like ___',
    options: ['A well-rested genius', 'A browser with 47 tabs open', 'A calm lake', 'A finished to-do list'],
    correct: 1,
  },
  {
    q: 'What’s the official sound of “I need a break”?',
    options: ['*sigh*', 'Yeehaw', 'Beep boop', 'Silence'],
    correct: 0,
  },
  {
    q: 'When someone says “How are you?” and you’re not fine, you usually say ___',
    options: ['The full truth', '“Great, you?”', '“Send help”', '“It’s a long story”'],
    correct: 1,
  },
  {
    q: 'The best part of a bad day is ___',
    options: ['That it ends', 'The snacks', 'Blaming the weather', 'All of the above'],
    correct: 3,
  },
  {
    q: 'What does your brain do at 2 a.m.?',
    options: ['Sleep peacefully', 'Replay every awkward moment from 2010', 'Plan tomorrow', 'Count sheep'],
    correct: 1,
  },
  {
    q: 'Self-care can look like ___',
    options: ['Bubble bath', 'Saying no to plans', 'Extra nap', 'All of the above'],
    correct: 3,
  },
  {
    q: 'A “mental health day” means ___',
    options: ['Calling in and actually resting', 'Working from bed with guilt', 'Doing 10 errands', 'Answering 100 emails'],
    correct: 0,
  },
  {
    q: 'Finish the sentence: “It’s okay to ___”',
    options: ['Have off days', 'Ask for help', 'Not be productive 24/7', 'All of the above'],
    correct: 3,
  },
];

export default function Quizzes() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ[current];
  const isLast = current === QUIZ.length - 1;

  const handleOptionClick = (optionIndex) => {
    if (showResult) return;
    setSelected(optionIndex);
    setShowResult(true);
    if (optionIndex === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setShowResult(false);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-auralis-green-dark mb-6">Quizzes</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-sky-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">You’re done!</h2>
          <p className="text-3xl font-bold text-auralis-green-dark mb-2">{score} / {QUIZ.length}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {score === QUIZ.length ? 'Perfect! You’re a quiz champion.' : score >= QUIZ.length / 2 ? 'Nice job! Hope it made you smile.' : 'No wrong answers here—just a bit of fun.'}
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green"
          >
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-auralis-green-dark">Quizzes</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">Question {current + 1} of {QUIZ.length}</span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-sky-100 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">{question.q}</h2>
        <ul className="space-y-3">
          {question.options.map((option, index) => {
            const isChosen = selected === index;
            const isCorrect = index === question.correct;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isChosen && !isCorrect;
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleOptionClick(index)}
                  disabled={showResult}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                    showCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : showWrong
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        : showResult
                          ? 'border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-default'
                          : 'border-sky-200 dark:border-gray-600 bg-sky-50/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 hover:border-auralis-green/50 hover:bg-auralis-green/10'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {showCorrect && <span className="ml-2 text-sm">✓ Correct</span>}
                  {showWrong && <span className="ml-2 text-sm">✗ Wrong</span>}
                </button>
              </li>
            );
          })}
        </ul>
        {showResult && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-auralis-green-dark text-white font-medium hover:bg-auralis-green"
            >
              {isLast ? 'See results' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
