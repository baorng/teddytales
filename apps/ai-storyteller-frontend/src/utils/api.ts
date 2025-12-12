// API client for AI Storyteller backend
const API_BASE = 'https://ai-storyteller.01kc3t3yy6wkaq6mtc04d4jda0.lmapp.run';
const IMAGE_API_BASE = 'https://image.pollinations.ai/prompt';

export interface StoryRequest {
  child_name: string;
  age: number;
  theme?: string;
  lesson_of_day?: string;
}

export interface StoryResponse {
  story_id: number;
  segment_id: number;
  segment_text: string;
  audio_url: string;
  choice_question: string;
  segment_order: number;
  is_conclusion: boolean;
}

export class StoryAPI {
  static async createStory(request: StoryRequest): Promise<StoryResponse> {
    const response = await fetch(`${API_BASE}/start-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  static async continueStory(segmentId: number, choice: string): Promise<StoryResponse> {
    const response = await fetch(`${API_BASE}/continue-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        segment_id: segmentId,
        audio_blob: choice
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const storyData = await response.json();
    return storyData;
  }

  static getAudioUrl(audioKey: string): string {
    return `${API_BASE}/get-audio/${audioKey}`;
  }

  static generateImageUrl(storyText: string): string {
    const encodedPrompt = encodeURIComponent(storyText);
    return `${IMAGE_API_BASE}/${encodedPrompt}?width=1024&height=768&model=flux`;
  }

  static async checkHealth() {
    const response = await fetch(`${API_BASE}/health/services`);
    return response.json();
  }
}