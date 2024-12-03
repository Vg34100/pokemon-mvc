# Git Workflow Guide

## Overview
This guide explains our branch structure and how to make changes to the project.

```
Branch Structure:
master (main production branch)
└── development (integration branch)
    └── feature branches (for new work)
```

## Basic Rules
- Never commit directly to `master`
- New features go to `development` first
- Each feature gets its own branch
- Branch names should be descriptive
- Always pull before creating new branches

## Step-by-Step Workflows

### Starting New Work

1. **Update Development Branch**
```
1. Switch to development branch
   - Click branch icon (bottom left in VS Code)
   - Select "development"
2. Get latest changes
   - In Source Control: "..." → "Pull"
```

2. **Create Feature Branch**
```
1. From development branch
2. Click branch icon
3. "Create new branch"
4. Name format: "feature/what-youre-doing"
   Examples:
   - feature/loading-state
   - feature/search-bar
   - feature/error-handling
```

3. **Publish New Branch**
```
1. VS Code will show "Publish Branch"
2. Click it to make branch available on GitHub
```

### Making Changes

1. **Work on Your Branch**
```
1. Make your changes
2. Test everything works
3. Check you're on right branch
```

2. **Commit Changes**
```
1. Open Source Control
2. Stage changes (+)
3. Write clear commit message
   Examples:
   - "feat: add loading state component"
   - "fix: image loading error"
   - "style: improve button alignment"
4. Click checkmark to commit
```

3. **Push Changes**
```
1. Source Control: "..." → "Push"
2. First push might need "Publish Branch"
```

### Creating Pull Requests

1. **Feature → Development**
```
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set:
   Base: development ← Compare: your-feature-branch
4. Add clear description
5. Request review
6. Create pull request
```

2. **Development → Master**
```
1. Only after testing in development
2. Create PR on GitHub
3. Set:
   Base: master ← Compare: development
4. Requires thorough review
```

## Common Situations

### Handling Uncommitted Changes
```
Options:
1. Stash them:
   - "..." → "Stash" → "Stash all changes"
   - Switch branches
   - Get back: "Stash" → "Pop"

2. Create .gitignore:
   docs/*.md
   *.log
   node_modules/
```

### Updating Your Branch
```
1. Switch to development
2. Pull latest changes
3. Switch to your branch
4. "..." → "Merge Branch" → "development"
```

### Review Checklist
- Code works locally
- Tests pass (if any)
- No conflicts
- Follows project standards
- Clear commit messages
- Branch named correctly

## Tips for Good Commits

1. **Keep Commits Small**
```
Good:
- One new component
- One bug fix
- One feature
```

2. **Write Clear Messages**
```
Format: 
- Present tense
- Descriptive but concise

Good:
✓ "Add Pokemon search component"
✓ "Fix image loading in grid"

Bad:
✗ "Updates"
✗ "Fixed stuff"
```

3. **Regular Commits**
```
- Commit working code
- Don't wait too long
- Each commit should work
```

## VS Code Quick Reference

Common Actions:
```
Bottom Left:
- Current branch name
- Click to switch/create branches

Source Control Panel (Ctrl/Cmd + Shift + G):
- Stage changes (+)
- Commit (✓)
- Push/Pull ("...")
- Stash ("...")
```
