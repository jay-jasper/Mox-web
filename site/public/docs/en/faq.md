# FAQ

## It says "Mox is damaged and can't be opened" — what do I do?

This build isn't code-signed or notarized yet, so macOS Gatekeeper blocks it with a "damaged" / "can't be opened" warning. The file isn't actually damaged — it's just unsigned. Open it one of these ways:

**Option 1: right-click to open**

1. In Applications, **right-click (or Control-click) Mox** and choose "Open".
2. Click "Open" again in the dialog. After that, double-clicking works normally.

**Option 2: allow it in System Settings**

If it's blocked, go to System Settings › Privacy & Security, find the blocked Mox near the bottom, and click "Open Anyway".

**Option 3: remove the quarantine attribute in Terminal**

```sh
xattr -dr com.apple.quarantine /Applications/Mox.app
```

> Once a signed build ships, this step won't be needed.

## Which systems are supported?

macOS 13 (Ventura) or later.

## Where are my files stored?

Mox reads and writes your local `.md` files directly — nothing is uploaded. Your workspace is just a regular folder you open.

## The app stays running after I close the window?

Yes. Mox stays resident in the menu bar so Quick Notes are always available. Use "Quit Mox" from the menu bar to fully exit.

## Is there AI support?

Yes — connect an OpenAI-compatible endpoint for inline completion and an AI panel.
