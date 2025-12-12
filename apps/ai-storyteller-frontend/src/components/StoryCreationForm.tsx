import React, { useState } from "react";
import { motion } from "framer-motion";
import { StoryAPI, type StoryRequest, type StoryResponse } from "../utils/api";

const themes = [
  { id: "adventure", name: "Adventure", emoji: "🗺️", color: "bg-primary-blue" },
  { id: "space", name: "Space", emoji: "🚀", color: "bg-primary-purple" },
  { id: "magic", name: "Magic", emoji: "✨", color: "bg-primary-pink" },
  { id: "animals", name: "Animals", emoji: "🦁", color: "bg-primary-green" },
  {
    id: "friendship",
    name: "Friendship",
    emoji: "👫",
    color: "bg-primary-yellow",
  },
];

export const StoryCreationForm: React.FC<{
  onStoriesGenerated: (stories: StoryResponse[]) => void;
}> = ({ onStoriesGenerated }) => {
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("adventure");
  const [lessonOfDay, setLessonOfDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingCount, setGeneratingCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !age) return;

    setLoading(true);
    setGeneratingCount(0);
    try {
      const request: StoryRequest = {
        child_name: childName,
        age: parseInt(age),
        theme: selectedTheme,
        lesson_of_day: lessonOfDay || undefined,
      };

      // Generate 3 story options
      const storyPromises = [];
      for (let i = 0; i < 3; i++) {
        storyPromises.push(
          StoryAPI.createStory(request).then((story) => {
            setGeneratingCount((prev) => prev + 1);
            return story;
          })
        );
      }

      const stories = await Promise.all(storyPromises);
      onStoriesGenerated(stories);
    } catch (error) {
      console.error("Failed to create stories:", error);
      alert("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-storybook-bg to-white rounded-3xl shadow-xl border-4 border-storybook-accent"
    >
      <h2
        className="text-4xl font-bold text-center mb-8 text-gray-800"
        style={{ fontFamily: "Fredoka One, cursive" }}
      >
        🎭 Create Your Magical Story! ✨
      </h2>

      <p className="text-center text-gray-600 mb-8 text-lg">
        👨‍👩‍👧 Parent's Corner: Customize your child's story adventure!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xl font-bold text-gray-700 mb-2">
            👋 Child's Name
          </label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Enter your child's name..."
            className="w-full px-6 py-4 text-lg rounded-2xl border-4 border-primary-yellow focus:outline-none focus:ring-4 focus:ring-primary-yellow/50"
            required
          />
        </div>

        <div>
          <label className="block text-xl font-bold text-gray-700 mb-2">
            🎂 Child's Age
          </label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-2xl border-4 border-primary-green focus:outline-none focus:ring-4 focus:ring-primary-green/50"
            required
          >
            <option value="">Select age...</option>
            {Array.from({ length: 10 }, (_, i) => i + 3).map((a) => (
              <option key={a} value={a}>
                {a} years old
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xl font-bold text-gray-700 mb-2">
            💡 Lesson or Moral (Optional)
          </label>
          <textarea
            value={lessonOfDay}
            onChange={(e) => setLessonOfDay(e.target.value)}
            placeholder="What lesson would you like this story to teach? (e.g., 'sharing is caring', 'being kind to others', 'facing your fears')..."
            className="w-full px-6 py-4 text-lg rounded-2xl border-4 border-primary-pink focus:outline-none focus:ring-4 focus:ring-primary-pink/50 min-h-[100px] resize-y"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-2">
            💭 Help guide the story's message. Leave blank for a fun adventure
            without a specific lesson.
          </p>
        </div>

        <div>
          <label className="block text-xl font-bold text-gray-700 mb-4">
            🌟 Story Theme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-2xl border-4 transition-all ${
                  selectedTheme === theme.id
                    ? `${theme.color} text-white border-white scale-105`
                    : "border-gray-300 hover:border-gray-400 hover:scale-105"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-2">{theme.emoji}</div>
                <div className="font-bold">{theme.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !childName || !age}
          className="w-full playful-button bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink text-white text-xl disabled:opacity-50"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              🪄 Creating {generatingCount}/3 Story Options...
            </span>
          ) : (
            "🎭 Generate 3 Story Options!"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
