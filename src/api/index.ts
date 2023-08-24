import express from "express";

import statsRoutes from "./routes/stats.routes.js"

const app = express()

// Specify the routes
app.use("/api", statsRoutes)

export default app