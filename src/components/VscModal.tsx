// src/components/VscModal.tsx
import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FaTimes, FaPlay } from 'react-icons/fa';

interface VSCModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Language = 'javascript' | 'typescript';

const VSCModal = ({ isOpen, onClose }: VSCModalProps) => {
    const [code, setCode] = useState<string>(`// Bienvenue dans l'éditeur Aincrad
console.log("Hello, World!");
`);
    const [output, setOutput] = useState<string>('');
    const [language, setLanguage] = useState<Language>('javascript');
    const [isRunning, setIsRunning] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);

    // Auto-scroll de la console
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    // Exécution du code
    const runCode = () => {
        setIsRunning(true);
        setOutput('Exécution en cours...\n');

        try {
            let result = '';
            const originalLog = console.log;
            
            // Capture console.log
            console.log = (...args: any[]) => {
                result += args.map(String).join(' ') + '\n';
            };

            // Prépare le code selon le langage
            let codeToRun = code;
            if (language === 'typescript') {
                // Retire les annotations de type basiques pour permettre l'exécution en JS
                codeToRun = code
                    .replace(/:\s*(string|number|boolean|any|void|\w+)/g, '')
                    .replace(/<\w+>/g, '')
                    .replace(/\s+as\s+\w+/g, '')
                    .replace(/interface\s+\w+\s*{[^}]*}/g, '')
                    .replace(/type\s+\w+\s*=.*;/g, '');
            }

            new Function(codeToRun)();
            
            console.log = originalLog;
            setOutput(result || 'Aucune sortie.');
            
        } catch (err) {
            setOutput('Erreur d\'exécution : code invalide.');
        } finally {
            setIsRunning(false);
        }
    };

    // Code par défaut
    const getDefaultCode = (lang: Language): string => {
        if (lang === 'typescript') {
            return `// Exemple TypeScript
const message: string = "Hello, Aincrad!";
console.log(message);

function add(a: number, b: number): number {
    return a + b;
}
console.log("2 + 3 =", add(2, 3));`;
        }
        return `// Exemple JavaScript
console.log("Hello, Aincrad!");
const add = (a, b) => a + b;
console.log("2 + 3 =", add(2, 3));`;
    };

    // Changement de langage
    useEffect(() => {
        setCode(getDefaultCode(language));
        setOutput('');
    }, [language]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="w-full max-w-6xl h-[90vh] bg-gray-900 border border-purple-500 rounded-lg overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                    <h3 className="text-purple-400 font-mono text-sm">VS Code — Aincrad</h3>
                    
                    <div className="flex items-center gap-2">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                        </select>
                        
                        <button
                            onClick={runCode}
                            disabled={isRunning}
                            className={`text-xs px-3 py-1 rounded flex items-center ${
                                isRunning
                                    ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {isRunning ? '...' : <><FaPlay className="w-3 h-3 mr-1" /> Exécuter</>}
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-xl"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Éditeur */}
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                fontSize: 14,
                                fontFamily: 'monospace',
                                automaticLayout: true,
                                theme: 'vs-dark',
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>

                    {/* Console */}
                    <div className="w-1/3 border-l border-gray-700 flex flex-col">
                        <div className="bg-gray-800 px-3 py-2 text-xs text-cyan-400 font-mono">
                            TERMINAL
                        </div>
                        <div
                            ref={outputRef}
                            className="flex-1 p-3 bg-black text-green-400 font-mono text-sm overflow-y-auto whitespace-pre-wrap"
                        >
                            {output}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSCModal;
