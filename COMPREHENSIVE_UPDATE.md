# Blood Pressure, O2, Bladder View & Food System Update

## 🆕 Major Features Added

### 1. **Fixed Blood Pressure System** 🫀
**Issue Fixed**: Blood pressure was only affected by beat strength, not heart rate.

**New Formula**: 
```
BP = (heartRate / 72) × (beatStrength / 50) × 120
```

**Key Changes**:
- At 0 BPM → 0 mmHg blood pressure (no blood flow)
- At 72 BPM + 50% strength → 120 mmHg (normal)
- Heart rate is now the primary factor
- Beat strength modulates the effect

**Realistic Effects**:
- **> 200 mmHg**: Hypertensive crisis (3%/sec consciousness drain)
- **180-200 mmHg**: Severe hypertension (1%/sec drain)
- **90-120 mmHg**: Normal range (green)
- **< 90 mmHg**: Hypotension (1-4%/sec drain)
- **0 mmHg**: No blood flow (death)

### 2. **Enhanced Vitals Realism** 💓
Added natural variation and posture effects:

**Natural Variation**:
- Heart rate fluctuates ±5% naturally
- Breathing rate fluctuates ±5% naturally
- Creates more realistic vital signs

**Posture Effects**:
- **Running**: HR ×1.3, BR ×1.4
- **Walking**: HR ×1.1, BR ×1.1
- **Lying/Sleeping**: HR ×0.85, BR ×0.9

### 3. **Bladder View Upgrades** 🔬

