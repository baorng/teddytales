import React from 'react';
import { motion } from 'framer-motion';
import { StoryAPI } from '../utils/api';
import { type StoryResponse } from '../utils/api';

interface ChoiceButtonsProps {
  story: StoryResponse;
  onChoiceMade: (newStory: StoryResponse) => void;
  loading: boolean;
}

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ 
  story, 
  onChoiceMade, 
  loading 
}) => {
  const handleChoice = async (choice: string) => {
    console.log('Choice clicked:', choice);
    console.log('Story data:', story);
    
    try {
      // Use the StoryAPI continue-story method
      const newStory = await StoryAPI.continueStory(story.segment_id, choice);

      console.log('New story data:', newStory);
      onChoiceMade(newStory);
    } catch (error) {
      console.error('Failed to continue story:', error);
      alert(`Oops! Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!story.choice_question || story.is_conclusion) {
    return null;
  }

  // Extract choices from the question (improved parsing)
  const question = story.choice_question;
  
  // Try different patterns for choice extraction
  let choiceA = 'Continue exploring';
  let choiceB = 'Try something new';
  
  // Pattern 1: "Should [name] [A] or [B]?"
  const shouldMatch = question.match(/Should\s+\w+\s+(.+?)\s+or\s+(.+?)\?/i);
  if (shouldMatch) {
    choiceA = shouldMatch[1].trim();
    choiceB = shouldMatch[2].trim();
  } else {
    // Pattern 2: "[A] or [B]?"
    const orMatch = question.match(/(.+?)\s+or\s+(.+?)\?/i);
    if (orMatch) {
      choiceA = orMatch[1].trim();
      choiceB = orMatch[2].trim();
    } else {
      // Pattern 3: Split by "or" without question mark
      const splitOr = question.split(/\s+or\s+/i);
      if (splitOr.length === 2) {
        choiceA = splitOr[0].trim();
        choiceB = splitOr[1].trim().replace(/[?.!]+$/, ''); // Remove punctuation
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8 md:p-10 bg-gradient-to-br from-lavender-50 to-sky-50 rounded-xl border-2 border-earth-300 shadow-page relative"
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-earth-200 border-l-[30px] border-l-transparent opacity-60"></div>
      
      <h3 className="text-3xl font-bold text-earth-800 mb-4 heading-handwritten">
        What Happens Next?
      </h3>
      
      <p className="text-xl text-earth-700 mb-8 font-display leading-relaxed max-w-2xl mx-auto">
        {question}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6 max-w-3xl mx-auto">
        <motion.button
          onClick={() => handleChoice(choiceA)}
          disabled={loading}
          className="storybook-button bg-gradient-to-br from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] flex items-center justify-center"
          whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -3 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="font-display">Continuing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3 px-2">
              <span className="text-3xl">👈</span>
              <span className="font-display font-semibold text-left flex-1">{choiceA}</span>
            </span>
          )}
        </motion.button>

        <motion.button
          onClick={() => handleChoice(choiceB)}
          disabled={loading}
          className="storybook-button bg-gradient-to-br from-sunset-400 to-sunset-500 hover:from-sunset-500 hover:to-sunset-600 text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] flex items-center justify-center"
          whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -3 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="font-display">Continuing...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3 px-2">
              <span className="text-3xl">👉</span>
              <span className="font-display font-semibold text-left flex-1">{choiceB}</span>
            </span>
          )}
        </motion.button>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-earth-600 text-lg font-display italic"
        >
          The tale continues... ✨
        </motion.div>
      )}
    </motion.div>
  );
};