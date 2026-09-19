# Gradual Death System Implementation

## Overview
Replaced instant death with a gradual consciousness drain system. Players now have time to react and save the character when vitals become critical.

## How It Works

### Consciousness System
- **Consciousness Level**: 0-100% (displayed in stats panel with visual bar)
- **Pass Out**: Occurs when consciousness drops below 20%
- **Wake Up**: Occurs when consciousness recovers above 50%
- **Death**: Occurs when consciousness stays at 0% for 30 seconds

### Consciousness Drain Rates

#### Heart Rate Effects
| Heart Rate | Drain Rate | Condition |
|------------|------------|-----------|
| 0 BPM | +10%/sec | Cardiac arrest (fastest drain) |
| 1-19 BPM | +5%/sec | Severe bradycardia |
| 20-29 BPM | +2%/sec | Moderate bradycardia |
| 30-250 BPM | 0%/sec | Normal/safe range |
| 251-300 BPM | +2%/sec | Severe tachycardia |
| 301-350 BPM | +5%/sec | Extreme tachycardia |
| 351+ BPM | +10%/sec | Ventricular fibrillation (fastest drain) |

#### Breathing Rate Effects
| Breathing Rate | Drain Rate | Condition |
|----------------|------------|-----------|
| 0 BrPM | +10%/sec | Respiratory arrest (fastest drain) |
| 1-2 BrPM | +5%/sec | Severe respiratory depression |
| 3-4 BrPM | +2%/sec | Respiratory depression |
| 5+ BrPM | 0%/sec | Normal/safe range |

#### Overdose Effects
- Fatal overdoses add +3%/sec drain rate
- Stacks with heart/breathing effects

### Recovery System
- When vitals return to safe ranges, consciousness regenerates at +1%/sec
- Character wakes up from pass out when consciousness exceeds 50%
- Death countdown resets to 0 when consciousness recovers above 0%

## Visual Indicators

### Stats Panel
1. **Consciousness Bar**: Green (50-100%) → Yellow (20-49%) → Red (0-19%)
2. **DYING Indicator**: Shows countdown timer (e.g., "25s") when consciousness is at 0%
3. **PASSED OUT Indicator**: Shows when consciousness < 20% but not dying
4. **DEAD Indicator**: Shows death cause when character dies

### Example Timeline
```
Time 0:00 - Heart rate drops to 0 BPM
Time 0:00 - Consciousness starts draining at 10%/sec
Time 0:10 - Consciousness reaches 0%, character passes out
Time 0:10 - "DYING 30s" appears in stats
Time 0:15 - Player notices and adjusts nanobots to 80 BPM
Time 0:15 - Consciousness starts recovering at 1%/sec
Time 0:25 - Consciousness reaches 10%
Time 0:40 - Consciousness reaches 25%, character wakes up
Time 1:00 - Consciousness fully recovered to 100%
```

## Death Causes
The system tracks and displays the specific cause of death:
- Cardiac arrest (0 BPM)
- Severe bradycardia
- Bradycardia
- Ventricular fibrillation
- Extreme tachycardia
- Severe tachycardia
- Respiratory arrest (0 BrPM)
- Severe respiratory depression
- Respiratory depression
- Overdose: [Drug Name]

## Gameplay Impact

### Player Experience
- **More forgiving**: Players have 30 seconds to react when consciousness hits 0%
- **Visual feedback**: Consciousness bar shows health status in real-time
- **Strategic depth**: Players must monitor vitals and act before it's too late
- **Tension building**: Countdown timer creates urgency without instant failure

### Nanobot Strategy
- Players can experiment with extreme vitals knowing they have time to correct
- Creates interesting scenarios where character is "on the edge of death"
- Allows for dramatic rescues and close calls

### Achievement Potential
- "Near Death Experience" - Survive with consciousness below 10%
- "Edge of Death" - Stay at 0% consciousness for 25+ seconds then recover
- "Miracle Recovery" - Recover from 0% consciousness without nanobots

## Technical Details

### State Variables
```typescript
consciousnessLevel: number;  // 0-100%
deathCountdown: number;      // Seconds at 0% consciousness
isDying: boolean;            // True when consciousness is draining
```

### Update Logic
1. Calculate drain rate based on current vitals
2. If drain rate > 0:
   - Reduce consciousness by (drain rate × deltaTime)
   - Set isDying = true
   - If consciousness reaches 0%, increment deathCountdown
   - If deathCountdown >= 30, set isDead = true
3. If drain rate = 0:
   - Set isDying = false
   - Regenerate consciousness at 1%/sec (max 100%)
   - Reset deathCountdown to 0
   - Wake up if consciousness > 50%

### Pass Out / Wake Up Thresholds
- Pass out: consciousness < 20%
- Wake up: consciousness > 50%

## Balance Considerations

### Drain Rate Tuning
- **Fast drain (10%/sec)**: 10 seconds from full to death
- **Medium drain (5%/sec)**: 20 seconds from full to death
- **Slow drain (2%/sec)**: 50 seconds from full to death
- **Recovery (1%/sec)**: 100 seconds from 0% to full

### Death Window
- 30 seconds at 0% consciousness before death
- Gives players time to notice and react
- Can be adjusted for difficulty (shorter = harder, longer = easier)

### Recovery Speed
- 1%/sec recovery is slow enough to feel meaningful
- Fast enough that players can recover from near-death
- Creates tension between "how long can I stay in danger" vs "when do I back off"

## Future Enhancements

### Potential Features
1. **Visual effects**: Screen blur/redness as consciousness drops
2. **Audio cues**: Heartbeat sounds that slow down or speed up
3. **Warning system**: Alerts when approaching critical levels
4. **Auto-save**: Save state when consciousness drops below 50%
5. **Difficulty settings**: Adjust drain rates and death window
6. **Permanent damage**: Reduce max capacity if consciousness hits 0%

### Advanced Mechanics
1. **Organ damage**: Prolonged low consciousness causes permanent effects
2. **Brain death**: Extended time at 0% causes irreversible damage
3. **Coma state**: Extended unconsciousness with different wake-up mechanics
4. **Medical intervention**: Use money to buy emergency treatments

## Testing Checklist

- [x] Consciousness drains at correct rates for each vital range
- [x] Character passes out at 20% consciousness
- [x] Character wakes up at 50% consciousness
- [x] Death occurs after 30 seconds at 0% consciousness
- [x] Death countdown displays correctly in stats
- [x] Consciousness bar shows correct color transitions
- [x] Recovery works when vitals return to safe ranges
- [x] Death cause is tracked and displayed
- [x] Nanobot controls can save character from dying
- [x] Overdose contributes to consciousness drain
- [x] Multiple drain sources stack correctly

## Build Status
✅ **Build Successful** (1,075 KB / 295 KB gzipped)
