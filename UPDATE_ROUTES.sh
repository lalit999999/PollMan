#!/bin/bash
# This script shows what needs to be updated in server/src/routes/index.js

cat > /tmp/index-routes.js << 'EOF'
# === PASTE THIS INTO: server/src/routes/index.js ===

import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import pollRoutes from "./poll.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/polls", pollRoutes);
router.use("/", healthRoutes);

export default router;

# === END ===
EOF

echo "✅ Copy content from /tmp/index-routes.js into server/src/routes/index.js"
echo ""
echo "File location: server/src/routes/index.js"
echo ""
echo "Changes to make:"
echo "1. Add: import pollRoutes from \"./poll.routes.js\";"
echo "2. Add: router.use(\"/polls\", pollRoutes);"
