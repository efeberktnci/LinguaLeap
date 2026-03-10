# Mac + Xcode Workflow (Free Personal Team)

This project is prepared for a hybrid setup:
- Windows: main coding + Codex
- MacBook: Xcode iOS install/run on iPhone

## 1) One-time Mac setup

1. Install Xcode and open it once.
2. Install dependencies:
   ```bash
   cd ~/path/to/LinguaLeap
   npm install
   ```
3. Generate iOS project:
   ```bash
   npm run ios:prebuild
   ```
4. Install to iPhone:
   ```bash
   npm run ios:run:device
   ```
5. In Xcode, set `Signing & Capabilities` to your Apple ID `Personal Team`.

## 2) Daily development

1. Code on Windows.
2. Push changes to git.
3. Pull on Mac.
4. Start Metro from Windows for dev-client:
   ```bash
   npm run ios:dev:tunnel
   ```
5. Open the installed dev build on iPhone and connect to the dev server.

## 3) When Mac rebuild is required

Rebuild/install from Mac only when:
- a native package changes
- `app.json` plugin/permission changes
- iOS entitlements/signing changes
- Personal Team 7-day signing expires

Command:
```bash
npm run ios:run:device
```

## 4) Notes for free Personal Team

- iOS install is for personal testing.
- Profiles/signing can expire in about 7 days; reinstall is normal.
- App Store/TestFlight is not required for this workflow.