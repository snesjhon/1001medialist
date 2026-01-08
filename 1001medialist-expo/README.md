# 1001 Albums Expo App

Cross-platform mobile and web application for tracking progress through the "1001 Albums You Must Hear Before You Die" list.

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **UI Library**: Gluestack UI
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Icons**: Lucide React Native
- **Database**: Supabase
- **Authentication**: Supabase Auth (Magic Link Email)

## Migration from Next.js

This project was migrated from a Next.js web app to Expo for cross-platform support (iOS, Android, Web).

### ✅ Completed

#### Core Setup
- [x] Initialize Expo project with TypeScript
- [x] Configure Expo Router for file-based routing
- [x] Set up Gluestack UI for components
- [x] Configure NativeWind for Tailwind-style CSS
- [x] Install and configure Supabase client
- [x] Remove React Native Paper (replaced with Gluestack UI)

#### Authentication
- [x] Magic link email authentication
- [x] Deep linking configuration for auth redirects
- [x] Session persistence with AsyncStorage
- [x] Auth state management

#### Dashboard (Homepage)
- [x] Migrate homepage to dashboard view
- [x] Web-first responsive layout (max-width 1280px)
- [x] Two-column grid for Album/Movie cards
- [x] Media navigation header (home, random, prev/next)
- [x] Progress tracking component
- [x] Album card with cover art
- [x] Movie card with poster
- [x] Complete button with rating modal
- [x] Skip button functionality
- [x] Pull-to-refresh support

#### Components Migrated
- [x] `MediaHeader` - Navigation controls
- [x] `ProgressBar` - Progress tracking display
- [x] `AlbumCard` - Album details and actions
- [x] `MovieCard` - Movie details and actions
- [x] `CompleteButton` - Rating modal with stars
- [x] `SkipButton` - Skip functionality

#### Database Queries
- [x] `getCurrentPair()` - Get user's current album/movie pair
- [x] `getPairByNumber()` - Get specific pair
- [x] `getProgress()` - Get completion stats
- [x] `completeAlbum()` - Mark album complete with rating
- [x] `completeMovie()` - Mark movie complete with rating
- [x] `skipAlbum()` - Skip album
- [x] `skipMovie()` - Skip movie
- [x] `checkAndAdvancePair()` - Auto-advance when both complete

## Component Reference

### MediaHeader
**Location**: `components/dashboard/MediaHeader.tsx`

Controls for navigating the media list.

**Props**:
- `currentNumber: number` - Current pair number
- `totalNumber: number` - Total pairs (1001)
- `onHome: () => void` - Navigate to current pair
- `onRandom: () => void` - Navigate to random pair
- `onPrevious: () => void` - Go to previous pair
- `onNext: () => void` - Go to next pair

**UI Elements**:
- Home icon button
- Shuffle/random icon button
- Previous arrow button
- Number display (e.g., "4/1001")
- Next arrow button

### AlbumCard / MovieCard
**Location**: `components/dashboard/AlbumCard.tsx`, `MovieCard.tsx`

Media display cards with details and actions.

**Props**:
- `media: Album | Movie` - Media data
- `onComplete: (rating: number) => void` - Complete with rating
- `onSkip: () => void` - Skip media
- `onRefresh?: () => void` - Refresh data

**UI Elements**:
- Cover art/poster image (responsive sizing)
- Title (text-xl font-bold)
- Artist/Director name
- Metadata badges (year, genre, duration)
- "Show details" expandable section
- Complete button (with rating modal)
- Skip button

### ProgressBar
**Location**: `components/dashboard/ProgressBar.tsx`

Visual progress indicator with statistics.

**Props**:
- `albumsCompleted: number` - Albums finished
- `moviesCompleted: number` - Movies finished
- `totalPairs: number` - Total pairs (1001)

**UI Elements**:
- Progress percentage display
- Visual progress bar with gradient
- Breakdown stats (albums/movies completed)

