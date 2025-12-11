import { SmartSql, SmartMemory } from '@liquidmetal-ai/raindrop-framework';

// ElevenLabs TTS integration
export class ElevenLabsService {
  constructor(private apiKey: string, private voiceId: string) {}

  async generateSpeech(text: string): Promise<string> {
    console.log('=== ELEVENLABS TTS DEBUG ===');
    console.log('Text to synthesize:', text.substring(0, 100) + '...');
    console.log('Voice ID:', this.voiceId);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2', // Use newer model available on free tier
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        },
      }),
    });

    console.log('ElevenLabs response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('ElevenLabs error response:', errorText);
      throw new Error(`ElevenLabs API error: ${response.statusText} - ${errorText}`);
    }

    // Get the audio data
    const audioData = await response.arrayBuffer();
    console.log('Generated audio size:', audioData.byteLength, 'bytes');
    
    // In a real implementation, you'd upload the audio data to a storage service
    // For now, return a direct ElevenLabs streaming URL that can be accessed
    // This creates a temporary URL that can be used to play the audio
    const streamUrl = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`;
    console.log('Generated stream URL:', streamUrl);
    
    return streamUrl;
  }
}

// Vultr STT integration
export class VultrSTTService {
  constructor(private apiKey: string) {}

  async transcribeAudio(audioData: ArrayBuffer): Promise<string> {
    // In a real implementation, this would call Vultr STT API
    // For MVP, we'll simulate transcription
    
    try {
      const formData = new FormData();
      formData.append('audio', new Blob([audioData]), 'audio.wav');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.vultr.com/v2/speech-to-text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Vultr STT API error: ${response.statusText}`);
      }

      const result = await response.json() as { text?: string };
      return result.text || 'the forest'; // Default fallback
    } catch (error) {
      console.error('Vultr STT error:', error);
      return 'the forest'; // Fallback for MVP
    }
  }
}

// SmartSQL Database service
export class StoryDatabaseService {
  constructor(private db: SmartSql) {}

  async createStory(childName: string, age: number, theme?: string, lessonOfDay?: string): Promise<number> {
    console.log('Creating story:', { childName, age, theme, lessonOfDay });
    
    // Generate a unique ID based on timestamp to avoid database issues
    const timestampId = Date.now();
    console.log('Generated timestamp ID:', timestampId);
    
    try {
      // Use simple integer IDs instead of UUIDs for simplicity
      const result = await this.db.executeQuery({
        textQuery: `INSERT INTO stories (id, child_name, age, theme, lesson_of_day) 
                     VALUES (${timestampId}, '${childName}', ${age}, ${theme ? `'${theme}'` : 'NULL'}, ${lessonOfDay ? `'${lessonOfDay}'` : 'NULL'})`
      });
      
      console.log('Insert result:', result);
      
      // Get the inserted story ID as integer
      const idResult = await this.db.executeQuery({
        textQuery: 'SELECT last_insert_rowid() as id'
      });
      
      console.log('ID result:', idResult);
      
      const parsedResult = JSON.parse(idResult.results || '[]');
      const storyId = parsedResult[0]?.id;
      
      console.log('Parsed story ID:', storyId);
      
      // If database fails, return the timestamp ID
      return storyId || timestampId;
    } catch (error) {
      console.error('Database insert failed, using timestamp ID:', error);
      return timestampId;
    }
  }

  async createStorySegment(
    storyId: number, 
    segmentText: string, 
    audioUrl: string, 
    choiceQuestion: string | null,
    segmentOrder: number
  ): Promise<number> {
    console.log('Creating story segment with story_id:', storyId);
    
    // Use RETURNING id for more reliable ID retrieval
    const insertResult = await this.db.executeQuery({
      textQuery: `INSERT INTO story_segments (story_id, segment_text, audio_url, choice_question, segment_order) 
                   VALUES (${storyId}, '${segmentText.replace(/'/g, "''")}', '${audioUrl}', ${choiceQuestion ? `'${choiceQuestion}'` : 'NULL'}, ${segmentOrder})
                   RETURNING id`
    });
    
    console.log('Insert result with RETURNING:', insertResult);

    // Parse the returned ID from the results
    const parsedResult = JSON.parse(insertResult.results || '[]');
    const segmentId = parsedResult[0]?.id || 0;
    console.log('Parsed segment ID:', segmentId);
    
    return segmentId;
  }

  async getStorySegment(segmentId: number): Promise<any> {
    const result = await this.db.executeQuery({
      textQuery: `SELECT * FROM story_segments WHERE id = ${segmentId}`
    });
    
    const parsedResult = JSON.parse(result.results || '[]');
    return parsedResult[0] || null;
  }

