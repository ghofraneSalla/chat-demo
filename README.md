# Chatwoot Widget Demo

This is a simple demo application that demonstrates how to integrate and switch between different Chatwoot chat widgets in a React application.

## Features

- Switch between multiple Chatwoot chat widgets
- Enable/disable chat functionality
- Responsive design for different screen sizes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. The main page displays a list of available chat widgets
2. Click on any "Open Chat" button to open the corresponding chat widget
3. Use the "Enable Chat" / "Disable Chat" button to toggle chat functionality
4. When a chat is open, a close button appears in the bottom right corner

## Configuration

To add your own Chatwoot widgets, modify the `chatWidgets` array in `src/App.tsx`:

```typescript
const chatWidgets: IChat[] = [
  {
    id: '1',
    website_token: 'YOUR_WEBSITE_TOKEN_1',
    name: 'Support Chat',
    description: 'General customer support'
  },
  // Add more widgets as needed
];
```

Replace `YOUR_WEBSITE_TOKEN_1` with your actual Chatwoot website token.

## How It Works

The application uses a React context to manage the chat state and provide methods for opening and closing chat widgets. The Chatwoot SDK is dynamically loaded when needed and initialized with the appropriate configuration.

Key components:
- `SallaChatProvider`: Manages the chat state and provides methods for interacting with the chat
- `ChatDrawerComponent`: Renders the chat UI
- `ChatWidgetSelector`: Displays the available chat widgets

## License

MIT
