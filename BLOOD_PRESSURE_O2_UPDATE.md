# Blood Pressure & Blood O2 Level System Update

## 🆕 New Features Added

### 1. **Blood Pressure System** 🫀
Added realistic blood pressure simulation that responds to heart rate and heart beat strength.

**Calculation:**
- Base: 120 mmHg (normal systolic pressure)
- Affected by heart rate deviation from 72 BPM
- Affected by heart beat strength deviation from 50%
- Formula: `BP = 120 + (heartRateFactor × 40) + (beatStrengthFactor × 30)`

**Realistic Effects:**

| Blood Pressure | Status | Effect |
|----------------|--------|--------|
| **> 200 mmHg** | 🔴 Hypertensive Crisis | Consciousness drains at 3%/sec, risk of stroke |
| **180-200 mmHg** | 🟠 Severe Hypertension | Consciousness drains at 1%/sec, headache, dizziness |
| **140-180 mmHg** | 🟡 Stage 2 Hypertension | Warning state, no drain but elevated risk |
| **120-140 mmHg** | 🟡 Stage 1 Hypertension | Pre-hypertension warning |
| **90-120 mmHg** | 🟢 Normal | Healthy range |
| **70-90 mmHg** | 🟡 Mild Hypotension | Consciousness drains at 1%/sec, lightheadedness |
| **< 70 mmHg** | 🔴 Severe Hypotension | Consciousness drains at 4%/sec, risk of fainting |

**How to Control:**
- **Increase BP**: Increase heart rate or heart beat strength via nanobots
- **Decrease BP**: Decrease heart rate or heart beat strength via nanobots
- **Natural factors**: Stress, drugs, and physical activity affect BP indirectly

### 2. **Blood O2 Level System** 🫁
Added realistic oxygen saturation simulation that responds to breathing rate and breath deepness.

**Calculation:**
- Normal breathing (12-20 BrPM, 50% deepness): O2 stays at 98%
- **Holding breath (0 BrPM)**: O2 decreases at 0.5% per second
- **Heavy breathing**: O2 can increase up to 100%
- Recovery rate depends on breathing efficiency

**Breathing Efficiency Formula:**
```
efficiency = (breathingRate / 16) × (breathDeepness / 50)
targetO2 = min(100, 95 + (efficiency × 5))
```

**Realistic Effects:**

| O2 Level | Status | Effect |
|----------|--------|--------|
| **< 70%** | 🔴 Severe Hypoxia | Consciousness drains at 8%/sec, organ damage risk |
| **70-80%** | 🟠 Moderate Hypoxia | Consciousness drains at 4%/sec, confusion, cyanosis |
| **80-90%** | 🟡 Mild Hypoxia | Consciousness drains at 1%/sec, shortness of breath |
| **90-95%** | 🟡 Low Normal | Warning state, slight impairment |
| **95-100%** | 🟢 Normal | Healthy oxygen saturation |

**Breath Holding Mechanics:**
- When breathing rate = 0 (holding breath):
  - O2 decreases at 0.5% per second
  - At 90% O2: Mild hypoxia begins
  - At 80% O2: Moderate hypoxia, consciousness starts draining
  - At 70% O2: Severe hypoxia, rapid consciousness loss
  - At 0% O2: Death (if sustained)

**Recovery:**
- Normal breathing (12-20 BrPM, 50% deepness): O2 recovers to 98%
- Heavy breathing (>20 BrPM, >50% deepness): O2 can reach 100%
- Recovery rate depends on breathing efficiency

### 3. **Integration with Consciousness System**
Blood pressure and O2 levels now directly affect consciousness drain:

**Priority Order:**
1. Heart rate effects (cardiac arrest, tachycardia)
2. Breathing rate effects (respiratory arrest)
3. **Blood O2 effects (hypoxia)** ← NEW
4. **Blood pressure effects (hypo/hypertension)** ← NEW
5. Overdose effects

**Combined Effects:**
- Multiple critical conditions stack their drain rates
- Example: Low O2 (8%/sec) + Low BP (4%/sec) = 12%/sec total drain
- Character can pass out or die from any critical condition

## 📊 Physiological Accuracy

### Blood Pressure Ranges (Medical Standards)
- **Normal**: 90-120 mmHg systolic
- **Elevated**: 120-129 mmHg
- **Stage 1 Hypertension**: 130-139 mmHg
- **Stage 2 Hypertension**: 140-180 mmHg
- **Hypertensive Crisis**: > 180 mmHg
- **Hypotension**: < 90 mmHg

### Blood O2 Ranges (Medical Standards)
- **Normal**: 95-100%
- **Mild Hypoxia**: 90-94%
- **Moderate Hypoxia**: 80-89%
- **Severe Hypoxia**: < 80%
- **Critical**: < 70% (organ damage imminent)

### Breath Holding Timeline
- **0-30 seconds**: O2 drops from 98% to 83%
- **30-60 seconds**: O2 drops from 83% to 68%
- **60-90 seconds**: O2 drops from 68% to 53%
- **90+ seconds**: Severe hypoxia, unconsciousness likely

