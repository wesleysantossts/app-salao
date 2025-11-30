# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a beauty salon management app (app-salao) built with Expo and React Native. The app targets iOS, Android, and web platforms.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start on web browser

# Code quality
npm run lint       # Run ESLint
```

## Architecture

### Routing
- Uses **Expo Router** (v6) with file-based routing
- Main entry point: `expo-router/entry`
- Root layout: `app/_layout.tsx`
- Tab navigation: `app/(tabs)/_layout.tsx`
- Typed routes enabled via `experiments.typedRoutes` in app.json

### Project Structure
```
app/
├── (tabs)/           # Tab-based screens (index.tsx, explore.tsx)
├── components/       # Reusable components
│   ├── ui/          # UI primitives (icon-symbol, collapsible)
│   ├── themed-*     # Theme-aware components
│   └── ...
├── constants/        # Theme constants
├── hooks/           # Custom hooks (use-color-scheme, use-theme-color)
└── assets/          # Images and static files
```

### Theme System
- Dark/Light mode support via `@react-navigation/native` ThemeProvider
- `useColorScheme` hook for theme detection
- Platform-specific implementations (`.web.ts` variants for web)
- Theme colors defined in `constants/theme.ts`

### Path Aliases
- `@/*` maps to project root (configured in tsconfig.json)
- Example: `import { ThemedText } from '@/components/themed-text'`

### Key Technologies
- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo SDK**: ~54
- **TypeScript**: ~5.9.2 with strict mode
- **React Native Reanimated**: ~4.1.1 for animations
- **Expo Symbols**: For SF Symbols (iOS) and Material Icons
- **React Compiler**: Enabled experimentally

### Navigation
- Bottom tabs configured in `app/(tabs)/_layout.tsx`
- Stack navigation in root layout
- Modal presentation support
- Haptic feedback on tab presses via `HapticTab` component

### Platform Support
- iOS: Tablet support enabled
- Android: Edge-to-edge, adaptive icons, no predictive back gesture
- Web: Static output
- New Architecture enabled (`newArchEnabled: true`)

## Rules

- Dont comment in codebase.
- Reuse components.