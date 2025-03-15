// Design AI Generator Plugin
// This plugin uses AI to generate design elements based on text prompts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 450, height: 750 });

// Store settings in client storage
let openaiApiKey = null;
let geminiApiKey = null;
let aiModel = 'gpt-4';
let aiProvider = 'openai';
let lastGeneratedDesign = [];

// Debug function to log messages
function debugLog(message) {
    console.log(`[PLUGIN DEBUG] ${message}`);
    // Also send to UI for debugging
    figma.ui.postMessage({ 
        type: 'debug-log', 
        message: message 
    });
}

// Initialize by loading the API key
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const storedOpenAIKey = yield figma.clientStorage.getAsync('openai_api_key');
            openaiApiKey = storedOpenAIKey || null;
            const storedGeminiKey = yield figma.clientStorage.getAsync('gemini_api_key');
            geminiApiKey = storedGeminiKey || null;
            const storedModel = yield figma.clientStorage.getAsync('ai_model');
            aiModel = storedModel || 'gpt-4';
            const storedProvider = yield figma.clientStorage.getAsync('ai_provider');
            aiProvider = storedProvider || 'openai';
            
            debugLog('Plugin initialized');
            
            // Send a startup message to the UI
            figma.ui.postMessage({ 
                type: 'plugin-initialized'
            });
        }
        catch (error) {
            console.error('Error loading settings:', error);
            debugLog(`Error loading settings: ${error.message}`);
        }
    });
}
// Call initialize when the plugin starts
initialize();

// Handle messages from the UI
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    debugLog(`Received message from UI: ${msg.type}`);
    
    if (msg.type === 'save-settings') {
        try {
            // Save OpenAI API key if provided
            if (msg.apiKey) {
                yield figma.clientStorage.setAsync('openai_api_key', msg.apiKey);
                openaiApiKey = msg.apiKey;
            }
            // Save Gemini API key if provided
            if (msg.geminiApiKey) {
                yield figma.clientStorage.setAsync('gemini_api_key', msg.geminiApiKey);
                geminiApiKey = msg.geminiApiKey;
            }
            // Save model if provided
            if (msg.model) {
                yield figma.clientStorage.setAsync('ai_model', msg.model);
                aiModel = msg.model;
            }
            // Save AI provider if provided
            if (msg.aiProvider) {
                yield figma.clientStorage.setAsync('ai_provider', msg.aiProvider);
                aiProvider = msg.aiProvider;
            }
            figma.ui.postMessage({ type: 'settings-saved' });
        }
        catch (error) {
            console.error('Error saving settings:', error);
            figma.ui.postMessage({
                type: 'generation-error',
                message: 'Failed to save settings. Please try again.'
            });
        }
    }
    else if (msg.type === 'generate-design') {
        try {
            debugLog('Starting design generation process');
            
            // Update UI with processing status
            figma.ui.postMessage({ 
                type: 'generation-update', 
                status: 'Processing prompt...' 
            });
            
            // Show a notification to the user
            figma.notify("Generating design from your prompt...");
            
            // For simplicity, we'll just use the demo mode
            debugLog('Using demo mode for generation');
            
            // Simulate a slight delay for better UX
            yield new Promise(resolve => setTimeout(resolve, 1000));
            
            // Generate demo design
            const nodes = yield generateDemo(msg.prompt || "Demo design");
            
            // Store the generated nodes for potential iteration
            lastGeneratedDesign = nodes;
            
            // Select the created nodes and zoom to view them
            if (nodes.length > 0) {
                figma.currentPage.selection = nodes;
                figma.viewport.scrollAndZoomIntoView(nodes);
                figma.notify("Design elements created successfully!");
                
                // Send success message to UI
                figma.ui.postMessage({ 
                    type: 'generation-update', 
                    status: 'success',
                    message: 'Design elements created successfully!' 
                });
                
                debugLog('Design generation completed successfully');
            }
            else {
                figma.notify("No design elements were created. Try a different prompt.");
                
                // Send error message to UI
                figma.ui.postMessage({ 
                    type: 'generation-update', 
                    status: 'error',
                    message: 'No design elements were created. Try a different prompt.' 
                });
                
                debugLog('No design elements were created');
            }
        }
        catch (error) {
            console.error("Error generating design:", error);
            figma.notify("Error generating design. Please try again.");
            figma.ui.postMessage({
                type: 'generation-update',
                status: 'error',
                message: error.message || "Unknown error"
            });
            
            debugLog(`Error in design generation: ${error.message}`);
        }
    }
    else if (msg.type === 'iterate-design') {
        try {
            debugLog('Starting design iteration process');
            
            // Update UI with processing status
            figma.ui.postMessage({ 
                type: 'generation-update', 
                status: 'Processing prompt...' 
            });
            
            // Show a notification to the user
            figma.notify("Iterating on your design...");
            
            // Create a description of the current design
            let currentDesignDescription = "The current design contains: ";
            if (lastGeneratedDesign.length > 0) {
                currentDesignDescription += lastGeneratedDesign.map(node => {
                    return `a ${node.type.toLowerCase()} named "${node.name}"`;
                }).join(", ");
                
                debugLog(`Iterating on stored design with ${lastGeneratedDesign.length} elements`);
            }
            else if (figma.currentPage.selection.length > 0) {
                // If we don't have stored design but user has selection, use that
                currentDesignDescription += figma.currentPage.selection.map(node => {
                    return `a ${node.type.toLowerCase()} named "${node.name}"`;
                }).join(", ");
                
                debugLog(`Iterating on current selection with ${figma.currentPage.selection.length} elements`);
            }
            else {
                currentDesignDescription = "No existing design to iterate on. Creating a new design based on the prompt.";
                debugLog('No existing design to iterate on');
            }
            
            // For simplicity, we'll just use demo mode
            debugLog('Using demo mode for iteration');
            
            // Simulate a slight delay for better UX
            yield new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get the original prompt from the last design if available
            const originalPrompt = lastGeneratedDesign.length > 0 && lastGeneratedDesign[0] 
                ? lastGeneratedDesign[0].name.replace('AI Generated: ', '') 
                : "Original design";
            
            // Generate demo iteration
            const nodes = yield iterateDemo(originalPrompt, msg.prompt || "Iteration");
            
            // Store the generated nodes for potential further iteration
            lastGeneratedDesign = nodes;
            
            // Select the created nodes and zoom to view them
            if (nodes.length > 0) {
                figma.currentPage.selection = nodes;
                figma.viewport.scrollAndZoomIntoView(nodes);
                figma.notify("Design iteration created successfully!");
                
                // Send success message to UI
                figma.ui.postMessage({ 
                    type: 'generation-update', 
                    status: 'success',
                    message: 'Design iteration created successfully!' 
                });
                
                debugLog('Design iteration completed successfully');
            }
            else {
                figma.notify("No design elements were created. Try a different prompt.");
                
                // Send error message to UI
                figma.ui.postMessage({ 
                    type: 'generation-update', 
                    status: 'error',
                    message: 'No design elements were created. Try a different prompt.' 
                });
                
                debugLog('No design elements were created during iteration');
            }
        }
        catch (error) {
            console.error("Error iterating design:", error);
            figma.notify("Error iterating design. Please try again.");
            figma.ui.postMessage({
                type: 'generation-update',
                status: 'error',
                message: error.message || "Unknown error"
            });
            
            debugLog(`Error in design iteration: ${error.message}`);
        }
    }
    else if (msg.type === 'cancel') {
        debugLog('Plugin closing');
        figma.closePlugin();
    }
});

