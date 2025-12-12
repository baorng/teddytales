import { z } from "zod";

// Request/Response schemas for type safety
export const StartStoryRequestSchema = z.object({
  // char_name: z.string().min(1, 'Child name is required'),
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(12, "Age must be at most 12"),
  theme: z.string().optional(),
  lesson_of_day: z.string().optional(),
});

export type StartStoryRequest = z.infer<typeof StartStoryRequestSchema>;

export const StorySegmentResponseSchema = z.object({
  story_id: z.number(),
  segment_id: z.number(),
  segment_text: z.string(),
  audio_url: z.string(),
  choice_question: z.string().nullable(),
  segment_order: z.number(),
  is_conclusion: z.boolean(),
});

export type StorySegmentResponse = z.infer<typeof StorySegmentResponseSchema>;

export const SubmitChoiceRequestSchema = z.object({
  segment_id: z.number(),
  audio_blob: z.string(), // base64 encoded audio OR text choice
  segment_order: z.number().optional(), // Passed from frontend to know when to conclude
});

export type SubmitChoiceRequest = z.infer<typeof SubmitChoiceRequestSchema>;

// Story generation prompts
export class StoryPrompts {
  static generateInitialStoryPrompt(request: StartStoryRequest): string {
    const ageGroup = this.getAgeGroup(request.age);
    return `Write a short story for a child aged ${request.age}, theme: ${
      request.theme || "adventure"
    }.

IMPORTANT: You MUST use the name Emma for the main character throughout the story. 

Keep it simple, 100 words max. End with a clear choice between two options.

Format:
STORY: [story text about Emma]
CHOICE: Should Emma [short option A] or [short option B]?`;
  }

  static generateContinuationPrompt(
    age: number,
    fullStoryHistory: string,
    currentChoice: string,
    segmentOrder: number,
    narrativeArc: any
  ): string {
    const isConclusion = segmentOrder >= 2; // Simple 2-3 segment stories

    if (isConclusion) {
      return `You are continuing an interactive story for a child aged ${age}.

${fullStoryHistory}

Current choice made: "${currentChoice}"

IMPORTANT: You MUST use the name Emma throughout the continuation. 

Story context to remember:
- Main character: Emma 
- Other characters: ${narrativeArc.characters_introduced.join(", ")}
- Locations: ${narrativeArc.locations_visited.join(", ")}
- Story tone: ${narrativeArc.story_tone}
- Themes: ${narrativeArc.themes_explored.join(", ")}

Write a short ending (50 words max) based on the current choice. Bring the story to a satisfying conclusion that references the journey so far. Do not repeat the choice in your response.

Format:
STORY: [ending text about Emma]
CHOICE: null`;
    } else {
      return `You are continuing an interactive story for a child aged ${age}.

${fullStoryHistory}

Current choice made: "${currentChoice}"

IMPORTANT: You MUST use the name Emma throughout the continuation. 

Story context to remember:
- Main character: Emma
- Other characters: ${narrativeArc.characters_introduced.join(", ")}
- Locations visited: ${narrativeArc.locations_visited.join(", ")}
- Key events so far: ${narrativeArc.key_events.join(", ")}
- Current situation: ${narrativeArc.current_situation}
- Story tone: ${narrativeArc.story_tone}
- Themes: ${narrativeArc.themes_explored.join(", ")}

Write what happens next (100 words max). Reference previous events and locations to create continuity. Introduce a new development that offers Emma an interesting decision. Do not repeat the choice text in your response. End with a new choice.

Format:
STORY: [continuation text about Emma the main character]
CHOICE: Should Emma [short option A] or [short option B]?`;
    }
  }

  private static getAgeGroup(age: number): string {
    if (age <= 3) return "toddler";
    if (age <= 5) return "preschooler";
    if (age <= 7) return "early elementary";
    if (age <= 9) return "elementary";
    return "pre-teen";
  }
}
