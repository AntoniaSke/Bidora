import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import favouriteRoutes from "./routes/favouriteRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import {
  processEndedAuctions,
} from "./services/auctionNotificationService.js";
import { setSocketServer } from "./lib/socket.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = Number(process.env.PORT) || 4000;

/*
  Δημιουργούμε HTTP server
  πάνω από το Express app.
*/
const server = http.createServer(app);

/*
  Socket.io server.
*/
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

/*
  Αποθηκεύουμε το socket instance
  ώστε να μπορεί να χρησιμοποιηθεί
  από controllers.
*/
setSocketServer(io);

/*
  Socket events.
*/
io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  socket.on(
    "join-auction",
    (auctionId: number) => {
      socket.join(
        `auction-${auctionId}`
      );

      console.log(
        `Socket ${socket.id} joined auction-${auctionId}`
      );
    }
  );

  socket.on(
    "leave-auction",
    (auctionId: number) => {
      socket.leave(
        `auction-${auctionId}`
      );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );
  });
});

/*
  Health endpoint.
*/
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Bidora API is running",
  });
});

/*
  Routes.
*/
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/auctions",
  auctionRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/favourites",
  favouriteRoutes
);

app.use(
  "/api/bids",
  bidRoutes
);

app.use(
  "/api/uploads",
  uploadRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

server.listen(PORT, () => {
  console.log(
    `Bidora API running on http://localhost:${PORT}`
  );

  /*
    Run once immediately.
  */
  processEndedAuctions();

  /*
    Then every 60 seconds.
  */
  setInterval(() => {
    processEndedAuctions();
  }, 60_000);
});