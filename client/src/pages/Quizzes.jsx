import { useState } from 'react';

const QUIZ = [
  { q: 'Little interest or pleasure in doing things', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Feeling down, depressed, or hopeless?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Trouble sleeping or sleeping too much?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Feeling tired or having little energy?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Poor appetite or overeating?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Feeling bad about yourself or feeling like a failure?', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Trouble concentrating on tasks', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Moving or speaking very slowly or feeling restless', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'Thoughts that you would be better off dead or hurting yourself', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
  { q: 'How difficult have these problems made it for you to work or take care of things?', options: ['Not difficult at all', 'Somewhat difficult', 'Very difficult', 'Extremely difficult'] },
];

export default function MentalHealthAssessment() {
  const [current, setCurrent] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ[current];

  const handleOptionClick = (index) => {
    setTotalScore((prev) => prev + index);
    if (current < QUIZ.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  const getResult = (score) => {
    if (score <= 4) return { label: "Minimal symptoms", desc: "You seem to be in a good mental space." };
    if (score <= 9) return { label: "Mild symptoms", desc: "You're doing okay, but might be feeling a bit stressed." };
    if (score <= 14) return { label: "Moderate symptoms", desc: "You've been through a lot lately. Consider talking to someone." };
    return { label: "Severe symptoms", desc: "It might be helpful to reach out to a professional for support." };
  };

  if (finished) {
    const result = getResult(totalScore);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center border border-sky-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Assessment Result</h2>
        <p className="text-4xl font-bold text-blue-600 mb-2">{totalScore}</p>
        <h3 className="text-xl font-semibold mb-2">{result.label}</h3>
        <p className="text-gray-600 mb-6">{result.desc}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-sky-100">
      <div className="mb-6">
        PHQ-9<br />
        <span className="text-sm text-gray-400">Question {current + 1} of {QUIZ.length}</span>
        <h2 className="text-xl font-medium text-gray-800 mt-2">{question.q}</h2>
      </div>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className="w-full text-left px-5 py-4 rounded-xl border-2 border-sky-50 bg-sky-50/30 hover:border-blue-400 hover:bg-blue-50 transition-all font-medium text-gray-700"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}