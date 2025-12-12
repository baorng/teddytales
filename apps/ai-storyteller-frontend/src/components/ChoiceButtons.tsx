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
      className="text-center p-8 bg-gradient-to-r from-primary-purple/20 to-primary-pink/20 rounded-2xl border-2 border-primary-purple"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🤔 What should happen next?</h3>
      
      <p className="text-xl text-gray-700 font-semibold mb-8">
        {question}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <motion.button
          onClick={() => handleChoice(choiceA)}
          disabled={loading}
          className="playful-button bg-gradient-to-r from-primary-blue to-primary-green text-white text-lg disabled:opacity-50"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating...
            </span>
          ) : (
            <>
              <span className="text-2xl mr-2">👈</span>
              {choiceA}
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => handleChoice(choiceB)}
          disabled={loading}
          className="playful-button bg-gradient-to-r from-primary-yellow to-primary-orange text-white text-lg disabled:opacity-50"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating...
            </span>
          ) : (
            <>
              <span className="text-2xl mr-2">👉</span>
              {choiceB}
            </>
          )}
        </motion.button>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-sm"
        >
          The story is continuing... ✨
        </motion.div>
      )}
    </motion.div>
  );
};