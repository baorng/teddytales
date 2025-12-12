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
      className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-200 to-earth-100 p-4 md:p-8 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
      <div className="absolute bottom-20 right-20 w-24 h-24 opacity-20">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="text-5xl"
        >
          📖
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-7xl md:text-8xl font-bold text-earth-800 mb-4 heading-handwritten drop-shadow-sm">
            TeddyTales
          </h1>
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              🧸
            </motion.span>
            <p className="text-2xl md:text-3xl text-earth-600 font-display font-semibold">
              Where Every Story Comes Alive
            </p>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl"
            >
              ✨
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-cream-50 page-texture rounded-2xl shadow-book p-8 md:p-12 border-2 border-earth-300 relative"
        >
          {/* Book corner ornaments */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-earth-400 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-earth-400 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-earth-400 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-earth-400 rounded-br-2xl"></div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl mb-6"
          >
            📚
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-earth-800 mb-4 font-display">
            Craft Magical Adventures
          </h2>
          <p className="text-lg md:text-xl text-earth-600 mb-10 font-display">
            Personalized stories that inspire imagination and teach valuable lessons
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-gradient-to-br from-lavender-50 to-lavender-100 rounded-xl shadow-page border border-lavender-200"
            >
              <Sparkles className="w-14 h-14 text-lavender-600 mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2 text-earth-800 font-display">AI-Powered Magic</h3>
              <p className="text-sm text-earth-600 font-display">
                Unique stories tailored to your child's interests and learning goals
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-gradient-to-br from-sunset-50 to-sunset-100 rounded-xl shadow-page border border-sunset-200"
            >
              <Volume2 className="w-14 h-14 text-sunset-600 mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2 text-earth-800 font-display">Listen & Learn</h3>
              <p className="text-sm text-earth-600 font-display">
                Professional narration brings every adventure to life
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-page border border-sky-200"
            >
              <Wand2 className="w-14 h-14 text-sky-600 mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2 text-earth-800 font-display">Your Choices Matter</h3>
              <p className="text-sm text-earth-600 font-display">
                Interactive storytelling where kids shape the adventure
              </p>
            </motion.div>
          </div>

          <motion.button
            onClick={() => setCurrentView("create")}
            className="storybook-button bg-gradient-to-r from-sunset-400 to-sunset-500 hover:from-sunset-500 hover:to-sunset-600 text-white text-xl md:text-2xl px-10 py-5 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="inline-block w-6 h-6 mr-2 mb-1" />
            Begin Your Adventure
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-earth-500 text-sm font-display"
        >
          Powered with care by Raindrop & Vultr AI
        </motion.p>
      </div>
    </motion.div>
  );

  const CreateStoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-200 to-sage-50 p-4 md:p-8 relative">
      {/* Background music for form page */}
      <BackgroundMusic autoPlay={true} />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button
          onClick={() => setCurrentView("welcome")}
          className="mb-6 storybook-button bg-earth-100 hover:bg-earth-200 text-earth-700 border-2 border-earth-300"
          whileHover={{ scale: 1.02, x: -5 }}
        >
          <span className="text-xl mr-2">←</span>
          <span className="font-display font-semibold">Back to Home</span>
        </motion.button>

        <StoryCreationForm onStoriesGenerated={handleStoriesGenerated} />
      </div>
    </div>
  );

  const StoryDisplayPage = () => {
    if (!story) return null;

    const imageUrl = StoryAPI.generateImageUrl(story.segment_text);

    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-200 to-earth-100 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <motion.button
            onClick={handleCreateNew}
            className="mb-8 storybook-button bg-earth-100 hover:bg-earth-200 text-earth-700 border-2 border-earth-300"
            whileHover={{ scale: 1.02, x: -5 }}
          >
            <span className="text-xl mr-2">←</span>
            <span className="font-display font-semibold">Create New Story</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cream-50 page-texture rounded-2xl shadow-book p-6 md:p-10 border-2 border-earth-300 relative"
          >
            {/* Book decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-earth-400 rounded-tl-2xl opacity-40"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-earth-400 rounded-tr-2xl opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-earth-400 rounded-bl-2xl opacity-40"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-earth-400 rounded-br-2xl opacity-40"></div>

            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-4"
              >
                <span className="text-4xl">📖</span>
                <h2 className="text-4xl md:text-5xl font-bold text-earth-800 heading-handwritten">
                  Your Story Unfolds
                </h2>
                <span className="text-4xl">✨</span>
              </motion.div>
              <div className="text-lg text-earth-500 font-display">
                Chapter {story.story_id}
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
              <div className="prose prose-lg max-w-none mb-10">
                <div className="story-text bg-gradient-to-br from-cream-50 to-cream-100 p-8 md:p-10 rounded-xl border-l-4 border-earth-400 shadow-page">
                  {story.segment_text}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="prose prose-lg max-w-none mb-10"
              >
                <div className="story-text bg-gradient-to-br from-cream-50 to-cream-100 p-8 md:p-10 rounded-xl border-l-4 border-earth-400 shadow-page">
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
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-200 to-earth-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.button
          onClick={() => setCurrentView("create")}
          className="mb-8 storybook-button bg-earth-100 hover:bg-earth-200 text-earth-700 border-2 border-earth-300"
          whileHover={{ scale: 1.02, x: -5 }}
        >
          <span className="text-xl mr-2">←</span>
          <span className="font-display font-semibold">Create Different Stories</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-earth-800 mb-4 heading-handwritten">
            Choose Your Adventure
          </h2>
          <p className="text-xl md:text-2xl text-earth-600 font-display">
            Three magical tales await — which path will you take?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {storyOptions.map((storyOption, index) => {
            const themes = [
              {
                bg: "from-sky-50 to-sky-100",
                border: "border-sky-300",
                accent: "bg-sky-500",
                icon: "🌟"
              },
              {
                bg: "from-lavender-50 to-lavender-100",
                border: "border-lavender-300",
                accent: "bg-lavender-500",
                icon: "✨"
              },
              {
                bg: "from-sunset-50 to-sunset-100",
                border: "border-sunset-300",
                accent: "bg-sunset-500",
                icon: "💫"
              },
            ];
            
            const theme = themes[index];
            const preview =
              storyOption.segment_text.substring(0, 180) +
              (storyOption.segment_text.length > 180 ? "..." : "");

            return (
              <motion.div
                key={storyOption.story_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className={`bg-gradient-to-br ${theme.bg} page-texture rounded-2xl shadow-book border-2 ${theme.border} p-6 md:p-8 cursor-pointer group relative`}
                onClick={() => handleStorySelected(storyOption)}
              >
                {/* Page corner */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-earth-200 border-l-[40px] border-l-transparent opacity-50"></div>
                
                <div className="text-center mb-6">
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {theme.icon}
                  </motion.div>
                  <div className={`inline-block ${theme.accent} text-white px-4 py-2 rounded-lg mb-2`}>
                    <span className="font-display font-bold text-lg">Tale {index + 1}</span>
                  </div>
                </div>

                <div className="bg-cream-50/90 backdrop-blur-sm rounded-xl p-5 mb-6 min-h-[220px] border border-earth-200 shadow-inner">
                  <p className="text-base text-earth-700 leading-relaxed font-story">
                    {preview}
                  </p>
                </div>

                <motion.button
                  className={`w-full storybook-button ${theme.accent} hover:opacity-90 text-white font-display text-base md:text-lg`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="inline-block w-5 h-5 mr-2 mb-1" />
                  Read This Story
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