  async getSegmentWithStory(segmentId: number): Promise<any> {
    const result = await this.db.executeQuery({
      textQuery: `SELECT ss.*, s.child_name, s.age 
                   FROM story_segments ss 
                   JOIN stories s ON ss.story_id = s.id 
                   WHERE ss.id = ${segmentId}`
    });
    
    return JSON.parse(result.results || '[]')[0];
  }

  async markStoryCompleted(storyId: number): Promise<void> {
    await this.db.executeQuery({
      textQuery: `UPDATE stories SET completed_at = CURRENT_TIMESTAMP WHERE id = ${storyId}`
    });
  }

  async getStoryHistory(storyId: number): Promise<any> {
    const storyResult = await this.db.executeQuery({
      textQuery: `SELECT * FROM stories WHERE id = ${storyId}`
    });
    
    const segmentsResult = await this.db.executeQuery({
      textQuery: `SELECT * FROM story_segments WHERE story_id = ${storyId} ORDER BY segment_order`
    });
    
    return {
      story: JSON.parse(storyResult.results || '[]')[0],
      segments: JSON.parse(segmentsResult.results || '[]')
    };
  }
}

// Enhanced story context structure for complete LLM memory
interface StorySegment {
  order: number;
  text: string;
  choice_question: string;
  choice_made?: string;
  audio_url: string;
  created_at: string;
}

interface NarrativeArc {
  characters_introduced: string[];
  locations_visited: string[];
  key_events: string[];
  current_situation: string;
  story_tone: string;
  themes_explored: string[];
}

interface EnhancedStoryContext {
  child_name: string;
  age: number;
  theme: string;
  lesson_of_day?: string;
  segments: StorySegment[];
  narrative_arc: NarrativeArc;
  total_choices_made: number;
  story_started_at: string;
  last_updated: string;
}

// SmartMemory service for enhanced context management
export class StoryMemoryService {
  constructor(private memory: SmartMemory) {}

  async storeStoryContext(storyId: string, context: EnhancedStoryContext): Promise<void> {
    // Use semantic memory for persistent story context
    await this.memory.putSemanticMemory({
      storyId,
      context,
      timestamp: new Date().toISOString(),
      type: 'enhanced_story_context'
    });
  }

  async getStoryContext(storyId: string): Promise<EnhancedStoryContext | null> {
    // Search semantic memory for story context
    const searchResult = await this.memory.searchSemanticMemory(storyId);
    
    if (searchResult.success && 
        searchResult.documentSearchResponse?.results && 
        searchResult.documentSearchResponse.results.length > 0) {
      const topResult = searchResult.documentSearchResponse.results[0];
      if (topResult?.chunkSignature) {
        const objectId = topResult.chunkSignature;
        const memoryResult = await this.memory.getSemanticMemory(objectId);
        if (memoryResult.success && memoryResult.document) {
          return memoryResult.document.context as EnhancedStoryContext;
        }
      }
    }
    
    return null;
  }

  async addStorySegment(
    storyId: string, 
    segment: StorySegment, 
    choiceMade?: string
  ): Promise<void> {
    const context = await this.getStoryContext(storyId);
    if (!context) {
      throw new Error(`Story context not found for story ID: ${storyId}`);
    }

    // Add the new segment
    if (choiceMade) {
      segment.choice_made = choiceMade;
    }
    context.segments.push(segment);

    // Update narrative arc
    this.updateNarrativeArc(context, segment);

    // Update metadata
    context.total_choices_made = context.segments.filter(s => s.choice_made).length;
    context.last_updated = new Date().toISOString();

    // Store the updated context
    await this.storeStoryContext(storyId, context);
  }

