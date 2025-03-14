/**
 * API helper for interacting with OpenAI API
 * Note: This is a simplified example and would need to be expanded for production use
 */

// Function to send a request to OpenAI API
async function callOpenAI(prompt, apiKey) {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a design assistant that generates SVG code based on prompts. Create valid, simple SVG that can be used in Figma.'
          },
          {
            role: 'user',
            content: `Generate a simple SVG design for: ${prompt}. Respond ONLY with valid SVG code that can be pasted into Figma.`
          }
        ],
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error calling OpenAI API');
    }
    
    const data = await response.json();
    return extractSVGFromResponse(data);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

// Function to extract SVG code from OpenAI response
function extractSVGFromResponse(response) {
  const message = response.choices[0].message.content;
  
  // Extract SVG code from response
  // Usually, GPT will wrap SVG in code blocks
  const svgMatch = message.match(/<svg[\s\S]*?<\/svg>/);
  if (svgMatch) {
    return svgMatch[0];
  }
  
  // If no SVG found in response, return an error
  throw new Error('No valid SVG found in the API response');
}

// Function to parse SVG string into Figma nodes
function parseSVGToFigmaNodes(svgString) {
  // This is a simplified example - in a real implementation,
  // you would use Figma's SVG import functionality or parse the SVG manually
  
  // For now, we'll return a placeholder object that indicates SVG content was received
  return {
    type: 'SVG',
    content: svgString,
    width: 400,
    height: 300
  };
}

// Export functions to be used in the main code
export { callOpenAI, parseSVGToFigmaNodes }; 