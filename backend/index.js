const connectToMongo = require("./database/db");
const express = require("express");
const app = require("./app");
const path = require("path");
const autoSeed = require("./auto-seeder");

connectToMongo().then(() => {
  autoSeed();
});

const port = process.env.PORT || 4000;

// Static media folder
app.use("/media", express.static(path.join(__dirname, "media")));

// Auth Routes (New Unified)
app.use("/api/auth", require("./routes/auth.route"));

// User-specific routes (for backward compatibility, but will use new auth)
app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

// Resource Routes
app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));
app.use("/api/attendance", require("./routes/attendance.route"));

app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
