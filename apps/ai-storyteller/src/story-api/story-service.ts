import { z } from 'zod';

// Request/Response schemas for type safety
export const StartStoryRequestSchema = z.object({
  child_name: z.string().min(1, 'Child name is required'),
  age: z.number().min(1, 'Age must be at least 1').max(12, 'Age must be at most 12'),
  theme: z.string().optional(),
  lesson_of_day: z.string().optional()
});

export type StartStoryRequest = z.infer<typeof StartStoryRequestSchema>;

export const StorySegmentResponseSchema = z.object({
  story_id: z.number(),
  segment_id: z.number(),
  segment_text: z.string(),
  audio_url: z.string(),
  choice_question: z.string().nullable(),
  segment_order: z.number(),
  is_conclusion: z.boolean()
});

export type StorySegmentResponse = z.infer<typeof StorySegmentResponseSchema>;

export const SubmitChoiceRequestSchema = z.object({
  segment_id: z.number(),
  audio_blob: z.string() // base64 encoded audio
});

export type SubmitChoiceRequest = z.infer<typeof SubmitChoiceRequestSchema>;

// Story generation prompts
export class StoryPrompts {
  static generateInitialStoryPrompt(request: StartStoryRequest): string {
    const ageGroup = this.getAgeGroup(request.age);
    return `Write a short story for ${request.child_name}, age ${request.age}, theme: ${request.theme || 'adventure'}.

Keep it simple, 100 words max. End with a choice between two options.

Format:
STORY: [story text]
CHOICE: [Should ${request.child_name} do A or B?]`;
  }

  static generateContinuationPrompt(
    childName: string,
    age: number,
    previousText: string,
    choice: string,
    segmentOrder: number
  ): string {
    const ageGroup = this.getAgeGroup(age);
    const isConclusion = segmentOrder >= 2; // Simple 2-3 segment stories

    if (isConclusion) {
      return `Continue the story for ${childName}, age ${age}.

Previous: "${previousText}"
Choice made: "${choice}"

Write a short ending (50 words max) based on the choice. Do not repeat the choice in your response.

Format:
STORY: [ending text]
CHOICE: null`;
    } else {
      return `Continue the story for ${childName}, age ${age}.

Previous: "${previousText}" 
Choice: "${choice}"

Write what happens next (100 words max). Do not repeat the choice text in your response. End with a new choice.

Format:
STORY: [continuation text]
CHOICE: [Should ${childName} do A or B?]`;
    }
  }

  private static getAgeGroup(age: number): string {
    if (age <= 3) return 'toddler';
    if (age <= 5) return 'preschooler';
    if (age <= 7) return 'early elementary';
    if (age <= 9) return 'elementary';
    return 'pre-teen';
  }
}