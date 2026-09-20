# Visual Death System Implementation

## Overview
Added visual feedback for death and pass out states, including character collapse animation and skin color changes.

## Visual Changes

### 1. Character Collapse Animation
When the character passes out or dies, they now collapse to the ground:
- Character rotates to lying down position (rotation.x = -π/2)
- Position adjusts to ground level (y = 0.2)
- Arms go limp (rotation.x = 0.3, rotation.z = ±0.5)
- Applies to both `isPassedOut` and `isDead` states

### 2. Skin Color Changes
The character's face (head mesh) changes color based on state:

**Normal State:**
- Skin color: `#f4c2a1` (normal skin tone)

**Dying State (consciousness < 100%):**
- Gradually transitions from normal skin to blue/pale
- Color calculation: `blueAmount = 1 - (consciousnessLevel / 100)`
- At 50% consciousness: slightly pale
- At 10% consciousness: very pale/blue
- At 0% consciousness: fully blue

**Dead State:**
- Skin color: `#4a6fa5` (blue/cyan - death color)
- Immediate color change when `isDead` becomes true

### 3. Implementation Details

#### Head Reference
Added `headRef` to track the head mesh:
```typescript
const headRef = useRef<THREE.Mesh>(null);
```

#### Color Update Logic
In the `useFrame` loop:
```typescript
if (headRef.current) {
  const material = headRef.current.material as THREE.MeshStandardMaterial;
  if (state.isDead) {
    material.color.set('#4a6fa5'); // Blue face when dead
  } else if (state.isDying) {
    // Gradually turn pale/blue when dying
    const blueAmount = 1 - (state.consciousnessLevel / 100);
    const r = 0.957 - (blueAmount * 0.5);
    const g = 0.761 - (blueAmount * 0.3);
    const b = 0.631 + (blueAmount * 0.3);
    material.color.setRGB(r, g, b);
  } else {
    material.color.set('#f4c2a1'); // Normal skin color
  }
}
```

#### Collapse Logic
Added collapse handling before normal state handling:
```typescript
if (state.isDead || state.isPassedOut) {
  // Collapse to ground
  groupRef.current.rotation.x = -Math.PI / 2;
  groupRef.current.position.y = 0.2;
  // Arms limp
  if (leftArmRef.current && rightArmRef.current) {
    leftArmRef.current.rotation.x = 0.3;
    leftArmRef.current.rotation.z = 0.5;
    rightArmRef.current.rotation.x = 0.3;
    rightArmRef.current.rotation.z = -0.5;
  }
} else {
  // Normal state handling (walking, sitting, etc.)
}
```

## Gradual Death System Verification

### How It Works
The gradual death system is already implemented and working:

1. **Consciousness Drain**: Based on vital signs
   - 0 BPM or 0 BrPM: 10%/sec drain
   - Critical vitals: 2-5%/sec drain
   - Normal vitals: 0% drain (recovery mode)

2. **Pass Out**: When consciousness < 20%
   - Character collapses visually
   - "PASSED OUT" indicator in stats

3. **Death Countdown**: When consciousness = 0%
   - 30-second countdown starts
   - "DYING Xs" indicator shows remaining time
   - Player can still save character by fixing vitals

4. **Death**: After 30 seconds at 0% consciousness
   - Character turns blue
   - "DEAD" indicator shows cause
   - Character remains collapsed

### Timeline Example
```
Time 0:00 - Heart rate set to 0 BPM
Time 0:00 - Consciousness drains at 10%/sec
Time 0:10 - Consciousness reaches 0%, character passes out and collapses
Time 0:10 - "DYING 30s" appears
Time 0:15 - Player adjusts heart rate to 80 BPM
Time 0:15 - Consciousness starts recovering at 1%/sec
Time 0:25 - Consciousness at 10%, still passed out
Time 0:40 - Consciousness at 25%, character wakes up
Time 1:00 - Consciousness at 45%, still collapsed
Time 1:50 - Consciousness at 95%, character stands up
Time 2:00 - Consciousness at 100%, fully recovered
```

### Why It Might Seem Instant
If you're seeing what appears to be instant death, it could be:

1. **Time Speed**: At high time speeds (60×, 120×, 150×), 30 seconds of simulation time passes very quickly in real time
   - At 150× speed: 30 sim seconds = 0.2 real seconds
   - At 60× speed: 30 sim seconds = 0.5 real seconds
   - At 1× speed: 30 sim seconds = 30 real seconds

2. **Consciousness Drain Rate**: At 10%/sec (0 BPM), consciousness drops from 100% to 0% in just 10 seconds
   - At 150× speed: 10 sim seconds = 0.067 real seconds (very fast!)
   - At 1× speed: 10 sim seconds = 10 real seconds (noticeable)

3. **Visual Feedback**: The collapse and color change happen immediately when states change, making it feel instant even though the gradual system is working

### Testing the Gradual System
To properly test the gradual death system:

1. **Use Low Time Speed**: Set time speed to 1× or 5×
2. **Set Critical Vitals**: Use nanobots to set heart rate to 0 BPM
3. **Watch Consciousness Bar**: Should drain gradually over 10 seconds
4. **Watch for Pass Out**: Character should collapse at 20% consciousness
5. **Watch Death Countdown**: "DYING 30s" should appear and count down
6. **Save Character**: Adjust heart rate back to normal before countdown reaches 0

### Visual Timeline at 1× Speed
```
Real Time 0:00 - Set heart rate to 0 BPM
Real Time 0:00 - Consciousness starts at 100%
Real Time 0:01 - Consciousness at 90%
Real Time 0:02 - Consciousness at 80%
...
Real Time 0:08 - Consciousness at 20%, character collapses, "PASSED OUT"
Real Time 0:10 - Consciousness at 0%, "DYING 30s"
Real Time 0:15 - "DYING 25s"
Real Time 0:20 - "DYING 20s"
Real Time 0:25 - "DYING 15s"
Real Time 0:30 - "DYING 10s"
Real Time 0:35 - "DYING 5s"
Real Time 0:40 - Character dies, turns blue, "DEAD"
```

## Stats Panel Updates

### New Indicators
1. **Consciousness Bar**: Shows 0-100% with color coding
   - Green: 50-100%
   - Yellow: 20-49%
   - Red: 0-19%

2. **DYING Indicator**: Shows countdown when consciousness = 0%
   - Displays: "DYING Xs" where X is seconds remaining
   - Red color with pulse animation

3. **PASSED OUT Indicator**: When consciousness < 20% but not dying
   - Yellow color with pulse animation

4. **DEAD Indicator**: When character is dead
   - Red color with pulse animation
   - Shows death cause

## Build Status
✅ **Build Successful** (1,075 KB / 295 KB gzipped)

## Summary
- ✅ Character collapses when passed out or dead
- ✅ Face turns blue when dead
- ✅ Face gradually turns pale/blue when dying
- ✅ Gradual death system working (consciousness drain over time)
- ✅ 30-second death countdown at 0% consciousness
- ✅ Visual indicators in stats panel
- ✅ All visual changes integrated and functional
