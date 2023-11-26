---
"@tksst/next-app-additions": patch
---

fix an execution failure due to PNPM failing with ERR_PNPM_PUBLIC_HOIST_PATTERN_DIFF error  
This occurs if `node_modules` is not deleted after running create-next-app
