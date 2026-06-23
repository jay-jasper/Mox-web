# Mox Web

The website and documentation for **Mox** — a native macOS WYSIWYG Markdown editor.

This repository is managed as a git submodule of the main Mox repo, mounted at `website/`.

## Structure

```
.
├── docs/        # product & developer documentation
└── site/        # marketing / landing-page site sources
```

## Working on it

It's a normal git repo inside `website/`. Commit and push from there:

```sh
cd website
# …edit…
git add -A && git commit -m "docs: …"
git push
```

Then record the new submodule revision in the parent Mox repo:

```sh
cd ..
git add website && git commit -m "chore: bump website submodule"
```
