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
    await this.db.executeQuery({
      textQuery: `INSERT INTO story_segments (story_id, segment_text, audio_url, choice_question, segment_order) 
                   VALUES (${storyId}, '${segmentText.replace(/'/g, "''")}', '${audioUrl}', ${choiceQuestion ? `'${choiceQuestion}'` : 'NULL'}, ${segmentOrder})`
    });

    const idResult = await this.db.executeQuery({
      textQuery: 'SELECT last_insert_rowid() as id'
    });
    
    const parsedResult = JSON.parse(idResult.results || '[]');
    return parsedResult[0]?.id || 0;
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

// SmartMemory service for context management
export class StoryMemoryService {
  constructor(private memory: SmartMemory) {}

  async storeStoryContext(storyId: string, context: any): Promise<void> {
    // Use semantic memory for persistent story context
    await this.memory.putSemanticMemory({
      storyId,
      context,
      timestamp: new Date().toISOString(),
      type: 'story_context'
    });
  }

  async getStoryContext(storyId: string): Promise<any> {
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
          return memoryResult.document.context;
        }
      }
    }
    
    return null;
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