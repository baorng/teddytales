-- Initial schema for AI Storyteller application
-- Stories table to track each storytelling session
CREATE TABLE stories (
  id INTEGER PRIMARY KEY,
  child_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  theme TEXT,
  lesson_of_day TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Story segments table to track each part of the story
CREATE TABLE story_segments (
  id INTEGER PRIMARY KEY,
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  segment_text TEXT NOT NULL,
  audio_url TEXT,
  choice_question TEXT,
  segment_order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Voice choices table to track child's spoken choices
CREATE TABLE voice_choices (
  id INTEGER PRIMARY KEY,
  segment_id INTEGER NOT NULL REFERENCES story_segments(id) ON DELETE CASCADE,
  audio_url TEXT,
  transcribed_text TEXT,
  processed_choice TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_stories_child_name ON stories(child_name);
CREATE INDEX idx_story_segments_story_id ON story_segments(story_id);
CREATE INDEX idx_story_segments_order ON story_segments(story_id, segment_order);
CREATE INDEX idx_voice_choices_segment_id ON voice_choices(segment_id);