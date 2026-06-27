/**
 * Service to interact with Pollinations AI for text generation.
 * 
 * Pollinations AI text API endpoint: https://text.pollinations.ai/
 * We use it to analyze the issue description and determine category, severity, etc.
 */

export interface AIAnalysisResult {
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  duplicateCheck: boolean;
  reasoning: string;
}

export async function analyzeIssueDescription(description: string): Promise<AIAnalysisResult> {
  const prompt = `
  You are an AI assistant for a civic issue reporting platform. 
  Analyze the following issue description and extract the category, severity (Low, Medium, High, Critical), 
  confidence level (0-100), and a brief reasoning. 
  Assume duplicateCheck is false for now.
  
  Issue Description: "${description}"
  
  Respond ONLY with a valid JSON object in this exact format, with no markdown formatting or backticks:
  {
    "category": "String (e.g., Pothole, Garbage, Streetlight)",
    "severity": "Low | Medium | High | Critical",
    "confidence": Number,
    "duplicateCheck": false,
    "reasoning": "Brief explanation"
  }
  `;

  try {
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
    const text = await response.text();
    
    // Attempt to parse the JSON. Sometimes AI returns markdown wrapped JSON.
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    return {
      category: result.category || "Uncategorized",
      severity: result.severity || "Medium",
      confidence: result.confidence || 80,
      duplicateCheck: false,
      reasoning: result.reasoning || "Analyzed by AI"
    };
  } catch (error) {
    console.error("Failed to analyze issue with AI:", error);
    // Fallback response
    return {
      category: "General",
      severity: "Medium",
      confidence: 50,
      duplicateCheck: false,
      reasoning: "Failed to connect to AI service. Default categorization applied."
    };
  }
}
