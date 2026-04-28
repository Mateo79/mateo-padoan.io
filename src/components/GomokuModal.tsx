import { useState, useEffect, useRef } from 'react';
import { createGomokuAI } from '../utils/gomoku/logic';
import { io, Socket } from 'socket.io-client';
import { FaTimes, FaCircle, FaTrophy, FaRedo, FaUsers, FaUser } from '../components/icons/ReactIcons';

interface GomokuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GomokuModal = ({ isOpen, onClose }: GomokuModalProps) => {
  const size = 20;
  const [board, setBoard] = useState<(null | 'black' | 'white')[][]>(
    Array(size).fill(null).map(() => Array(size).fill(null))
  );
  const [winner, setWinner] = useState<null | 'human' | 'ai' | 'player1' | 'player2'>(null);
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');

  // Mode de jeu
  const [gameMode, setGameMode] = useState<'solo' | 'multi'>('solo');
  const [playerColor, setPlayerColor] = useState<'black' | 'white' | null>(null);
  const [statusMessage, setStatusMessage] = useState('Cliquez sur "Multijoueur" pour commencer');
  const socketRef = useRef<Socket | null>(null);

  // IA 
  const ai = createGomokuAI(size);

  // Points Hoshi (étoiles, sur le goban)
  const hoshiPoints = [
    [4, 4], [4, 10], [4, 15],
    [10, 4], [10, 10], [10, 15],
    [15, 4], [15, 10], [15, 15]
  ];