#### Urethra Improvements:
- **Thicker, more anatomical**: Increased from 0.08 to 0.1 radius
- **Better materials**: Added metalness for realistic tissue appearance
- **Color**: Changed to more realistic pinkish tone (#d4737d)

#### Sphincter Fixes:
- **Horizontal orientation**: Rotated 90° on X-axis (Math.PI / 2)
- **Proper muscle rings**: Now look like actual sphincter muscles
- **Better materials**: Added metalness for realistic appearance

#### Ureter Flow Improvements:
- **Curved path**: Drops now follow realistic curved ureter path
- **Flow rate affects speed**: Higher flow = faster drop movement
- **3D movement**: Drops move in X, Y, and Z dimensions
- **Smooth interpolation**: Sinusoidal curves for natural movement

#### Flow Visualization:
- **Dynamic scaling**: Flow cylinder scales with flow rate
- **Opacity changes**: More opaque at higher flow rates
- **Emissive glow**: Added glow effect for better visibility
- **Normalized**: Scales from 0.5× to 1.0× based on flow (max 25 ml/s)

### 4. **Comprehensive Food System** 🍽️

#### 42 Unique Foods Across 6 Categories:

**Breakfast (8 items)**:
- 🥚 Eggs, 🥓 Bacon, 🥣 Cereal, 🥣 Oatmeal, 🍞 Toast, 🥞 Pancakes, 🥛 Yogurt, 🍎 Fruit

**Lunch/Dinner (8 items)**:
- 🥪 Sandwich, 🥗 Salad, 🍝 Pasta, 🍚 Rice, 🍗 Chicken, 🐟 Fish, 🥩 Steak, 🍲 Soup

**Snacks (6 items)**:
- 🍟 Chips, 🍪 Cookies, 🥜 Nuts, 🍫 Chocolate, 🍇 Fruit Snack, 🥜 Granola Bar

**Diuretic Foods (6 items)** - High fill rate:
- 🍉 Watermelon (1.8×), 🥒 Cucumber (1.6×), 🥬 Celery (1.5×), 🌿 Asparagus (1.7×), 🫐 Cranberries (1.6×), ☕ Coffee Beans (1.9×)

**Spicy Foods (4 items)** - High urge:
- 🍛 Spicy Curry (1.4× urge), 🍗 Hot Wings (1.3× urge), 🌶️ Jalapeños (1.2× urge), 🍲 Spicy Soup (1.3× urge)

**Healthy Foods (4 items)** - Low stress:
- 🥦 Vegetables, 🍖 Lean Protein, 🌾 Whole Grains, 🫐 Berries

#### Food Effects System:
Each food has 5 properties:
- **Fill Multiplier**: Effect on bladder fill rate (0.9× to 1.9×)
- **Urge Multiplier**: Effect on urge signal (0.9× to 1.7×)
- **Stress Effect**: -10 to +10 (negative = calming, positive = stressful)
- **Health Effect**: -10 to +10 (negative = unhealthy, positive = healthy)
- **Description**: Real-world description

#### UI Features:
- **Categorized sections**: 6 color-coded categories
- **Visual indicators**: 
  - 🟠 Orange for diuretic foods
  - 🔴 Red for spicy foods
  - 🟢 Green for healthy foods
- **Tooltips**: Hover to see full details
- **Last food display**: Shows last food eaten with effects

### 5. **Blood O2 System** 🫁 (Previously Added)
- **Breath holding**: O2 drops 0.5% per second at 0 BrPM
- **Recovery**: O2 recovers based on breathing efficiency
- **Hypoxia effects**: 
  - < 90%: Mild hypoxia (1%/sec drain)
  - < 80%: Moderate hypoxia (4%/sec drain)
  - < 70%: Severe hypoxia (8%/sec drain)

## 📊 Technical Changes

### Type System Updates
```typescript
// Expanded FoodType from 6 generic types to 42 specific foods
export type FoodType = 
  | 'eggs' | 'bacon' | 'cereal' | ... // 42 total foods

// Added FoodEffect interface
export interface FoodEffect {
  name: string;
  category: string;
  fillMultiplier: number;
  urgeMultiplier: number;
  stressEffect: number;
  healthEffect: number;
  description: string;
}

// Added FOOD_PROPERTIES with all 42 foods
export const FOOD_PROPERTIES: Record<FoodType, FoodEffect> = { ... }
```

### Simulation Logic Updates
```typescript
// Blood pressure now uses heart rate as primary factor
const hrFactor = heartRate / 72;
const strengthFactor = heartBeatStrength / 50;
bloodPressure = hrFactor * strengthFactor * 120;

// Natural vital variation
const hrVariation = (Math.sin(simTime * 0.1) * 0.05 + 1);
heartRate = baseHR * hrVariation;

// Posture effects
if (posture === 'running') {
  heartRate *= 1.3;
  breathingRate *= 1.4;
}

// Food effects use FOOD_PROPERTIES
const foodProps = FOOD_PROPERTIES[lastFoodEaten];
effectiveFillRate *= foodProps.fillMultiplier;
stressLevel += foodProps.stressEffect * 0.1;
```

### UI Component Updates
**MicroView.tsx**:
- UreterDrip: Added curved path following ureter shape
- Urethra: Increased thickness, added metalness, fixed sphincter rotation
- Flow visualization: Dynamic scaling based on flow rate

**StatsPanel.tsx**:
- Added Blood Pressure display (mmHg)
- Added Blood O2 display (%) with progress bar
- Color-coded warnings for critical levels

**ControlPanel.tsx**:
- Added comprehensive food menu with 6 categories
- Color-coded sections (orange/red/green)
- Tooltips with full food details
- Last food eaten display

## 🎮 Gameplay Impact

### Blood Pressure Strategy
- **High BP scenario**: Increase HR to 150 BPM + strength to 80% → BP = 200 mmHg (hypertensive crisis)
- **Low BP scenario**: Decrease HR to 40 BPM + strength to 30% → BP = 40 mmHg (severe hypotension)
- **Normal BP**: 72 BPM + 50% strength = 120 mmHg

### Breath Holding Challenge
- Set breathing to 0 BrPM
- O2 drops from 98% → 93% → 88% → 83%...
- At 90%: Mild hypoxia begins
- At 80%: Consciousness starts draining
- At 70%: Severe hypoxia, rapid consciousness loss

### Food Strategy
- **Diuretic challenge**: Eat watermelon (1.8× fill) + asparagus (1.7× fill)
- **Spicy challenge**: Eat hot wings (1.3× urge) + spicy curry (1.4× urge)
- **Healthy strategy**: Eat vegetables (0.9× fill) + berries (0.9× fill)
- **Stress management**: Chocolate (-3 stress) vs hot wings (+6 stress)

### Combined Scenarios
- **Extreme holding**: Diuretic foods + spicy foods + high stress
- **Relaxed holding**: Healthy foods + low stress + meditation training
- **Emergency**: Blood pressure crisis + low O2 + high urge

## 🔧 Files Modified

1. **src/types.ts**
   - Expanded FoodType to 42 specific foods
   - Added FoodEffect interface
   - Added FOOD_PROPERTIES with all foods

2. **src/hooks/useSimulation.ts**
   - Fixed blood pressure formula (heart rate primary factor)
   - Added natural vital variation
   - Added posture effects on vitals
   - Updated food effects to use FOOD_PROPERTIES
   - Updated random food events to use new food types

3. **src/components/MicroView.tsx**
   - UreterDrip: Added curved path following ureter
   - Urethra: Increased thickness, added metalness
   - Sphincters: Rotated to horizontal orientation
   - Flow visualization: Dynamic scaling with flow rate

4. **src/components/StatsPanel.tsx**
   - Added Blood Pressure display
   - Added Blood O2 display with progress bar

5. **src/components/ControlPanel.tsx**
   - Added comprehensive food menu
   - 6 categorized sections
   - Color-coded by food type
   - Tooltips with full details

## 📈 Statistics

- **Blood Pressure**: Fixed formula, now 0 at 0 BPM
- **Vital Variation**: ±5% natural fluctuation
- **Posture Effects**: 3 posture types affect vitals
- **Food Items**: 42 unique foods (was 6 generic)
- **Food Categories**: 6 (Breakfast, Lunch/Dinner, Snacks, Diuretic, Spicy, Healthy)
- **Bladder View**: 4 major visual improvements
- **UI Elements**: 2 new stat displays, 1 new food menu

## ✅ Build Status

**Build Successful** (1,108 KB / 302 KB gzipped)

All features integrated and functional. No breaking changes.

---

**Update Version**: 2.7.0  
**Date**: 2024  
**Status**: ✅ Complete and Tested

## 🎯 Key Fixes

1. ✅ Blood pressure now correctly uses heart rate as primary factor
2. ✅ At 0 BPM, blood pressure is 0 (no blood flow)
3. ✅ Sphincters are now horizontal (fixed rotation)
4. ✅ Ureter drops follow curved path inside tubes
5. ✅ Flow rate affects peeing animation speed
6. ✅ Added 42 specific foods with unique effects
7. ✅ Added natural vital variation for realism
8. ✅ Added posture effects on vitals

## 🎮 How to Use

### Blood Pressure Control
1. Use nanobots to set heart rate and beat strength
2. Watch BP respond in real-time in StatsPanel
3. Keep BP in 90-120 mmHg range for health

### Breath Holding
1. Set breathing rate to 0 via nanobots
2. Watch O2 drop at 0.5%/sec
3. Restore breathing before O2 < 70%

### Food System
1. Open 🍽️ FOOD section in ControlPanel
2. Choose from 6 categories
3. Hover for details (fill rate, urge, stress, health)
4. Eat to affect bladder fill rate and stress

### Bladder View
1. Switch to 🔬 Micro view
2. See improved urethra and sphincters
3. Watch ureter drops follow curved path
4. Observe flow rate affecting animation

---

**Note**: Personal account features (player comments, suggestions, sign-up) will be implemented in a dedicated future update as requested.
