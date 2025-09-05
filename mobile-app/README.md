# Jan Mobile - AI Chat Assistant

A mobile version of the Jan AI assistant built with Tauri, React, and TypeScript. This app provides a streamlined chat interface optimized for mobile devices with support for remote AI API connections.

## Features

- **Mobile-Optimized UI**: Touch-friendly interface designed for phones and tablets
- **Remote AI API Support**: Connect to OpenAI, Anthropic, or custom API endpoints
- **Streaming Responses**: Real-time streaming of AI responses for better UX
- **Configurable Settings**: Easy setup for different AI providers
- **Cross-Platform**: Supports both Android and iOS through Tauri
- **Offline-First Architecture**: Local storage for settings and conversation history

## Quick Start

### Prerequisites

- Node.js ≥ 20.0.0
- Yarn ≥ 1.22.0
- Rust and Cargo
- Android SDK (for Android builds)
- Xcode (for iOS builds on macOS)

### Development

1. **Install dependencies:**
   ```bash
   cd jan
   yarn install
   ```

2. **Start the mobile development server:**
   ```bash
   yarn dev:mobile
   ```

3. **For native mobile development:**
   ```bash
   # Android
   yarn mobile:android
   
   # iOS (macOS only)
   yarn mobile:ios
   ```

### Configuration

1. Open the app and navigate to Settings (gear icon)
2. Choose your AI provider (OpenAI, Anthropic, or Custom)
3. Enter your API key and configure the endpoint
4. Test the connection and save your settings
5. Return to the main screen and start chatting!

### Supported AI Providers

- **OpenAI**: GPT-3.5, GPT-4, and other OpenAI models
- **Anthropic**: Claude 3 models (Haiku, Sonnet, Opus)
- **Custom**: Any OpenAI-compatible API endpoint

## Architecture

The mobile app leverages the existing Jan codebase structure:

- **Core Library**: Shared `@janhq/core` package for AI functionality
- **Mobile UI**: React components optimized for touch interfaces
- **State Management**: Zustand for lightweight state management
- **Routing**: TanStack Router for navigation
- **Styling**: Tailwind CSS with mobile-first design
- **Backend**: Tauri for native mobile functionality

## Key Components

- `ChatScreen`: Main chat interface with message history
- `MessageBubble`: Individual message rendering with markdown support
- `ChatInput`: Touch-optimized input with auto-resize
- `SettingsScreen`: API configuration and connection testing
- `Header`: Navigation and app controls

## Build for Production

```bash
# Build the mobile app
yarn build:mobile

# Build for specific platforms
yarn mobile:android  # Android APK/Bundle
yarn mobile:ios      # iOS IPA (macOS only)
```

## API Configuration

The app supports multiple AI providers with the following configuration options:

### OpenAI
- Base URL: `https://api.openai.com/v1`
- Models: `gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`
- Requires: OpenAI API key

### Anthropic
- Base URL: `https://api.anthropic.com`
- Models: `claude-3-haiku-20240307`, `claude-3-sonnet-20240229`
- Requires: Anthropic API key

### Custom
- Configurable base URL
- OpenAI-compatible API format
- Custom model names supported

## Security

- API keys are stored locally on the device
- No data is sent to Jan servers
- All communication is directly with your chosen AI provider
- Settings can be cleared at any time

## Troubleshooting

### Connection Issues
1. Verify your API key is correct
2. Check the base URL format
3. Ensure you have internet connectivity
4. Use the connection test feature in settings

### Build Issues
1. Ensure all prerequisites are installed
2. Check that Rust and Cargo are up to date
3. Verify mobile development dependencies (Android SDK/Xcode)
4. Clear node_modules and reinstall if needed

## Contributing

This mobile app is part of the larger Jan project. Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing to the project.

## License

Apache 2.0 - See [LICENSE](../LICENSE) for details.