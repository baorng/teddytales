import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { StoryAPI, type StoryRequest, type StoryResponse } from "../utils/api";

const themes = [
  { id: "adventure", name: "Adventure", emoji: "🗺️", color: "bg-sage-500" },
  { id: "space", name: "Space", emoji: "🚀", color: "bg-sky-500" },
  { id: "magic", name: "Magic", emoji: "✨", color: "bg-lavender-500" },
  { id: "animals", name: "Animals", emoji: "🦁", color: "bg-sage-600" },
  {
    id: "friendship",
    name: "Friendship",
    emoji: "👫",
    color: "bg-sunset-500",
  },
];

export const StoryCreationForm: React.FC<{
  onStoriesGenerated: (stories: StoryResponse[]) => void;
}> = ({ onStoriesGenerated }) => {
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
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
      className="max-w-3xl mx-auto p-8 md:p-12 bg-cream-50 page-texture rounded-2xl shadow-book border-2 border-earth-300 relative"
    >
      {/* Decorative book corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-earth-400 rounded-tl-2xl opacity-40"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-earth-400 rounded-tr-2xl opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-earth-400 rounded-bl-2xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-earth-400 rounded-br-2xl opacity-40"></div>

      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-earth-800 mb-4 heading-handwritten">
          Craft Your Tale
        </h2>
        <p className="text-lg md:text-xl text-earth-600 font-display">
          Tell us about the hero of your story
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="flex items-center gap-2 text-xl font-bold text-earth-800 mb-3 font-display">
            <span className="text-2xl">👋</span>
            Hero's Name
          </label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Who is the brave adventurer?"
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-earth-300 focus:outline-none focus:border-sunset-400 focus:ring-4 focus:ring-sunset-100 bg-white shadow-page font-display transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-bold text-earth-800 mb-3 font-display">
            <span className="text-2xl">🎂</span>
            Hero's Age
          </label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-earth-300 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100 bg-white shadow-page font-display transition-all"
            required
          >
            <option value="">Choose an age...</option>
            {Array.from({ length: 10 }, (_, i) => i + 3).map((a) => (
              <option key={a} value={a}>
                {a} years old
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-bold text-earth-800 mb-3 font-display">
            <span className="text-2xl">📖</span>
            English Level
            <span className="text-sm font-normal text-earth-500 ml-2">
              (Optional)
            </span>
          </label>
          <select
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-earth-300 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 bg-white shadow-page font-display transition-all"
          >
            <option value="">Choose a level...</option>
            <option value="beginner">Beginner - Learning basic words</option>
            <option value="elementary">Elementary - Simple sentences</option>
            <option value="intermediate">
              Intermediate - Comfortable reading
            </option>
            <option value="advanced">Advanced - Rich vocabulary</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-bold text-earth-800 mb-3 font-display">
            <span className="text-2xl">💡</span>
            Story's Lesson
            <span className="text-sm font-normal text-earth-500 ml-2">
              (Optional)
            </span>
          </label>
          <textarea
            value={lessonOfDay}
            onChange={(e) => setLessonOfDay(e.target.value)}
            placeholder="What wisdom should this tale impart? For example: courage, kindness, honesty, friendship..."
            className="w-full px-6 py-4 text-lg rounded-xl border-2 border-earth-300 focus:outline-none focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 bg-white shadow-page min-h-[120px] resize-y font-display transition-all"
            rows={3}
          />
          <p className="text-sm text-earth-500 mt-2 font-display italic">
            Leave blank for a pure adventure without a specific moral
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xl font-bold text-earth-800 mb-4 font-display">
            <span className="text-2xl">🌟</span>
            Story Theme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-5 rounded-xl border-2 transition-all font-display font-semibold ${
                  selectedTheme === theme.id
                    ? `${theme.color} text-white border-white shadow-lg scale-105`
                    : "bg-white border-earth-300 text-earth-700 hover:border-earth-400 shadow-page"
                }`}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-4xl mb-2">{theme.emoji}</div>
                <div className="font-bold text-lg">{theme.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !childName || !age}
          className="w-full storybook-button bg-gradient-to-r from-sunset-400 to-sunset-500 hover:from-sunset-500 hover:to-sunset-600 text-white text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Crafting Tale {generatingCount}/3...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Wand2 className="w-6 h-6" />
              <span>Generate Three Story Options</span>
            </span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};