### CompleteButton
**Location**: `components/dashboard/CompleteButton.tsx`

Button that opens a rating modal.

**Props**:
- `onComplete: (rating: number) => void` - Callback with rating
- `mediaType: 'album' | 'movie'` - Type of media

**UI Elements**:
- Primary action button
- Modal with star rating (1-10)
- Submit button
- Cancel option

### 🚧 TODO

#### UI/UX Improvements
- [ ] Add loading skeletons for cards
- [ ] Implement optimistic UI updates
- [ ] Add success/error toast notifications
- [ ] Create empty states for no data
- [ ] Add confirmation dialogs for destructive actions
- [ ] Implement swipe gestures for mobile (swipe to skip)
- [ ] Add haptic feedback on mobile interactions
- [ ] Create onboarding flow for new users
- [ ] Add keyboard shortcuts for power users
- [ ] Implement card flip animation for "Show details"

#### Pages to Migrate
- [ ] Stats page - User statistics and charts
- [ ] List page - Browse all 1001 albums
- [ ] History page - View listening history
- [ ] Media detail page (`/media/[number]`) - Individual pair view
- [ ] Profile/Settings page - User preferences

#### Features to Add
- [ ] Search functionality with debounce
- [ ] Filter by genre/year/status
- [ ] Sort options (chronological, rating, alphabetical)
- [ ] Export data (CSV, JSON)
- [ ] Share progress (social media, clipboard)
- [ ] Dark mode support with system preference
- [ ] Offline support with local caching
- [ ] Undo/redo for accidental skips

#### Mobile Optimization
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices (iPhone, Android)
- [ ] Optimize image loading (WebP, lazy loading, blurhash)
- [ ] Add mobile-specific gestures (swipe, long-press)
- [ ] Configure app icons and splash screens
- [ ] Test with VoiceOver (iOS) and TalkBack (Android)
- [ ] Optimize for notch/safe areas
- [ ] Test landscape orientation
- [ ] Add haptic feedback patterns

#### OAuth (Optional)
- [ ] Configure Google OAuth for mobile (requires Xcode)
- [ ] Configure Spotify OAuth
- [ ] Add social login options

#### Performance
- [ ] Image caching strategy
- [ ] Optimize bundle size
- [ ] Add loading skeletons
- [ ] Implement pagination for list view
- [ ] Add error boundaries

#### Developer Experience
- [ ] Add ESLint configuration
- [ ] Add Prettier configuration
- [ ] Set up pre-commit hooks
- [ ] Add unit tests
- [ ] Add E2E tests

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

### Installation

```bash
npm install
```

### Running the App

**Web:**
```bash
npm start
# Press 'w' for web
```

**iOS Simulator:**
```bash
npm start
# Press 'i' for iOS
```

**Android Emulator:**
```bash
npm start
# Press 'a' for Android
```

### Building for Production

**Web:**
```bash
npm run build:web
```

**iOS (requires EAS Build):**
```bash
npx eas build --platform ios
```

**Android:**
```bash
npx eas build --platform android
```

## Project Structure

```
1001medialist-expo/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Homepage/Dashboard
│   ├── dashboard.tsx      # Redirects to index
│   ├── stats.tsx          # Stats page (placeholder)
│   ├── list.tsx           # Album list (placeholder)
│   └── history.tsx        # History page (placeholder)
├── components/            # Reusable components
│   └── dashboard/         # Dashboard-specific components
│       ├── AlbumCard.tsx
│       ├── MovieCard.tsx
│       ├── MediaHeader.tsx
│       ├── ProgressBar.tsx
│       ├── CompleteButton.tsx
│       └── SkipButton.tsx
├── lib/                   # Utilities and configurations
│   ├── supabase.ts       # Supabase client setup
│   └── supabase-queries.ts # Database query functions
├── assets/               # Images and static files
├── .env                  # Environment variables
├── app.json             # Expo configuration
├── babel.config.js      # Babel configuration
├── metro.config.js      # Metro bundler config
├── tailwind.config.js   # Tailwind configuration
└── gluestack-ui.config.ts # Gluestack UI theme
```

