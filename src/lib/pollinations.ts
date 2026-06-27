export async function generateAIAssessment(description: string) {
  const prompt = `Analyze this civic issue report: "${description}". 
  Respond with a strict JSON object containing three fields: 
  "category" (e.g. Pothole, Streetlight, Garbage, Water, etc.), 
  "severity" (High, Medium, or Low), and 
  "confidenceScore" (a number between 0 and 100).
  Do not include any other text or markdown formatting.`;

  try {
    const res = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
    const dataText = await res.text();
    // In case the API returns markdown code blocks, strip them
    const cleanJson = dataText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Assessment failed", error);
    return {
      category: "Unknown",
      severity: "Medium",
      confidenceScore: 0
    };
  }
}
