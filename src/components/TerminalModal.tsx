import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

type FileSystemItem = {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileSystemItem[];
};

const createFileSystem = (): FileSystemItem => ({
  name: 'root',
  type: 'directory',
  children: [
    { 
      name: 'home', 
      type: 'directory', 
      children: [
        { 
          name: 'heath', 
          type: 'directory', 
          children: [
            { name: 'Documents', type: 'directory', children: [] },
            { name: 'Downloads', type: 'directory', children: [] },
            { 
              name: 'portfolio', 
              type: 'directory', 
              children: [
                { name: 'README.md', type: 'file', content: '# Mon Portfolio\nBienvenue dans mon portfolio Aincrad !' },
                { name: 'src', type: 'directory', children: [] },
              ] 
            },
            { name: 'notes.txt', type: 'file', content: 'Ceci est un fichier texte.' },
          ] 
        }
      ] 
    },
  ],
});

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TerminalModal = ({ isOpen, onClose }: TerminalModalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  
  const [fileSystem, setFileSystem] = useState<FileSystemItem>(createFileSystem());
  const [cwd, setCwd] = useState<string>('/home/heath');
  
  // États pour nano
  const [isNanoMode, setIsNanoMode] = useState(false);
  const nanoModeRef = useRef(false); // Ref pour éviter les closures périmées dans xterm
  const [nanoFilePath, setNanoFilePath] = useState<string>('');
  const [nanoBuffer, setNanoBuffer] = useState<string>('');
  const nanoPendingAction = useRef<string | null>(null); // Gère l'attente de validation (Ctrl+S/C+C/C+X)

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const currentLineRef = useRef<string>('');

  // Sync ref avec state
  useEffect(() => { nanoModeRef.current = isNanoMode; }, [isNanoMode]);

  const normalizePath = (path: string): string => {
    const parts = path.split('/').filter(p => p && p !== '.');
    const result: string[] = [];
    for (const part of parts) {
      if (part === '..') result.pop();
      else result.push(part);
    }
    return '/' + result.join('/');
  };

  const findItem = (path: string, fs: FileSystemItem): FileSystemItem | null => {
    const normalized = normalizePath(path);
    if (normalized === '/') return fs;
    const parts = normalized.split('/').filter(p => p !== '');
    let current: FileSystemItem | null = fs;
    for (const part of parts) {
      if (current?.type === 'directory' && current.children) {
        current = current.children.find(item => item.name === part) || null;
        if (!current) return null;
      } else return null;
    }
    return current;
  };

  const getAbsolutePath = (inputPath: string, currentCwd: string): string => {
    if (inputPath.startsWith('/')) return inputPath;
    return normalizePath(`${currentCwd}/${inputPath}`);
  };

  const saveNanoFile = () => {
    const fileName = nanoFilePath.split('/').pop() || '';
    const parentPath = nanoFilePath.substring(0, nanoFilePath.lastIndexOf('/'));
    const parent = findItem(parentPath, fileSystem);
    if (parent && parent.type === 'directory' && parent.children) {
      const fileIdx = parent.children.findIndex(f => f.name === fileName);
      if (fileIdx !== -1) {
        parent.children[fileIdx].content = nanoBuffer;
        setFileSystem({ ...fileSystem });
        return true;
      }
    }
    return false;
  };

  const exitNano = (saved: boolean, cancelled: boolean) => {
    setIsNanoMode(false);
    nanoPendingAction.current = null;
    setNanoFilePath('');
    setNanoBuffer('');
    
    termRef.current?.clear();
    if (cancelled) termRef.current?.writeln('\x1b[31m[ Édition annulée ]\x1b[0m');
    else if (saved) termRef.current?.writeln('\x1b[32m[ Fichier sauvegardé ]\x1b[0m');
    
    termRef.current?.write(`\r\n\x1b[36m${cwd}\x1b[0m$ `);
    currentLineRef.current = '';
  };

  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: '#1e1e1e', 
        foreground: '#ffffff', 
        cursor: '#00d8ff', 
        cursorAccent: '#1e1e1e',
        black: '#000000', 
        red: '#ff5c57', 
        green: '#5af78e', 
        yellow: '#f3f99d', 
        blue: '#57c7ff',
        magenta: '#ff6ac1', 
        cyan: '#9aedfe', 
        white: '#f1f1f0', 
        brightBlack: '#686868',
        brightRed: '#ff5c57', 
        brightGreen: '#5af78e', 
        brightYellow: '#f3f99d', 
        brightBlue: '#57c7ff',
        brightMagenta: '#ff6ac1', 
        brightCyan: '#9aedfe', 
        brightWhite: '#f1f1f0',
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace', 
      fontSize: 13, 
      lineHeight: 1.3,
      cursorBlink: true, 
      cursorStyle: 'block', 
      scrollback: 10000, 
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    setTimeout(() => fitAddon.fit(), 0);
    
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    const writePrompt = (currentCwd: string) => {
      term.write(`\r\n\x1b[36m${currentCwd}\x1b[0m$ `);
    };

    const commands: Record<string, (args: string[], currentCwd: string) => void> = {
      help: () => {
        term.writeln('\x1b[33mCommandes disponibles:\x1b[0m');
        term.writeln('  \x1b[32mhelp\x1b[0m    - Affiche cette aide');
        term.writeln('  \x1b[32mclear\x1b[0m   - Efface l\'écran');
        term.writeln('  \x1b[32mls\x1b[0m      - Liste les fichiers');
        term.writeln('  \x1b[32mpwd\x1b[0m     - Affiche le répertoire courant');
        term.writeln('  \x1b[32mcd\x1b[0m      - Change de répertoire');
        term.writeln('  \x1b[32mmkdir\x1b[0m   - Crée un dossier');
        term.writeln('  \x1b[32mtouch\x1b[0m   - Crée un fichier vide');
        term.writeln('  \x1b[32mnano\x1b[0m    - Édite un fichier');
        term.writeln('  \x1b[32mcat\x1b[0m     - Affiche le contenu d\'un fichier');
        term.writeln('  \x1b[32mdate\x1b[0m    - Affiche la date');
        term.writeln('  \x1b[32mwhoami\x1b[0m  - Affiche l\'utilisateur');
        term.writeln('  \x1b[32mecho\x1b[0m    - Affiche un message');
        term.writeln('  \x1b[32mexit\x1b[0m    - Ferme le terminal');
        writePrompt(cwd);
      },
      clear: () => { term.clear(); writePrompt(cwd); },
      pwd: () => { term.writeln(cwd); writePrompt(cwd); },
      ls: (args, currentCwd) => {
        const targetPath = args.length > 0 ? getAbsolutePath(args[0], currentCwd) : currentCwd;
        const item = findItem(targetPath, fileSystem);
        if (!item || item.type !== 'directory') {
          term.writeln(`\x1b[31mls: accès refusé ou chemin invalide\x1b[0m`);
        } else {
          const names = (item.children || []).map(i => i.type === 'directory' ? `\x1b[34m${i.name}/\x1b[0m` : `\x1b[32m${i.name}\x1b[0m`);
          term.writeln(names.join('  ') || '\x1b[90m(dossier vide)\x1b[0m');
        }
        writePrompt(cwd);
      },
      cd: (args, currentCwd) => {
        if (args.length === 0 || args[0] === '~') { setCwd('/home/heath'); writePrompt('/home/heath'); return; }
        const newPath = getAbsolutePath(args[0], currentCwd);
        const item = findItem(newPath, fileSystem);
        if (item && item.type === 'directory') { setCwd(newPath); writePrompt(newPath); }
        else { term.writeln(`\x1b[31mcd: ${args[0]}: Aucun fichier ou dossier de ce type\x1b[0m`); writePrompt(currentCwd); }
      },
      mkdir: (args, currentCwd) => {
        if (args.length === 0) { term.writeln('\x1b[31mmkdir: argument manquant\x1b[0m'); writePrompt(currentCwd); return; }
        const parent = findItem(getAbsolutePath('.', currentCwd), fileSystem);
        if (parent && parent.type === 'directory') {
          if (!parent.children) parent.children = [];
          if (parent.children.some(i => i.name === args[0])) term.writeln(`\x1b[31mmkdir: «${args[0]}» existe déjà\x1b[0m`);
          else { parent.children.push({ name: args[0], type: 'directory', children: [] }); setFileSystem({ ...fileSystem }); }
        }
        writePrompt(cwd);
      },
      touch: (args, currentCwd) => {
        if (args.length === 0) { term.writeln('\x1b[31mtouch: argument manquant\x1b[0m'); writePrompt(currentCwd); return; }
        const parent = findItem(getAbsolutePath('.', currentCwd), fileSystem);
        if (parent && parent.type === 'directory') {
          if (!parent.children) parent.children = [];
          if (!parent.children.some(i => i.name === args[0])) { parent.children.push({ name: args[0], type: 'file', content: '' }); setFileSystem({ ...fileSystem }); }
        }
        writePrompt(cwd);
      },
      nano: (args, currentCwd) => {
        if (args.length === 0) {
          term.writeln('\x1b[31mnano: nom de fichier requis\x1b[0m');
          writePrompt(currentCwd);
          return;
        }
        const filePath = getAbsolutePath(args[0], currentCwd);
        let file = findItem(filePath, fileSystem);
        
        if (!file) {
          const fileName = filePath.split('/').pop() || '';
          const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
          const parent = findItem(parentPath, fileSystem);
          if (parent && parent.type === 'directory') {
            if (!parent.children) parent.children = [];
            parent.children.push({ name: fileName, type: 'file', content: '' });
            setFileSystem({ ...fileSystem });
            file = parent.children[parent.children.length - 1];
          } else {
            term.writeln(`\x1b[31mnano: impossible d'accéder à «${filePath}»\x1b[0m`);
            writePrompt(currentCwd);
            return;
          }
        } else if (file.type === 'directory') {
          term.writeln(`\x1b[31mnano: «${args[0]}» est un dossier\x1b[0m`);
          writePrompt(currentCwd);
          return;
        }

        setIsNanoMode(true);
        setNanoFilePath(filePath);
        setNanoBuffer(file.content || '');
        
        term.clear();
        term.writeln(`\x1b[32m📝 nano — ${filePath}\x1b[0m`);
        term.writeln('\x1b[90m─────────────────────────────────────────\x1b[0m');
        if (file.content) term.write(file.content);
        term.writeln('\x1b[90m─────────────────────────────────────────\x1b[0m');
        term.writeln('\x1b[36mCtrl+S+Enter: Sauvegarder\x1b[0m  \x1b[33mCtrl+C+Enter: Sauvegarder & Quitter\x1b[0m  \x1b[31mCtrl+X+Enter: Quitter sans sauver\x1b[0m');
        term.write('\r\n> ');
      },
      cat: (args, currentCwd) => {
        if (args.length === 0) { term.writeln('\x1b[31mcat: argument manquant\x1b[0m'); writePrompt(currentCwd); return; }
        const file = findItem(getAbsolutePath(args[0], currentCwd), fileSystem);
        if (file && file.type === 'file') { if (file.content) file.content.split('\n').forEach(l => term.writeln(l)); }
        else { term.writeln(`\x1b[31mcat: ${args[0]}: Fichier introuvable\x1b[0m`); }
        writePrompt(cwd);
      },
      date: () => { term.writeln(new Date().toString()); writePrompt(cwd); },
      whoami: () => { term.writeln('heath'); writePrompt(cwd); },
      echo: (args) => { term.writeln(args.join(' ')); writePrompt(cwd); },
      exit: () => { onClose(); },
    };

    const executeCommand = (line: string, currentCwd: string) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) { writePrompt(currentCwd); return; }
      historyRef.current.push(trimmedLine);
      historyIndexRef.current = historyRef.current.length;
      const [cmd, ...args] = trimmedLine.split(' ').filter(x => x);
      if (commands[cmd]) commands[cmd](args, currentCwd);
      else { term.writeln(`\x1b[31m${cmd}: commande introuvable\x1b[0m`); writePrompt(currentCwd); }
    };

    const handleData = (data: string) => {
      // === MODE NANO ===
      if (nanoModeRef.current) {
        if (nanoPendingAction.current) {
          if (data === '\r') {
            if (nanoPendingAction.current === 'SAVE') {
              saveNanoFile();
              term.writeln('\r\n\x1b[32m✓ Sauvegardé.\x1b[0m\r\n> ');
            } else if (nanoPendingAction.current === 'SAVE_EXIT') {
              saveNanoFile();
              exitNano(true, false);
              return;
            } else if (nanoPendingAction.current === 'EXIT') {
              exitNano(false, true);
              return;
            }
            nanoPendingAction.current = null;
            return;
          } else {
            // Annule l'attente si on tape autre chose que Enter
            term.write(`\r\x1b[K> `);
            nanoPendingAction.current = null;
          }
        }

        if (data === '\u0013') { nanoPendingAction.current = 'SAVE'; term.write(' [SAVE?] '); return; }
        if (data === '\u0003') { nanoPendingAction.current = 'SAVE_EXIT'; term.write(' [SAVE & EXIT?] '); return; }
        if (data === '\u0018') { nanoPendingAction.current = 'EXIT'; term.write(' [EXIT WITHOUT SAVE?] '); return; }

        if (data === '\r' || data === '\n') {
          setNanoBuffer(prev => prev + '\n');
          term.write('\r\n> ');
        } else if (data === '\u007f' || data === '\b') {
          if (nanoBuffer.length > 0) {
            setNanoBuffer(prev => prev.slice(0, -1));
            term.write('\b \b');
          }
        } else if (data >= ' ' && data <= '~') {
          setNanoBuffer(prev => prev + data);
          term.write(data);
        }
        return;
      }

      // === MODE TERMINAL NORMAL ===
      if (data === '\r') {
        term.write('\r\n');
        executeCommand(currentLineRef.current, cwd);
        currentLineRef.current = '';
      } else if (data === '\u007f' || data === '\b') {
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (data === '\u001b[A') {
        if (historyRef.current.length > 0 && historyIndexRef.current > 0) {
          historyIndexRef.current--;
          currentLineRef.current = historyRef.current[historyIndexRef.current] || '';
          term.write(`\r\x1b[K\x1b[36m${cwd}\x1b[0m$ ${currentLineRef.current}`);
        }
      } else if (data === '\u001b[B') {
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyIndexRef.current++;
          currentLineRef.current = historyRef.current[historyIndexRef.current] || '';
        } else {
          historyIndexRef.current = historyRef.current.length;
          currentLineRef.current = '';
        }
        term.write(`\r\x1b[K\x1b[36m${cwd}\x1b[0m$ ${currentLineRef.current}`);
      } else if (data === '\u001b[C' || data === '\u001b[D') {
        // Flèches droite/gauche ignorées
      } else if (data >= ' ' && data <= '~') {
        currentLineRef.current += data;
        term.write(data);
      } else if (data === '\u0003') {
        term.write('^C\r\n');
        currentLineRef.current = '';
        writePrompt(cwd);
      }
    };

    term.onData(handleData);
    term.writeln('\x1b[32mBienvenue dans le terminal Aincrad !\x1b[0m');
    term.writeln('\x1b[90mTapez "help" pour voir les commandes.\x1b[0m');
    writePrompt(cwd);
    term.focus();

    const handleResize = () => fitAddonRef.current?.fit();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => setTimeout(() => fitAddonRef.current?.fit(), 10));
    resizeObserver.observe(terminalRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      term.dispose();
      termRef.current = null;
      fitAddonRef.current = null;
    };
  }, [isOpen, onClose, fileSystem, cwd]);

  useEffect(() => {
    if (isOpen && termRef.current) {
      setTimeout(() => { termRef.current?.focus(); fitAddonRef.current?.fit(); }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm" onMouseDown={(e) => e.stopPropagation()}>
      <div className="w-full max-w-5xl h-[85vh] bg-[#1e1e1e] rounded-xl overflow-hidden flex flex-col shadow-2xl border border-gray-700">
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors" aria-label="Fermer" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-80" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">Terminal</span>
            <span className="text-gray-600 text-xs">—</span>
            <span className="text-gray-400 text-xs">heath@aincrad</span>
          </div>
          <div className="w-20" />
        </div>
        <div className="flex-1 relative bg-[#1e1e1e]">
          <div ref={terminalRef} className="absolute inset-0 p-2" />
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