## 🎮 Gameplay Impact

### Strategic Depth
- **Nanobot control**: 4-dimensional vital management
  1. Heart Rate (BPM)
  2. Breathing Rate (BrPM)
  3. Heart Beat Strength (%)
  4. Breath Deepness (%)
- **Blood pressure**: Balance between heart rate and beat strength
- **Oxygen management**: Balance between rate and deepness

### Challenge Scenarios
- **Breath holding challenges**: How long can you hold your breath?
- **High altitude simulation**: Lower O2, need deeper breathing
- **Hypertension management**: Keep BP in healthy range
- **Multi-system crises**: Handle multiple vital issues simultaneously

### Realistic Consequences
- Holding breath too long → Hypoxia → Unconsciousness
- Extreme heart rate + strength → Hypertensive crisis
- Very low BP → Fainting, organ failure
- Combined issues → Rapid deterioration

## 🔧 Technical Implementation

### Type System Updates
```typescript
// Added to SimulationState
bloodPressure: number; // mmHg (systolic)
bloodO2Level: number; // 0-100% (oxygen saturation)
```

### Calculation Logic
```typescript
// Blood pressure calculation
const heartRateFactor = (heartRate - 72) / 72;
const beatStrengthFactor = (heartBeatStrength - 50) / 50;
bloodPressure = 120 + (heartRateFactor × 40) + (beatStrengthFactor × 30);

// Blood O2 calculation
if (breathingRate === 0) {
  // Holding breath
  bloodO2Level = max(0, bloodO2Level - 0.5 × simDt);
} else {
  // Normal breathing
  const breathingEfficiency = (breathingRate / 16) × (breathDeepness / 50);
  const targetO2 = min(100, 95 + (breathingEfficiency × 5));
  // Recovery towards target
  bloodO2Level = lerp(bloodO2Level, targetO2, breathingEfficiency × 0.2 × simDt);
}
```

### UI Display
- **Blood Pressure**: Shows in mmHg with color coding
  - 🟢 Green: 90-120 mmHg (normal)
  - 🟡 Yellow: < 90 or 140-180 mmHg (warning)
  - 🟠 Orange: 180-200 mmHg (severe)
  - 🔴 Red: > 200 mmHg (critical)

- **Blood O2**: Shows percentage with progress bar
  - 🟢 Green: 95-100% (normal)
  - 🟡 Yellow: 90-94% (low)
  - 🟠 Orange: 80-89% (moderate hypoxia)
  - 🔴 Red: < 80% (severe hypoxia)

## 📈 Statistics

- **New Vitals**: 2 (blood pressure, blood O2)
- **Consciousness Drain Sources**: 5 (was 3)
- **Critical Conditions**: 12 total
- **Realistic Ranges**: Based on medical standards
- **UI Elements**: 2 new stat displays with color coding

## 🎯 Future Enhancements (Optional)

### Potential Additions
- **Diastolic pressure**: Add diastolic reading (e.g., 120/80 mmHg)
- **CO2 levels**: Track carbon dioxide buildup during breath holding
- **pH balance**: Blood acidity affected by CO2 and O2
- **Heart rhythm**: Detect arrhythmias, fibrillation patterns
- **Oxygen therapy**: Medical intervention to boost O2
- **BP medications**: Drugs to lower blood pressure

### Visual Enhancements
- **BP waveform**: Real-time pressure wave visualization
- **O2 dissociation curve**: Show hemoglobin saturation
- **Capillary refill**: Visual indicator of perfusion
- **Cyanosis**: Blue tint to character when O2 < 80%

## ✅ Build Status

**Build Successful** (1,098 KB / 300 KB gzipped)

All features integrated and functional. No breaking changes.

---

**Update Version**: 2.6.0  
**Date**: 2024  
**Status**: ✅ Complete and Tested

## 🎮 How to Use

### Monitoring Vitals
1. Check StatsPanel at bottom of screen
2. Look for "BP" (blood pressure) and "O₂" (oxygen) displays
3. Color coding shows current status

### Using Nanobots
1. Inject nanobots via drug menu
2. Open 🤖 NANOBOT CONTROL section
3. Adjust 4 sliders:
   - Heart Rate (BPM)
   - Breathing Rate (BrPM)
   - Heart Beat Strength (%)
   - Breath Deepness (%)
4. Watch BP and O2 respond in real-time

### Breath Holding Challenge
1. Set breathing rate to 0 via nanobots
2. Watch O2 decrease at 0.5%/sec
3. See how long you can maintain consciousness
4. Restore breathing before O2 drops too low

### Blood Pressure Management
1. Increase heart rate → BP increases
2. Increase beat strength → BP increases
3. Decrease both → BP decreases
4. Keep BP in 90-120 mmHg range for health

---

**Note**: This update focuses on physiological simulation. The personal account system (player comments, suggestions, sign-up flow) will be implemented in a dedicated future update.
