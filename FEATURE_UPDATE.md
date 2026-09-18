# The Vessel: Internal Sandbox - Feature Update

## New Features Added

### 1. Social Media Platform (BladderChat)
- **New View Mode**: 📱 Social tab in the view selector
- **Live Feed**: AI-generated posts from Sarah_J and other users
- **Context-Aware Posts**: 
  - Posts about daily life when bladder is normal
  - Bladder-related posts when volume is high (>70%)
  - Special posts when full bladder preference trait is active
- **Live Streaming**: 
  - Automatically starts when bladder is >80% full
  - Shows viewer count (5-50 viewers)
  - Displays visible bladder bulge when >85% full
  - Live chat comments from viewers
  - Streams for 10-30 minutes sim time
- **Post Generation**: Random chance based on activity level, max 50 posts in feed

### 2. Heart View Mode
- **New View Mode**: ❤️ Heart tab in the view selector
- **3D Heart Visualization**:
  - Realistic beating animation synced to heart rate
  - Color changes based on urgency (green → orange → red)
  - Systole/diastole animation phases
- **Vitals Display**:
  - Heart rate (BPM) with color coding
  - Breathing rate (BrPM)
  - Status indicator (NORMAL/MODERATE/ELEVATED)
  - ECG-style pulse visualization

### 3. Expanded Drink Options
Added 5 new drink types (10 total):
- 💧 Water (1× fill, 1× urge)
- ☕ Coffee (1.5× fill, 1.3× urge)
- 🍵 Tea (1.5× fill, 1.2× urge)
- 🍺 Alcohol (1.8× fill, 0.5× urge - suppresses awareness)
- 🥤 Soda (1.2× fill, 1.1× urge, carbonation pressure spikes)
- ⚡ Energy Drink (1.6× fill, 1.4× urge, carbonation)
- 🧃 Juice (1.1× fill, 1× urge, 1.1× volume)
- 🥛 Milk (0.9× fill, 0.9× urge, 1.2× volume)
- 🥤 Smoothie (1× fill, 1× urge, 1.3× volume)
- 🍫 Hot Chocolate (1.1× fill, 1.1× urge, 1.1× volume)

### 4. Bladder Training Enhancements
- **Speed Multiplier Slider**: 1× to 30× speed control
  - 1× = original speed
  - 30× = extremely fast training
- **Auto-Rounding**: Max capacity rounds to nearest 100ml
  - Example: 520ml → 500ml, 560ml → 600ml
- **Faster Progress**: Training rate multiplied by speed setting
- **Visual Feedback**: Training level and max capacity update in real-time

### 5. New Trait: Full Bladder Preference
- **Toggle Button**: In Traits section of control panel
- **When Active**:
  - Likes having a full bladder (>70%): Urge signal reduced by 50%
  - Anxious when empty (<20%): Urge signal artificially raised to 60%
  - Special social media posts reflecting this preference
- **Psychological Effect**: Creates unique gameplay dynamic where empty bladder causes more distress than full

## Technical Implementation

### Social Media System
- Post generation uses context from bladder state, location, and traits
- Live streaming triggers automatically based on bladder volume
- Viewer count fluctuates realistically
- Posts stored in state array (max 50, FIFO)

### Heart Visualization
- Custom 3D heart model using Three.js primitives
- Beat animation synced to actual heart rate BPM
- Smooth transitions between urgency states
- ECG visualization using SVG path animation

### Training System
- Speed multiplier affects both capacity increase and desensitization
- Rounding applied after each calculation
- Prevents fractional capacity values
- Maintains balance at high speeds

### Trait System
- Modifies urge signal calculation based on fill ratio
- Creates inverse relationship between fullness and comfort
- Integrates with social media post generation
- Persists across simulation resets

## UI Changes

### View Selector
- Added 2 new view buttons: 📱 Social and ❤️ Heart
- Total of 5 view modes: Micro, Macro, Split, Social, Heart
- Color-coded buttons for easy identification

### Control Panel
- Expanded drink grid to 2 rows (5 columns)
- Added Training Speed section with slider
- Added Traits section with toggle button
- All new controls use consistent styling

### Stats Panel
- Already displays training level and max capacity
- Shows desensitization percentage
- Heart rate and breathing rate now more relevant with Heart view

## Usage Tips

1. **Social Media**: Switch to Social view to see posts. She'll go live automatically when very full.
2. **Heart View**: Great for monitoring stress levels during high-urgency scenarios.
3. **Training Speed**: Start at 1× to understand mechanics, then increase for faster progression.
4. **Full Bladder Trait**: Creates interesting challenge - try to keep bladder empty to avoid anxiety.
5. **Drink Variety**: Different drinks have unique effects - experiment with combinations.

## Balance Notes

- Social media posts generate at ~0.02% chance per tick when awake
- Live streams trigger at ~0.005% chance when bladder >80%
- Training at 30× speed reaches max capacity (800ml) in ~10 minutes real time
- Full bladder preference trait creates 50% urge reduction when >70% full
- Empty bladder anxiety triggers at <20% fill with trait active