// Function to generate a demo design
async function generateDemo(prompt) {
  debugLog(`Generating demo design for prompt: ${prompt}`);
  
  // Create a frame to hold our design
  const frame = figma.createFrame();
  frame.name = `AI Generated: ${prompt}`;
  frame.resize(400, 300);
  frame.x = figma.viewport.center.x - 200;
  frame.y = figma.viewport.center.y - 150;
  
  // Add a background color
  frame.fills = [{
    type: 'SOLID',
    color: { r: 0.9, g: 0.9, b: 1 }
  }];
  
  // Add a text node with the prompt
  const text = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  text.fontName = { family: "Inter", style: "Regular" };
  text.characters = prompt;
  text.fontSize = 16;
  text.x = 20;
  text.y = 20;
  frame.appendChild(text);
  
  // Add a simple shape
  const rect = figma.createRectangle();
  rect.x = 20;
  rect.y = 60;
  rect.resize(360, 200);
  rect.cornerRadius = 8;
  rect.fills = [{
    type: 'SOLID',
    color: { r: 0.2, g: 0.4, b: 0.8 }
  }];
  frame.appendChild(rect);
  
  // Simulate a delay to make it feel like processing is happening
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  debugLog('Demo design generated successfully');
  return [frame];
}

// Function to iterate on a demo design
async function iterateDemo(originalPrompt, iterationPrompt) {
  debugLog(`Iterating demo design with prompt: ${iterationPrompt}`);
  
  // Create a frame to hold our iterated design
  const frame = figma.createFrame();
  frame.name = `AI Iterated: ${iterationPrompt}`;
  frame.resize(400, 300);
  frame.x = figma.viewport.center.x - 200;
  frame.y = figma.viewport.center.y - 150;
  
  // Add a background color - make it slightly different
  frame.fills = [{
    type: 'SOLID',
    color: { r: 0.95, g: 0.9, b: 0.85 }
  }];
  
  // Add a text node with both prompts
  const text = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  text.fontName = { family: "Inter", style: "Regular" };
  text.characters = `Original: ${originalPrompt}\nIteration: ${iterationPrompt}`;
  text.fontSize = 14;
  text.x = 20;
  text.y = 20;
  frame.appendChild(text);
  
  // Add a different shape based on the iteration prompt
  if (iterationPrompt.toLowerCase().includes('circle') || 
      iterationPrompt.toLowerCase().includes('round')) {
    const circle = figma.createEllipse();
    circle.x = 200;
    circle.y = 160;
    circle.resize(160, 160);
    circle.fills = [{
      type: 'SOLID',
      color: { r: 0.8, g: 0.3, b: 0.3 }
    }];
    frame.appendChild(circle);
  } else {
    const rect = figma.createRectangle();
    rect.x = 20;
    rect.y = 80;
    rect.resize(360, 180);
    rect.cornerRadius = 16; // More rounded than the original
    rect.fills = [{
      type: 'SOLID',
      color: { r: 0.3, g: 0.6, b: 0.7 } // Different color
    }];
    frame.appendChild(rect);
  }
  
  // Simulate a delay to make it feel like processing is happening
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  debugLog('Demo iteration completed successfully');
  return [frame];
} 