# Sidebar Toggle Feature

## Overview

The FD4D app now includes a toggle feature to hide and show the sidebar, giving users more workspace when needed.

## Features

### 🎯 Toggle Button
- **Location**: Fixed position button near the sidebar edge
- **Appearance**: Purple border with primary color styling
- **Icon**: Shows `◀` when sidebar is visible, `▶` when hidden
- **Animation**: Smooth transitions with hover effects

### ⌨️ Keyboard Shortcut
- **Shortcut**: `Ctrl + B` (Windows/Linux) or `Cmd + B` (macOS)
- **Action**: Toggle sidebar visibility
- Works from anywhere in the app

### 🎨 Visual Effects

#### Button Hover Effects
- Background changes to primary color
- Text color changes to white
- Scale animation (grows slightly)
- Glowing shadow effect

#### Sidebar Animation
- Smooth slide in/out transition (250ms)
- Button follows the sidebar position
- No layout shift - content remains stable

### 💡 User Experience

#### When Sidebar is Visible
- Button positioned at `264px` from left (just after sidebar)
- Shows `◀` icon indicating "collapse"
- Tooltip: "Hide sidebar (Ctrl/Cmd + B)"

#### When Sidebar is Hidden
- Button positioned at `16px` from left (edge of screen)
- Shows `▶` icon indicating "expand"
- Tooltip: "Show sidebar (Ctrl/Cmd + B)"

## Implementation Details

### State Management
```typescript
const [sidebarVisible, setSidebarVisible] = useState(true)
```

### Keyboard Event Handler
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      toggleSidebar()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [sidebarVisible])
```

### Animation
```typescript
const sidebarContainerStyle: React.CSSProperties = {
  transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
  transition: `transform ${theme.transitions.normal}`,
  position: 'relative',
  zIndex: theme.zIndex.fixed,
}
```

## Benefits

### For Users
- **More Workspace**: Hide sidebar when working with large content
- **Quick Access**: Easy toggle with mouse or keyboard
- **Visual Clarity**: Clear indicators of sidebar state
- **Smooth Experience**: Professional animations

### For Developers
- **Simple Implementation**: Uses React hooks and CSS transforms
- **Performant**: GPU-accelerated transforms
- **Accessible**: ARIA labels and keyboard support
- **Maintainable**: Clean, readable code

## Usage

### With Mouse
1. Click the toggle button (near the sidebar)
2. The sidebar will slide in or out smoothly

### With Keyboard
1. Press `Ctrl + B` (or `Cmd + B` on Mac)
2. The sidebar will toggle instantly

## Technical Notes

### CSS Properties Used
- `transform: translateX()` - For smooth sliding animation
- `transition` - For smooth state changes
- `position: fixed` - For button positioning
- `z-index` - For proper layering

### Accessibility
- **ARIA Label**: Button has descriptive `aria-label`
- **Title Attribute**: Shows keyboard shortcut in tooltip
- **Keyboard Support**: Full keyboard navigation
- **Visual Feedback**: Clear hover and active states

### Performance
- **GPU Acceleration**: Uses `transform` instead of `left/right`
- **Single Repaint**: Minimal layout recalculation
- **Event Cleanup**: Proper event listener removal

## Future Enhancements

Possible improvements:
- Remember sidebar state in localStorage
- Add animation speed setting
- Mobile-responsive sidebar overlay
- Swipe gestures for touch devices
- Different collapse modes (minimize vs hide)

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Electron (all versions used)

## Testing

To test the feature:
1. Run the app: `npm run electron:dev`
2. Click the toggle button
3. Try the keyboard shortcut `Ctrl/Cmd + B`
4. Verify smooth animations
5. Check tooltip messages
6. Test hover effects

---

**Note**: This feature enhances the user experience by providing flexibility in workspace layout while maintaining the app's polished, professional appearance.