## UI/UX Design Principles

### Design Philosophy
The app follows a **web-first, mobile-optimized** approach with these core principles:

1. **Content First**: Media cards are the hero element, displaying album art and movie posters prominently
2. **Progressive Disclosure**: Key information visible at glance, with "Show details" for additional context
3. **Clear Actions**: Distinct Complete and Skip buttons with immediate feedback
4. **Consistent Layout**: Two-column grid on web/tablet, single column on mobile
5. **Minimalist Navigation**: Focused toolbar with essential controls (home, shuffle, previous/next)

### Responsive Design Strategy

**Desktop/Tablet (>768px)**:
- Max width: 1280px centered container
- Two-column grid (Album | Movie) side-by-side
- Horizontal navigation bar
- Larger touch targets (44px minimum)

**Mobile (<768px)**:
- Single column stack (Album → Movie)
- Full-width cards with safe padding
- Bottom navigation for easier thumb reach
- Pull-to-refresh for data updates

### Component Architecture

**Atomic Design Approach**:
```
Atoms: Buttons, Icons, Badges, Text
Molecules: MediaHeader, ProgressBar, CompleteButton
Organisms: AlbumCard, MovieCard
Templates: Dashboard Layout
Pages: /dashboard, /list, /stats
```

**Key Components**:
- `MediaHeader`: Navigation controls with number display (4/1001)
- `ProgressBar`: Visual progress indicator with stats
- `AlbumCard`/`MovieCard`: Self-contained media display with actions
- `CompleteButton`: Modal with star rating (1-10 scale)
- `SkipButton`: Single-tap skip with confirmation

### Color System

**Primary Colors**:
- Blue accents for interactive elements (`bg-blue-500`)
- Green for completion states (`bg-green-500`)
- Neutral grays for backgrounds and text

**Semantic Colors**:
- Success: Green badges and buttons
- Info: Blue links and navigation
- Warning: Yellow for pending states
- Error: Red for destructive actions

### Typography

- **Headings**: Bold, clear hierarchy (text-xl, text-2xl)
- **Body**: Readable 16px base size
- **Labels**: Uppercase for badges (VOCAL POP, DRAMA)
- **Numbers**: Monospace for progress counters

### Accessibility

- Minimum 44x44px touch targets
- High contrast text (WCAG AA compliant)
- Semantic HTML structure
- Screen reader support with ARIA labels
- Keyboard navigation support
- Focus indicators on interactive elements

### Animation & Interactions

**Micro-interactions**:
- Button press feedback (scale/opacity)
- Modal slide-up animations
- Smooth transitions (150-300ms)
- Pull-to-refresh indicator
- Loading states with skeletons

**Performance**:
- 60fps animations using native driver
- Optimized image loading (progressive JPEGs)
- Lazy loading for off-screen content
- Debounced user inputs

## UI Patterns & Best Practices

### Card Design Pattern
```typescript
// Standard card structure
<View className="bg-white rounded-lg shadow-md p-4">
  {/* Image Section */}
  <Image source={coverArt} className="w-full aspect-square rounded-md" />

  {/* Content Section */}
  <View className="mt-4">
    <Text className="text-xl font-bold">{title}</Text>
    <Text className="text-gray-600">{subtitle}</Text>
  </View>

  {/* Badges Section */}
  <View className="flex-row gap-2 mt-2">
    <Badge variant="outline">{year}</Badge>
    <Badge variant="solid">{genre}</Badge>
  </View>

  {/* Actions Section */}
  <View className="flex-row gap-2 mt-4">
    <Button onPress={onComplete}>Complete</Button>
    <Button variant="outline" onPress={onSkip}>Skip</Button>
  </View>
</View>
```