  // Réinitialiser le jeu
  const resetGame = () => {
    setBoard(Array(size).fill(null).map(() => Array(size).fill(null)));
    setWinner(null);
    setGameOver(false);
    setCurrentPlayer('black');
    setPlayerColor(null);
    setStatusMessage('Cliquez sur "Multijoueur" pour commencer');
    if (gameMode === 'multi' && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setGameMode('solo');
  };

  // Initialisation du mode multijoueur
  useEffect(() => {
    if (gameMode === 'multi') {
      const socket = io('http://localhost:3001', {
        reconnectionAttempts: 3,
        timeout: 5000,
      });
      socketRef.current = socket;

      socket.on('waiting-for-opponent', () => {
        setStatusMessage("En attente d'un adversaire...");
      });

      socket.on('game-started', ({ player }: { player: 'black' | 'white' }) => {
        setPlayerColor(player);
        setStatusMessage(`Partie commencée ! Vous jouez en ${player === 'black' ? 'noir' : 'blanc'}.`);
        setCurrentPlayer(player);
      });

      socket.on('opponent-move', ({ row, col, player }: { row: number; col: number; player: 'black' | 'white' }) => {
        const newBoard = [...board];
        newBoard[row] = [...board[row]];
        newBoard[row][col] = player;
        setBoard(newBoard);
        setCurrentPlayer(player === 'black' ? 'white' : 'black');
      });

      socket.on('connect_error', () => {
        setStatusMessage('Erreur de connexion au serveur.');
      });

      socket.emit('join-game', 'main-room');

      return () => {
        socket.disconnect();
      };
    }
  }, [gameMode]);

  // Réinitialiser à l'ouverture
  useEffect(() => {
    if (isOpen) {
      resetGame();
    }
  }, [isOpen]);

  const handleIntersectionClick = (row: number, col: number) => {
    if (gameOver || board[row][col]) return;

    if (gameMode === 'solo') {
      const newBoard = [...board];
      newBoard[row] = [...board[row]];
      newBoard[row][col] = 'black';
      setBoard(newBoard);

      const numericBoard = newBoard.map(r =>
        r.map(cell => (cell === 'black' ? -1 : cell === 'white' ? 1 : 0))
      );
      ai.setState(numericBoard);

      if (ai.checkWin()) {
        setWinner('human');
        setGameOver(true);
        return;
      }

      const aiMove = ai.makeMove(row, col);
      if (!aiMove) return;

      const [aiRow, aiCol] = aiMove;
      const finalBoard = [...newBoard];
      finalBoard[aiRow] = [...newBoard[aiRow]];
      finalBoard[aiRow][aiCol] = 'white';
      setBoard(finalBoard);

      const finalNumericBoard = finalBoard.map(r =>
        r.map(cell => (cell === 'black' ? -1 : cell === 'white' ? 1 : 0))
      );
      ai.setState(finalNumericBoard);

      if (ai.checkWin()) {
        setWinner('ai');
        setGameOver(true);
      }
    } else if (gameMode === 'multi' && playerColor) {
      if (currentPlayer !== playerColor) return;

      socketRef.current?.emit('make-move', {
        gameId: 'main-room',
        row,
        col,
        player: playerColor,
      });

      const newBoard = [...board];
      newBoard[row] = [...board[row]];
      newBoard[row][col] = playerColor;
      setBoard(newBoard);
      setCurrentPlayer(playerColor === 'black' ? 'white' : 'black');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl h-[90vh] bg-gray-900 border border-amber-700 rounded-lg overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 px-4 py-2 flex justify-between items-center border-b-2 border-amber-950">
          <h3 className="text-amber-100 font-mono text-lg font-bold">Gomoku — Aincrad</h3>
          <div className="flex gap-2">
            <button
              onClick={resetGame}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded border border-amber-800 transition-colors flex items-center gap-1"
            >
              <FaRedo className="w-3 h-3" />
              Nouvelle partie
            </button>
            <button
              onClick={() => setGameMode(gameMode === 'solo' ? 'multi' : 'solo')}
              className="text-xs bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded border border-blue-900 transition-colors flex items-center gap-1"
            >
              {gameMode === 'solo' ? (
                <>
                  <FaUsers className="w-3 h-3" />
                  Multijoueur
                </>
              ) : (
                <>
                  <FaUser className="w-3 h-3" />
                  Solo
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-amber-200 hover:text-white text-xl transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 overflow-auto flex justify-center items-center relative bg-gray-950">
          {/* Messages */}
          <div className="absolute top-4 left-0 right-0 text-center z-10">
            {gameMode === 'multi' && (
              <div className="text-sm text-cyan-400 mb-1 font-mono">{statusMessage}</div>
            )}
            {winner ? (
              <div className="text-xl font-bold flex items-center justify-center gap-2">
                <FaTrophy className="w-6 h-6 text-yellow-400" />
                {winner === 'ai' ? (
                  <span className="text-red-400">L'IA gagne !</span>
                ) : winner === 'human' ? (
                  <span className="text-green-400">Vous gagnez !</span>
                ) : (
                  <span className="text-yellow-400">Victoire !</span>
                )}
              </div>
            ) : (
              <div className="text-lg text-green-400 font-mono flex items-center justify-center gap-2">
                {gameMode === 'solo' ? (
                  <>
                    <FaCircle className="w-4 h-4 text-black fill-current" />
                    Votre tour (Noir)
                  </>
                ) : playerColor ? (
                  <>
                    {playerColor === 'black' ? (
                      <FaCircle className="w-4 h-4 text-black fill-current" />
                    ) : (
                      <FaCircle className="w-4 h-4 text-white fill-current stroke-current" style={{ stroke: '#000' }} />
                    )}
                    Votre tour ({playerColor === 'black' ? 'Noir' : 'Blanc'})
                  </>
                ) : (
                  'Connexion...'
                )}
              </div>
            )}
          </div>

          {/* Style Goban traditionnel */}
          <div className="relative p-4 bg-amber-950 rounded-lg shadow-inner">
            <svg
              width="600"
              height="600"
              viewBox={`0 0 ${size - 1} ${size - 1}`}
              className="rounded shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #E3C083 0%, #D4AF74 50%, #C9A961 100%)',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
              }}
            >
              {/* Définition des motifs pour texture bois */}
              <defs>
                <filter id="woodTexture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.03 0" in="noise" result="coloredNoise" />
                  <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                  <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
                </filter>
              </defs>

              {/* Fond avec texture bois subtile */}
              <rect x="0" y="0" width={size - 1} height={size - 1} fill="url(#woodGradient)" opacity="0.1" />

              {/* Lignes de la grille - noires */}
              {Array.from({ length: size }).map((_, i) => (
                <line 
                  key={`h-${i}`} 
                  x1="0" 
                  y1={i} 
                  x2={size - 1} 
                  y2={i} 
                  stroke="#1a1a1a" 
                  strokeWidth="0.025"
                />
              ))}
              {Array.from({ length: size }).map((_, i) => (
                <line 
                  key={`v-${i}`} 
                  x1={i} 
                  y1="0" 
                  x2={i} 
                  y2={size - 1} 
                  stroke="#1a1a1a" 
                  strokeWidth="0.025"
                />
              ))}

              {/* Points Hoshi */}
              {hoshiPoints.map(([row, col], index) => (
                <circle
                  key={`hoshi-${index}`}
                  cx={col}
                  cy={row}
                  r="0.08"
                  fill="#1a1a1a"
                />
              ))}

              {/* Pions */}
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  if (!cell) return null;
                  return (
                    <g key={`${rowIndex}-${colIndex}`}>
                      {/* Ombre du pion */}
                      <circle
                        cx={colIndex + 0.03}
                        cy={rowIndex + 0.03}
                        r="0.35"
                        fill="rgba(0,0,0,0.3)"
                      />
                      {/* Pion lui-même */}
                      <circle
                        cx={colIndex}
                        cy={rowIndex}
                        r="0.35"
                        fill={cell === 'black' ? '#0a0a0a' : '#f5f5f5'}
                        stroke={cell === 'white' ? '#1a1a1a' : 'none'}
                        strokeWidth="0.02"
                      />
                      {/* Reflet pour les pions blancs */}
                      {cell === 'white' && (
                        <circle
                          cx={colIndex - 0.1}
                          cy={rowIndex - 0.1}
                          r="0.08"
                          fill="rgba(255,255,255,0.8)"
                        />
                      )}
                    </g>
                  );
                })
              )}

              {/* Zones cliquables */}
              {board.map((_, rowIndex) =>
                board[0].map((__, colIndex) => (
                  <rect
                    key={`click-${rowIndex}-${colIndex}`}
                    x={colIndex - 0.5}
                    y={rowIndex - 0.5}
                    width="1"
                    height="1"
                    fill="transparent"
                    onClick={() => handleIntersectionClick(rowIndex, colIndex)}
                    style={{ cursor: 'pointer' }}
                  />
                ))
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GomokuModal;