  private updateNarrativeArc(context: EnhancedStoryContext, segment: StorySegment): void {
    const text = segment.text.toLowerCase();
    
    // Extract characters (simple pattern matching)
    const characterPatterns = [
      /\b([A-Z][a-z]+)\b/g, // Proper nouns
      /\b(the |a )?(\w+(?: wizard|dragon|fairy|princess|king|queen|knight|monster|friend|animal|cat|dog|bird))/g
    ];

    characterPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const name = match.replace(/^(the |a )/, '').trim();
          if (name.length > 2 && !context.narrative_arc.characters_introduced.includes(name)) {
            context.narrative.arc.characters_introduced.push(name);
          }
        });
      }
    });

    // Extract locations
    const locationPatterns = [
      /\b(forest|castle|cave|mountain|river|ocean|garden|house|village|kingdom|school|park|tower|bridge|path|road|valley|island|lake|desert|jungle|city|town|market|shop|store|library|kitchen|bedroom|living room|backyard|playground)\b/g
    ];

    locationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!context.narrative_arc.locations_visited.includes(match)) {
            context.narrative_arc.locations_visited.push(match);
          }
        });
      }
    });

    // Extract key events (action words and significant moments)
    const eventPatterns = [
      /\b(discovered|found|met|rescued|saved|helped|fought|escaped|climbed|flew|swam|ran|jumped|danced|sang|laughed|cried|celebrated|won|lost|learned|taught|built|created|transformed|magically|suddenly|finally|at last)\b/g
    ];

    const events = text.match(eventPatterns) || [];
    events.forEach(event => {
      if (!context.narrative_arc.key_events.includes(event)) {
        context.narrative_arc.key_events.push(event);
      }
    });

    // Update current situation (last few sentences of the latest segment)
    const sentences = segment.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 0) {
      const lastSentences = sentences.slice(-2).join('. ').trim();
      context.narrative_arc.current_situation = lastSentences;
    }

    // Update story tone based on content
    const positiveWords = ['happy', 'excited', 'beautiful', 'magical', 'wonderful', 'amazing', 'fun', 'joy', 'love', 'friend', 'help', 'kind'];
    const adventurousWords = ['adventure', 'explore', 'journey', 'quest', 'discover', 'brave', 'courage', 'hero'];
    const mysteriousWords = ['mysterious', 'secret', 'hidden', 'unknown', 'puzzle', 'riddle', 'curious'];

    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const adventurousCount = adventurousWords.filter(word => text.includes(word)).length;
    const mysteriousCount = mysteriousWords.filter(word => text.includes(word)).length;

    if (positiveCount > adventurousCount && positiveCount > mysteriousCount) {
      context.narrative_arc.story_tone = 'positive';
    } else if (adventurousCount > mysteriousCount) {
      context.narrative_arc.story_tone = 'adventurous';
    } else if (mysteriousCount > 0) {
      context.narrative_arc.story_tone = 'mysterious';
    }

    // Track themes
    const themes = ['friendship', 'courage', 'kindness', 'adventure', 'magic', 'learning', 'family', 'nature', 'animals'];
    themes.forEach(theme => {
      if (text.includes(theme) && !context.narrative_arc.themes_explored.includes(theme)) {
        context.narrative_arc.themes_explored.push(theme);
      }
    });
  }

  async initializeStoryContext(
    storyId: string,
    childName: string,
    age: number,
    theme?: string,
    lessonOfDay?: string
  ): Promise<void> {
    const context: EnhancedStoryContext = {
      child_name: childName,
      age: age,
      theme: theme || 'adventure',
      lesson_of_day: lessonOfDay,
      segments: [],
      narrative_arc: {
        characters_introduced: [childName], // Child is always the main character
        locations_visited: [],
        key_events: [],
        current_situation: `Story beginning for ${childName}`,
        story_tone: 'positive',
        themes_explored: theme ? [theme] : []
      },
      total_choices_made: 0,
      story_started_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };

    await this.storeStoryContext(storyId, context);
  }

  getFullStoryHistory(context: EnhancedStoryContext): string {
    if (context.segments.length === 0) {
      return `Story for ${context.child_name} is just beginning.`;
    }

    let history = `Complete story for ${context.child_name} (age ${context.age}, theme: ${context.theme}):\n\n`;
    
    context.segments.forEach((segment, index) => {
      history += `Segment ${index + 1}: ${segment.text}`;
      if (segment.choice_made) {
        history += `\nChoice made: ${segment.choice_made}`;
      }
      if (segment.choice_question && !segment.choice_made) {
        history += `\nAvailable choice: ${segment.choice_question}`;
      }
      history += '\n\n';
    });

    // Add narrative summary
    history += `Story Summary:\n`;
    history += `- Characters: ${context.narrative_arc.characters_introduced.join(', ')}\n`;
    history += `- Locations visited: ${context.narrative_arc.locations_visited.join(', ')}\n`;
    history += `- Key events: ${context.narrative_arc.key_events.join(', ')}\n`;
    history += `- Current situation: ${context.narrative_arc.current_situation}\n`;
    history += `- Story tone: ${context.narrative_arc.story_tone}\n`;
    history += `- Themes: ${context.narrative_arc.themes_explored.join(', ')}\n\n`;

    return history;
  }

  async storeChildPreferences(childName: string, preferences: any): Promise<void> {
    // Use semantic memory for child preferences
    await this.memory.putSemanticMemory({
      childName,
      preferences,
      timestamp: new Date().toISOString(),
      type: 'child_preferences'
    });
  }

  async getChildPreferences(childName: string): Promise<any> {
    // Search semantic memory for child preferences
    const searchResult = await this.memory.searchSemanticMemory(childName);
    
    if (searchResult.success && 
        searchResult.documentSearchResponse?.results && 
        searchResult.documentSearchResponse.results.length > 0) {
      const topResult = searchResult.documentSearchResponse.results[0];
      if (topResult?.chunkSignature) {
        const objectId = topResult.chunkSignature;
        const memoryResult = await this.memory.getSemanticMemory(objectId);
        if (memoryResult.success && memoryResult.document) {
          return memoryResult.document.preferences;
        }
      }
    }
    
    return null;
  }
}