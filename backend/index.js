import app from "./app.js";
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true, // allow cookies
  })
);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
