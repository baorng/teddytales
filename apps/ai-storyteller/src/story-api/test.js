import axios from "axios";

const API_KEY = "E4L3Q6C7CP7T4LPMETVQBYKMDM4XWALROFZQ";

export async function inference(prompt) {
  try {
    const res = await axios.post(
      "https://api.vultrinference.com/v1/chat/completions",
      {
        model: "deepseek-r1-distill-qwen-32b",  // or any model listed in your dashboard
          messages: [
        { role: "system", content: "You are a friendly children's storyteller." },
        { role: "user", content: prompt }
      ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    

    console.log("Response:");
    console.log(res.data.choices[0].message.content);

    return res.data
  } catch (err ) {
    console.error("Error:");
    if (err instanceof Error) {
    console.error(err.message);
    }
  }
}

await inference("tell me a short 20 word story").response

