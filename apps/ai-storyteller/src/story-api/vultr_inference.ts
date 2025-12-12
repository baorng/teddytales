// Using native fetch API instead of axios for Cloudflare Workers compatibility
const API_KEY = "UCWE4Z23MIRB5JK3NYMFQY4OBHUMMBDM3KXA";

interface VultrInferenceResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }>;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function inference(
  prompt: string
): Promise<VultrInferenceResponse | null> {
  try {
    console.log("=== Vultr Inference Request ===");
    console.log("Prompt:", prompt);
    console.log(
      "API Key:",
      API_KEY ? `${API_KEY.substring(0, 10)}...` : "NOT SET"
    );

    const response = await fetch(
      "https://api.vultrinference.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-qwen-32b",
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vultr API Error Response:");
      console.error("Status:", response.status);
      console.error("Status Text:", response.statusText);
      console.error("Error Body:", errorText);
      return null;
    }

    const data = (await response.json()) as VultrInferenceResponse;
    console.log("Vultr Inference Success!");
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log("Content:", data.choices[0].message.content);
    }

    return data;
  } catch (err) {
    console.error("=== Vultr Inference Error ===");
    if (err instanceof Error) {
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
    } else {
      console.error("Unknown error:", err);
    }

    // Return null explicitly so callers can detect the error
    return null;
  }
}
