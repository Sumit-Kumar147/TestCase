'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [question, setQuestion] = useState('');
  const [timeConstraints, setTimeConstraints] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/fetchTestCase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, timeConstraints, inputFormat }),
      });

      let data = await res.json();
      console.log("data:",data);
      data = JSON.parse(data);
      const testCasesArray = data.TestCases;
      setTestCases(testCasesArray);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (testCase) => {
    try {
      // Since testCase is an array containing a stringified JSON, we need to parse the first element
      const parsedTestCase = JSON.parse(testCase[0]);
      // Now stringify the parsed object for copying
      const formattedTestCase = JSON.stringify(parsedTestCase);
      navigator.clipboard.writeText(formattedTestCase);
      alert('Test case copied!');
    } catch (error) {
      console.error("Error parsing test case:", error);
      alert('Failed to copy test case.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white p-4">
      <motion.h1
        className="text-5xl font-extrabold mb-8 text-cyan-400 neon-glow"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        DSA Edge Case Generator
      </motion.h1>
      <motion.form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-lg backdrop-blur-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <textarea
          placeholder="Enter DSA question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black text-white border-2 border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          required
        />
        <input
          type="text"
          placeholder="Time constraints"
          value={timeConstraints}
          onChange={(e) => setTimeConstraints(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black text-white border-2 border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          required
        />
        <input
          type="text"
          placeholder="Input format"
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-black text-white border-2 border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          required
        />
        <motion.button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
        >
          {loading ? 'Generating...' : 'Generate Edge Cases'}
        </motion.button>
      </motion.form>

      {testCases.length > 0 && (
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="text-3xl font-semibold mb-6 text-cyan-400">Generated Test Cases:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCases.map((testCase, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-4">Test Case {index + 1}:</h3>
                <div className="bg-black bg-opacity-50 text-white rounded p-4 overflow-x-auto break-words max-h-40">
  {testCase.map((line, lineIndex) => (
    <div key={lineIndex} className="whitespace-pre-wrap">{line}</div>
  ))}
</div>

                <button
                  onClick={() => handleCopy(testCase)}
                  className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg transition-colors"
                >
                  Copy Test Case
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