### Modal Pattern
```typescript
// Rating modal example
<Modal visible={isOpen} animationType="slide">
  <View className="flex-1 justify-end">
    <View className="bg-white rounded-t-3xl p-6">
      <Text className="text-2xl font-bold mb-4">Rate this {mediaType}</Text>

      {/* Star rating component */}
      <StarRating value={rating} onChange={setRating} max={10} />

      {/* Actions */}
      <View className="flex-row gap-2 mt-6">
        <Button flex={1} onPress={() => onSubmit(rating)}>Submit</Button>
        <Button flex={1} variant="outline" onPress={onClose}>Cancel</Button>
      </View>
    </View>
  </View>
</Modal>
```

### Loading States
```typescript
// Skeleton loader pattern
{isLoading ? (
  <View className="bg-gray-200 rounded-lg p-4 animate-pulse">
    <View className="w-full aspect-square bg-gray-300 rounded-md" />
    <View className="h-6 bg-gray-300 rounded mt-4 w-3/4" />
    <View className="h-4 bg-gray-300 rounded mt-2 w-1/2" />
  </View>
) : (
  <MediaCard data={media} />
)}
```

### Error Handling
```typescript
// Error state pattern
{error ? (
  <View className="flex-1 items-center justify-center p-6">
    <Text className="text-red-500 text-lg font-bold mb-2">
      Oops! Something went wrong
    </Text>
    <Text className="text-gray-600 text-center mb-4">
      {error.message}
    </Text>
    <Button onPress={retry}>Try Again</Button>
  </View>
) : (
  <Content />
)}
```

### Responsive Utilities
```typescript
// Breakpoint usage with NativeWind
<View className="flex-col md:flex-row gap-4">
  <View className="w-full md:w-1/2">
    <AlbumCard />
  </View>
  <View className="w-full md:w-1/2">
    <MovieCard />
  </View>
</View>

// Conditional rendering for platform
import { Platform } from 'react-native';

const TouchComponent = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
  default: TouchableOpacity,
});
```

### Spacing System
Use consistent spacing scale:
- `gap-1` (4px) - Minimal spacing
- `gap-2` (8px) - Tight spacing
- `gap-4` (16px) - Default spacing
- `gap-6` (24px) - Comfortable spacing
- `gap-8` (32px) - Loose spacing

### Image Optimization
```typescript
// Progressive image loading
<Image
  source={{ uri: imageUrl }}
  className="w-full aspect-square"
  resizeMode="cover"
  defaultSource={require('./placeholder.png')}
  fadeDuration={300}
/>

// For large lists, use FlashList instead of FlatList
import { FlashList } from "@shopify/flash-list";
```

## Key Design Decisions

### Why Expo?
- Single codebase for iOS, Android, and Web
- No Xcode required for development
- EAS Build for cloud-based iOS builds
- Better developer experience than vanilla React Native

### Why Gluestack UI over alternatives?
- Modern, clean design (not Material Design)
- Works natively on all platforms
- Supports Tailwind-style styling
- Better than React Native Paper for cross-platform
- Customizable theme system
- Built-in accessibility features

### Why Magic Link Auth?
- No OAuth redirect complexity on mobile
- Works seamlessly on web and mobile
- Better UX than passwords
- Simpler to implement than OAuth
- Reduced security risks (no password storage)

### Why NativeWind?
- Familiar Tailwind syntax
- Works on native and web
- Better DX than StyleSheet
- Consistent with modern React patterns
- Responsive breakpoints built-in

## Supabase Configuration

### Required Auth Settings

In your Supabase project, add these redirect URLs:
- `http://localhost:8081/**` (for web development)
- `medialist1001://**` (for mobile deep linking)
- `exp://localhost:8081/--/**` (for Expo development)

### Database Schema

Tables needed:
- `profiles` - User profiles with current_pair_number
- `albums` - 1001 albums data
- `movies` - 1001 movies data
- `user_albums` - User's album completions
- `user_movies` - User's movie completions

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on web, iOS, and Android
4. Submit a pull request

## License

MIT
