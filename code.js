// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 480, height: 580 });

// Store the user's API key if provided
let apiKey = '';

// Called when a message is received from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-design') {
    const prompt = msg.prompt;
    apiKey = msg.apiKey || apiKey;
    
    // Notify the UI that generation has started
    figma.ui.postMessage({ 
      type: 'generation-update', 
      status: 'Processing prompt...' 
    });
    
    try {
      if (apiKey) {
        // Try to use the API if we have a key
        await generateWithAPI(prompt, apiKey);
      } else {
        // Fall back to demo generation if no API key
        await generateDemo(prompt);
      }
      
      // Notify the UI
      figma.ui.postMessage({ 
        type: 'generation-update', 
        status: 'success', 
        message: 'Design generated!' 
      });
    } catch (error) {
      console.error('Error generating design:', error);
      figma.ui.postMessage({ 
        type: 'generation-update', 
        status: 'error', 
        message: error.message || 'Error generating design. Please try again.' 
      });
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Function to generate a design using the OpenAI API
async function generateWithAPI(prompt, apiKey) {
  try {
    // Import would be used in a real implementation
    // For this demo, we'll simulate an API response
    
    // Create a new frame to hold our generated elements
    const frame = figma.createFrame();
    frame.name = `AI Generated: ${prompt.substring(0, 20)}${prompt.length > 20 ? '...' : ''}`;
    frame.resize(500, 400);
    
    // Create a text node with the prompt
    const text = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    text.characters = `Generated from: ${prompt}`;
    text.fontSize = 16;
    text.x = 20;
    text.y = 20;
    
    // In a real implementation, we'd call our API helper like this:
    // import { callOpenAI, parseSVGToFigmaNodes } from './api.js';
    // const svgString = await callOpenAI(prompt, apiKey);
    // const svgData = parseSVGToFigmaNodes(svgString);
    
    // For this example, we'll create a more complex simulated design
    // Create a more sophisticated shape to simulate AI generation
    const ellipse = figma.createEllipse();
    ellipse.x = 100;
    ellipse.y = 100;
    ellipse.resize(300, 200);
    
    // Generate color based on the prompt
    const promptHash = hashString(prompt);
    const r = (promptHash % 255) / 255;
    const g = ((promptHash * 13) % 255) / 255;
    const b = ((promptHash * 29) % 255) / 255;
    
    ellipse.fills = [{ type: 'SOLID', color: { r, g, b } }];
    
    // Create a rectangle that overlaps with the ellipse
    const rect = figma.createRectangle();
    rect.x = 150;
    rect.y = 150;
    rect.resize(200, 150);
    rect.fills = [{ 
      type: 'SOLID', 
      color: { r: (g + 0.2) % 1, g: (b + 0.2) % 1, b: (r + 0.2) % 1 },
      opacity: 0.7
    }];
    
    // Blur effect to make it more interesting
    const blur = {
      type: 'EFFECT',
      visible: true,
      blur: {
        radius: 10,
        type: 'BACKGROUND_BLUR'
      }
    };
    rect.effects = [blur];
    
    // Add elements to the frame
    frame.appendChild(text);
    frame.appendChild(ellipse);
    frame.appendChild(rect);
    
    // Position the frame in the center of the viewport
    const { x, y, width, height } = figma.viewport.bounds;
    frame.x = x + (width - frame.width) / 2;
    frame.y = y + (height - frame.height) / 2;
    
    // Select the frame
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    
    return frame;
  } catch (error) {
    console.error("Error in API generation:", error);
    throw new Error(`API generation failed: ${error.message}`);
  }
}

// Function to generate a demo design (fallback when no API key)
async function generateDemo(prompt) {
  // Create a new frame to hold our generated elements
  const frame = figma.createFrame();
  frame.name = `AI Generated Demo: ${prompt.substring(0, 20)}${prompt.length > 20 ? '...' : ''}`;
  frame.resize(400, 300);
  
  // Create a text node with the prompt
  const text = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  text.characters = `Generated from: ${prompt}`;
  text.fontSize = 16;
  text.x = 20;
  text.y = 20;
  
  // Create a rectangle as a simple generated design
  const rect = figma.createRectangle();
  rect.x = 20;
  rect.y = 60;
  rect.resize(360, 200);
  rect.fills = [{ type: 'SOLID', color: { r: Math.random(), g: Math.random(), b: Math.random() } }];
  
  // Add a note that this is a demo
  const note = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Italic" });
  note.characters = "Demo mode (no API key provided)";
  note.fontSize = 12;
  note.fontName = { family: "Inter", style: "Italic" };
  note.x = 20;
  note.y = frame.height - 30;
  note.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
  
  // Add elements to the frame
  frame.appendChild(text);
  frame.appendChild(rect);
  frame.appendChild(note);
  
  // Position the frame in the center of the viewport
  const { x, y, width, height } = figma.viewport.bounds;
  frame.x = x + (width - frame.width) / 2;
  frame.y = y + (height - frame.height) / 2;
  
  // Select the frame
  figma.currentPage.selection = [frame];
  figma.viewport.scrollAndZoomIntoView([frame]);
  
  return frame;
}

// Helper function to create a hash from a string
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
} 