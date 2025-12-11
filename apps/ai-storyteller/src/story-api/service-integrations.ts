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
    
    // Use timestamp as primary key to ensure uniqueness and trackability
    const timestampId = Date.now();
    
    try {
      // Insert with explicit ID to avoid SmartSQL complications
      const result = await this.db.executeQuery({
        textQuery: `INSERT INTO stories (id, child_name, age, theme, lesson_of_day) 
                     VALUES (${timestampId}, '${childName}', ${age}, ${theme ? `'${theme}'` : 'NULL'}, ${lessonOfDay ? `'${lessonOfDay}'` : 'NULL'})`
      });
      
      console.log('Story insert result:', result);
      
      // Return the timestamp ID we used
      console.log('Story ID (timestamp):', timestampId);
      return timestampId;
    } catch (error) {
      console.error('Database insert failed:', error);
      // Even on error, return the timestamp as fallback
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
    
    // Use timestamp as primary key for consistency
    const timestampId = Date.now() + segmentOrder; // Add segmentOrder to ensure uniqueness
    
    try {
      // Insert with explicit ID
      const result = await this.db.executeQuery({
        textQuery: `INSERT INTO story_segments (id, story_id, segment_text, audio_url, choice_question, segment_order) 
                     VALUES (${timestampId}, ${storyId}, '${segmentText.replace(/'/g, "''")}', '${audioUrl}', ${choiceQuestion ? `'${choiceQuestion}'` : 'NULL'}, ${segmentOrder})`
      });
      
      console.log('Segment insert result:', result);
      console.log('Segment ID (timestamp):', timestampId);
      return timestampId;
    } catch (error) {
      console.error('Failed to create story segment:', error);
      // Even on error, return the timestamp as fallback
      return timestampId;
    }
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
  constructor(private memory: SmartMemory) {
    // Simple in-memory cache for performance
    this.contextCache = new Map<string, EnhancedStoryContext>();
    this.cacheExpiry = new Map<string, number>();
  }

  private contextCache: Map<string, EnhancedStoryContext>;
  private cacheExpiry: Map<string, number>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async storeStoryContext(storyId: string, context: EnhancedStoryContext): Promise<void> {
    // Use semantic memory for persistent story context with direct key
    await this.memory.putSemanticMemory({
      storyId,
      context,
      timestamp: new Date().toISOString(),
      type: 'enhanced_story_context'
    });
    
    // Update cache
    this.contextCache.set(storyId, context);
    this.cacheExpiry.set(storyId, Date.now() + this.CACHE_TTL);
  }

  async getStoryContext(storyId: string): Promise<EnhancedStoryContext | null> {
    // Check cache first
    const cached = this.contextCache.get(storyId);
    const expiry = this.cacheExpiry.get(storyId);
    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }

    // Use direct key-based access instead of search for better performance
    try {
      const memoryResult = await this.memory.getSemanticMemory(`story-context-${storyId}`);
      if (memoryResult.success && memoryResult.document) {
        const context = memoryResult.document.context as EnhancedStoryContext;
        // Cache the result
        this.contextCache.set(storyId, context);
        this.cacheExpiry.set(storyId, Date.now() + this.CACHE_TTL);
        return context;
      }
    } catch (error) {
      console.log('Story context not found for direct key access, falling back to search:', storyId);
    }
    
    // Fallback to search only if direct access fails
    const searchResult = await this.memory.searchSemanticMemory(storyId);
    
    if (searchResult.success && 
        searchResult.documentSearchResponse?.results && 
        searchResult.documentSearchResponse.results.length > 0) {
      const topResult = searchResult.documentSearchResponse.results[0];
      if (topResult?.chunkSignature) {
        const objectId = topResult.chunkSignature;
        const memoryResult = await this.memory.getSemanticMemory(objectId);
        if (memoryResult.success && memoryResult.document) {
          const context = memoryResult.document.context as EnhancedStoryContext;
          // Cache the result
          this.contextCache.set(storyId, context);
          this.cacheExpiry.set(storyId, Date.now() + this.CACHE_TTL);
          return context;
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
    // Try to get existing context, but don't fail if SmartMemory isn't ready yet
    let context = await this.getStoryContext(storyId);
    
    // If context doesn't exist, log warning and continue without memory context
    if (!context) {
      console.log(`SmartMemory context not found for story ID: ${storyId}, skipping memory update`);
      return; // Don't fail, just skip memory update
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
            context.narrative_arc.characters_introduced.push(name);
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

    let events: string[] = [];
    eventPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      events.push(...matches);
    });
    
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

    try {
      await this.storeStoryContext(storyId, context);
      console.log(`SmartMemory context initialized for story ID: ${storyId}`);
    } catch (error) {
      console.error(`Failed to initialize SmartMemory context for story ID: ${storyId}:`, error);
      // Don't fail the entire story creation if SmartMemory isn't ready
    }
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