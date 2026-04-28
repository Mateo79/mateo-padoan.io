const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Stockage des parties
const games = {};

io.on('connection', (socket) => {
  console.log('Nouveau joueur connecté:', socket.id);

  // Rejoindre une partie
  socket.on('join-game', (gameId) => {
    if (!games[gameId]) {
      games[gameId] = { players: [], board: null };
    }

    const game = games[gameId];
    if (game.players.length >= 2) {
      socket.emit('game-full');
      return;
    }

    const color = game.players.length === 0 ? 'black' : 'white';
    game.players.push({ id: socket.id, color });

    socket.join(gameId);
    socket.data = { gameId, color };

    console.log(`Joueur ${socket.id} (${color}) rejoint la partie ${gameId}`);

    if (game.players.length === 1) {
      socket.emit('waiting-for-opponent');
    } else {
      // Informer les deux joueurs
      const player1 = game.players[0];
      const player2 = game.players[1];
      io.to(player1.id).emit('game-started', { player: player1.color });
      io.to(player2.id).emit('game-started', { player: player2.color });
    }
  });

  // Coup joué
  socket.on('make-move', ({ gameId, row, col }) => {
    const game = games[gameId];
    if (!game || !socket.data?.color) return;

    const color = socket.data.color;

    socket.to(gameId).emit('opponent-move', { row, col, player: color });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Joueur déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur Socket.IO démarré sur le port ${PORT}`);
});