// Netlify Function to talk to Gemini API securely

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Body me frontend se aaya hua JSON (payload)
    const body = JSON.parse(event.body || "{}");

    // Yahan tumhara Gemini API key environment se aayega
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GEMINI_API_KEY is not set" }),
      };
    }

    // Gemini model ka naam (tumhare HTML wale jaisa hi)
    const model = "gemini-2.5-flash-preview-09-2025";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Ab actual Gemini API ko call
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // same payload jo frontend se aaya
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Gemini Netlify Function Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" }),
    };
  }
}
