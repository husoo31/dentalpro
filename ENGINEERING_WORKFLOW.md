# DentalPro Engineering Workflow

```text
REQUEST
   ↓
TASK ANALYSIS
   ↓
ARCHITECTURE CHECK
   ↓
SELECT REQUIRED SKILLS
   ↓
IMPLEMENT
   ↓
TARGETED TESTS
   ↓
SECURITY CHECK
   ↓
CODE REVIEW
   ↓
BUILD
   ↓
FINAL VERIFICATION
   ↓
DONE
```

## Görev Ölçeklendirmesi (Token Efficiency)
- **Small task (CSS/text/minor UI):** architecture check -> relevant skill -> targeted test
- **Medium task (Component/form/CMS change):** architecture -> relevant skills -> testing -> build
- **Large task (New feature/module):** architecture -> frontend/backend/database/security -> testing -> code review -> build -> browser E2E