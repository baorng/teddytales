import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryCreationForm } from "./components/StoryCreationForm";
import { AudioPlayer } from "./components/AudioPlayer";
import { ChoiceButtons } from "./components/ChoiceButtons";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { StoryAPI, type StoryResponse } from "./utils/api";
import { Sparkles, Wand2, Volume2, BookOpen } from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState<
    "welcome" | "create" | "select" | "story"
  >("welcome");
  const [storyOptions, setStoryOptions] = useState<StoryResponse[]>([]);
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentAnimated, setContentAnimated] = useState(false);

  const handleStoriesGenerated = (stories: StoryResponse[]) => {
    // Always show selection page with story options
    setStoryOptions(stories);
    setCurrentView("select");
  };

  const handleStorySelected = (selectedStory: StoryResponse) => {
    setStory(selectedStory);
    setImageLoaded(false);
    setContentAnimated(false);
    setCurrentView("story");
  };

  const handleChoiceMade = (newStory: StoryResponse) => {
    console.log("Choice made callback:", newStory);
    setStory(newStory);
    setImageLoaded(false);
    setContentAnimated(false);
    setLoading(false);
  };

  const handleCreateNew = () => {
    setStory(null);
    setImageLoaded(false);
    setContentAnimated(false);
    setLoading(false);
    setCurrentView("create");
  };

  const WelcomePage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-storybook-bg via-yellow-50 to-pink-50 p-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1
            className="text-6xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Fredoka One, cursive" }}
          >
            🎭 AI Storyteller ✨
          </h1>
          <p
            className="text-2xl text-gray-600 mb-8"
            style={{ fontFamily: "Comic Neue, cursive" }}
          >
            Magical Stories Just for You!
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-primary-purple"
        >
          <div className="text-6xl mb-6">📚🌟🎵</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Create Magical Stories for Your Child!
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            👨‍👩‍👧 Parents: Craft personalized, educational adventures
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-primary-blue/20 to-primary-purple/20 rounded-2xl"
            >
              <Sparkles className="w-12 h-12 text-primary-purple mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">AI Magic</h3>
              <p className="text-sm text-gray-600">
                Personalized stories with custom lessons
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-primary-pink/20 to-primary-yellow/20 rounded-2xl"
            >
              <Volume2 className="w-12 h-12 text-primary-pink mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Audio Narration</h3>
              <p className="text-sm text-gray-600">
                Listen to your story with professional voice
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-primary-green/20 to-primary-blue/20 rounded-2xl"
            >
              <Wand2 className="w-12 h-12 text-primary-green mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Interactive Choices</h3>
              <p className="text-sm text-gray-600">
                Choose your own adventure path
              </p>
            </motion.div>
          </div>

          <motion.button
            onClick={() => setCurrentView("create")}
            className="playful-button bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink text-white text-2xl px-12 py-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Start Your Story!
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-gray-500 text-sm"
        >
          Powered by Raindrop + Vultr AI Services
        </motion.p>
      </div>
    </motion.div>
  );

  const CreateStoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-storybook-bg via-yellow-50 to-pink-50 p-8 relative">
      {/* Background music for form page */}
      <BackgroundMusic autoPlay={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button
          onClick={() => setCurrentView("welcome")}
          className="mb-6 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-primary-purple font-bold text-primary-purple hover:bg-primary-purple hover:text-white transition-all"
          whileHover={{ scale: 1.05 }}
        >
          ← Back to Welcome
        </motion.button>

        <StoryCreationForm onStoriesGenerated={handleStoriesGenerated} />
      </div>
    </div>
  );

  const StoryDisplayPage = () => {
    if (!story) return null;

    const imageUrl = StoryAPI.generateImageUrl(story.segment_text);

    return (
      <div className="min-h-screen bg-gradient-to-br from-storybook-bg via-yellow-50 to-pink-50 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={handleCreateNew}
            className="mb-6 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-primary-purple font-bold text-primary-purple hover:bg-primary-purple hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
          >
            ← Create New Story
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-primary-yellow"
          >
            <div className="text-center mb-8">
              <h2
                className="text-4xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka One, cursive" }}
              >
                📖 Your Magical Story! ✨
              </h2>
              <div className="text-2xl text-gray-600">
                Story #{story.story_id}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onAnimationComplete={() => setContentAnimated(true)}
              className="mb-8 text-center"
            >
              <div className="relative inline-block">
                <AnimatePresence mode="wait">
                  {!imageLoaded ? (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-[800px] h-[320px] bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 rounded-2xl border-4 border-primary-yellow overflow-hidden relative"
                    >
                      {/* Swirling colors background */}
                      <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                        <div
                          className="absolute top-20 right-10 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <div
                          className="absolute bottom-10 left-20 w-36 h-36 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
                          style={{ animationDelay: "2s" }}
                        ></div>
                        <div
                          className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>

                      {/* Swirling animation */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-full h-full border-4 border-purple-300 rounded-full border-t-transparent border-r-transparent"></div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 12,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-full h-full border-4 border-pink-300 rounded-full border-b-transparent border-l-transparent"></div>
                        </div>
                      </motion.div>

                      {/* Twinkles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{
                            top: `${20 + i * 10}%`,
                            left: `${15 + i * 10}%`,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                          }}
                          transition={{
                            duration: 2 + i * 0.3,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}

                      {/* Loading text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="text-5xl mb-3"
                          >
                            🎨
                          </motion.div>
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                          >
                            Creating your magic scene...
                          </motion.div>
                          <div className="text-sm text-gray-600 mt-1">
                            ✨ Painting wonders ✨
                          </div>
                        </div>
                      </div>

                      {/* Hidden image to preload */}
                      <img
                        src={imageUrl}
                        alt="preload"
                        className="hidden"
                        onLoad={() => setImageLoaded(true)}
                        onError={() =>
                          console.log("Image failed to load:", imageUrl)
                        }
                      />
                    </motion.div>
                  ) : (
                    <motion.img
                      key="image"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      src={imageUrl}
                      alt="Story scene illustration"
                      className="w-[800px] h-auto rounded-2xl shadow-lg border-4 border-primary-yellow"
                      style={{ maxHeight: "400px", objectFit: "contain" }}
                    />
                  )}
                </AnimatePresence>
                <div className="absolute -bottom-2 -right-2 text-3xl animate-bounce">
                  ✨
                </div>
              </div>
            </motion.div>

            {contentAnimated ? (
              <div className="prose prose-lg max-w-none mb-8">
                <div className="story-text bg-gradient-to-r from-storybook-bg to-yellow-50 p-8 rounded-2xl border-2 border-storybook-accent">
                  {story.segment_text}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="prose prose-lg max-w-none mb-8"
              >
                <div className="story-text bg-gradient-to-r from-storybook-bg to-yellow-50 p-8 rounded-2xl border-2 border-storybook-accent">
                  {story.segment_text}
                </div>
              </motion.div>
            )}

            <div className="mb-8">
              <AudioPlayer
                audioUrl={StoryAPI.getAudioUrl(
                  story.audio_url.split("/").pop() || ""
                )}
                autoPlay={false}
              />
            </div>

            <ChoiceButtons
              story={story}
              onChoiceMade={handleChoiceMade}
              loading={loading}
            />
          </motion.div>
        </div>
      </div>
    );
  };

  const StorySelectionPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-storybook-bg via-yellow-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={() => setCurrentView("create")}
          className="mb-6 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-primary-purple font-bold text-primary-purple hover:bg-primary-purple hover:text-white transition-all"
          whileHover={{ scale: 1.05 }}
        >
          ← Create Different Stories
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2
            className="text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "Fredoka One, cursive" }}
          >
            🎭 Choose Your Story! ✨
          </h2>
          <p className="text-xl text-gray-600">
            Pick the one that excites you most!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {storyOptions.map((storyOption, index) => {
            const colors = [
              "border-primary-blue",
              "border-primary-purple",
              "border-primary-pink",
            ];
            const gradients = [
              "from-blue-50 to-purple-50",
              "from-purple-50 to-pink-50",
              "from-pink-50 to-yellow-50",
            ];
            const emojis = ["🌟", "✨", "💫"];

            // Get first 200 characters for preview
            const preview =
              storyOption.segment_text.substring(0, 200) +
              (storyOption.segment_text.length > 200 ? "..." : "");

            return (
              <motion.div
                key={storyOption.story_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${gradients[index]} rounded-3xl shadow-xl border-4 ${colors[index]} p-8 cursor-pointer hover:shadow-2xl transition-all`}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleStorySelected(storyOption)}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {emojis[index]}
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Story {index + 1}
                  </h3>
                  <div className="text-sm text-gray-500 italic">Preview</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 min-h-[200px]">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {preview}
                  </p>
                </div>

                <motion.button
                  className="w-full py-4 bg-gradient-to-r from-primary-blue via-primary-purple to-primary-pink text-white font-bold text-lg rounded-xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 Choose & Continue This Story!
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {currentView === "welcome" && <WelcomePage />}
        {currentView === "create" && <CreateStoryPage />}
        {currentView === "select" && <StorySelectionPage />}
        {currentView === "story" && <StoryDisplayPage />}
      </AnimatePresence>
    </div>
  );
}

export default App;
