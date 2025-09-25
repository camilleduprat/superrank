# SuperRank - Design Rating Platform

## 🎯 **Project Overview**
A web platform that allows designers to upload their work, get it rated by AI, and compete on a leaderboard. Built with HTML/CSS/JS for smooth animations and multi-page flow.

## 🏗️ **Architecture**
- **Frontend**: HTML + CSS + Vanilla JavaScript
- **Design**: Dark theme (#171717), SF Pro font, smooth animations
- **Structure**: Multi-page flow with 7-step upload process
- **Backend**: Separate API for design analysis (to be integrated)

## 📁 **File Structure**
```
/
├── index.html              # Landing page with leaderboard
├── rating.html             # Entry point to upload flow
├── upload-script.js        # Step 1: Image upload
├── prompting-step.html     # Step 2: Context collection (3 states)
├── step5.html              # Step 5: Email collection
├── step6.html              # Step 6: Loading/processing
├── step7.html              # Step 7: Results display
├── styles.css              # Global styles
├── upload-styles.css       # Upload flow styles
└── assets/
    ├── fonts/              # SF Pro font files
    └── images/             # Icons and backgrounds
```

## ✅ **Completed Features**

### Landing Page (`index.html`)
- Dark theme with BgNoise.png background
- Leaderboard with 50 placeholder users
- "Get rated" button with glow effect
- Dynamic user count display
- Hover effects on leaderboard cards

### Upload Flow - Step 1 (`rating.html`)
- Single image upload with drag & drop
- Two states: default + uploaded
- Top-right close button
- Bottom navigation with progress dots
- Next arrow appears when image uploaded

### Context Collection (`prompting-step.html`)
- **State 1**: Image type selection (Component/Screen/Flow)
- **State 2**: Product description input
- **State 3**: Product location input
- Progress bar with visual feedback
- Back/forward navigation between states

### Email Collection (`step5.html`)
- Email input with send button
- Clean, minimal design
- Progress indicator

### Loading Screen (`step6.html`)
- Animated loading icon
- "Let's see what you're made of" title
- Processing state

### Results Page (`step7.html`)
- Rank display (e.g., "You ranked 28,462")
- Feedback message
- Next steps button

## 🔧 **Technical Details**

### Styling
- **Colors**: Dark (#171717), White text, Red accents
- **Font**: SF Pro (local files in assets/fonts/)
- **Animations**: CSS transitions, hover effects, loading animations
- **Responsive**: Mobile-first design

### JavaScript Features
- File upload handling
- State management for multi-step flows
- Progress tracking
- Navigation between steps
- Form validation

## 🚧 **Remaining Tasks**

### 1. Connect Flow Navigation
- Link all 7 steps together
- Implement proper back/forward navigation
- Handle data passing between steps

### 2. Backend Integration
- Connect to design analysis API
- Implement actual rating system
- Handle file uploads to backend

### 3. Database Setup
- User management system
- Leaderboard data storage
- Rating history tracking

### 4. Testing & Polish
- End-to-end flow testing
- UI/UX refinements
- Performance optimization

## 🎨 **Design System**

### Components
- **Buttons**: Primary (glow effect), Secondary, Close, Navigation
- **Inputs**: Text, Email, File upload
- **Progress**: Dots indicator, Progress bars
- **Cards**: Leaderboard entries, Upload states

### Icons (assets/images/)
- `icon-close-white.png` - Close buttons
- `icon-arrow-right.png` - Navigation arrows
- `icon-img.png` - Upload states
- `icon-loading.png` - Loading animation
- `icon-send-light.png` - Submit actions

## 🔄 **User Flow**
1. **Landing** → View leaderboard, click "Get rated"
2. **Upload** → Select and upload design image
3. **Context** → Provide image type, description, location
4. **Email** → Enter email for results
5. **Loading** → Processing/analysis
6. **Results** → View rank and feedback
7. **Complete** → Return to leaderboard

## 📝 **Next Steps Priority**
1. **HIGH**: Connect step navigation and data flow
2. **HIGH**: Backend API integration
3. **MEDIUM**: Database setup and user management
4. **LOW**: UI polish and additional features

## 🛠️ **Development Notes**
- All files are ready for integration
- Responsive design implemented
- Smooth animations and transitions
- Clean, maintainable code structure
- Ready for backend connection

---
*Last updated: Current session - All 7 steps built, flow connection pending*
