# iOS Icon Generator

> Generate iOS app icons

---

## Icon Sizes

| Size | Scale | Pixels | Usage |
|------|-------|--------|-------|
| 20pt | 1x | 20 | iPad Notifications |
| 20pt | 2x | 40 | iPhone Notifications |
| 20pt | 3x | 60 | iPhone Notifications |
| 29pt | 1x | 29 | iPad Settings |
| 29pt | 2x | 58 | iPhone Settings |
| 29pt | 3x | 87 | iPhone Settings |
| 40pt | 2x | 80 | iPhone Spotlight |
| 40pt | 3x | 120 | iPhone Spotlight |
| 60pt | 2x | 120 | iPhone App |
| 60pt | 3x | 180 | iPhone App |
| 76pt | 1x | 76 | iPad App |
| 76pt | 2x | 152 | iPad App |
| 83.5pt | 2x | 167 | iPad Pro |
| 1024pt | 1x | 1024 | App Store |

---

## Contents.json

```json
{
  "images": [
    {
      "filename": "icon-20@2x.png",
      "idiom": "iphone",
      "scale": "2x",
      "size": "20x20"
    },
    {
      "filename": "icon-20@3x.png",
      "idiom": "iphone",
      "scale": "3x",
      "size": "20x20"
    }
  ],
  "info": {
    "author": "mifosforge",
    "version": 1
  }
}
```

---

## Generation Code

```typescript
const IOS_SIZES = [
  { size: 20, scales: [2, 3], idiom: 'iphone' },
  { size: 29, scales: [2, 3], idiom: 'iphone' },
  { size: 40, scales: [2, 3], idiom: 'iphone' },
  { size: 60, scales: [2, 3], idiom: 'iphone' },
  { size: 20, scales: [1, 2], idiom: 'ipad' },
  { size: 29, scales: [1, 2], idiom: 'ipad' },
  { size: 40, scales: [1, 2], idiom: 'ipad' },
  { size: 76, scales: [1, 2], idiom: 'ipad' },
  { size: 83.5, scales: [2], idiom: 'ipad' },
  { size: 1024, scales: [1], idiom: 'ios-marketing' },
];
```
