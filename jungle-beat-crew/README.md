# Monke Mix Studio — original gorilla remix game for iPhone

A touch-friendly, Sprunki-style **music-mixing app**, starring colourful low-poly-inspired gorillas rather than humans or the original Sprunki characters. This is a music game, **not** a VR tag/chase game.

## Features
- Ten unique, faceted, long-armed gorillas with different sounds and accessories
- Six-stage character slots on a bright forest backdrop
- Tap any sound on the two-row selection palette to assign/remove it
- 112-BPM synchronized audio loops (ten original generated WAV tracks)
- Play/pause, shuffle, clear, mute, solo, presets, and locally saved named mixes
- Compatible saved-mix format with the earlier Jungle Beat Crew prototype

## Running the app
```sh
cd jungle-beat-crew
npm install
npx expo start
```
The scripts generate local audio and artwork during npm install. Check SDK package version compatibility with Expo tooling. To attempt an iOS test build after configuring EAS and Apple signing:
```sh
npx eas-cli build --platform ios --profile preview
```

## Important
This is an **original, inspired-by** project, not Gorilla Tag, Sprunki, or Incredibox, and has no affiliation with their rights holders. It does not bundle any third-party audio, art, models, trademarks, or official characters. Do not market it as official.

Status: source prototype; JSX syntax checked locally, **not** yet built and tested on a real iPhone, submitted to TestFlight, or published to the App Store. Verify device performance, sound sync, Expo SDK dependencies, privacy information and App Store compliance before release.
