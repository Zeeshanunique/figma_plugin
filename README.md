# AI Design Generator - Figma Plugin

A Figma plugin that uses AI to generate design elements directly within Figma based on text prompts.

## Features

- Text-to-design generation using AI
- Simple and intuitive user interface
- Works with or without an API key (demo mode available)
- Generates design elements directly in your Figma file

## Installation

1. Download this repository as a ZIP file and extract it
2. In Figma, go to **Plugins > Development > Import plugin from manifest...**
3. Select the `manifest.json` file from the extracted folder

## Usage

1. Select where you want to place the generated design in your Figma file
2. Open the plugin from the Plugins menu
3. Enter a descriptive prompt for what you want to generate
4. (Optional) Enter your OpenAI API key if you want to use the AI generation feature
5. Click "Generate Design"
6. The plugin will create a new frame with your generated design elements

## Prompt Tips

For best results when using AI generation:

- Be specific about what design element you need (icon, button, layout, etc.)
- Include details about style, colors, and mood
- Mention the intended use case or context

Examples:
- "A minimalist logo for a coffee shop with a cup icon and clean typography"
- "A colorful gradient button with rounded corners for a mobile app"
- "A professional sidebar navigation menu with icons for a banking dashboard"

## API Key

If you have an OpenAI API key, you can use it to access the AI generation features. Without an API key, the plugin will run in demo mode with simulated designs.

To get an API key:
1. Sign up at [OpenAI](https://platform.openai.com/signup)
2. Navigate to the [API Keys page](https://platform.openai.com/api-keys)
3. Create a new secret key
4. Copy and paste it into the plugin's API Key field

Note: Keep your API key secure and never share it publicly.

## Development

This plugin is built using:
- Figma Plugin API
- HTML/CSS/JavaScript
- OpenAI API (optional)

To modify the plugin:
1. Edit the code in your preferred code editor
2. Make your changes to the files
3. Test the plugin in Figma's development mode

## License

This project is licensed under the MIT License - see the LICENSE file for details. 