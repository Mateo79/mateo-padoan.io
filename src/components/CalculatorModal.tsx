import { useState, useRef, useEffect } from 'react';
import * as math from 'mathjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
    FaCalculator, 
    FaTimes, 
    FaQuestion, 
    FaInfo,
    FaBackspace, 
    FaChartLine
} from './icons/ReactIcons';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface CalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface KeypadButton {
    label: string;
    color: string;
    text?: string;
    wide?: boolean;
}

const CalculatorModal = ({ isOpen, onClose }: CalculatorModalProps) => {
    const [mode, setMode] = useState<'calc' | 'graph'>('calc');
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<{ id: string; expr: string; result: string }[]>([]);
    const [calcMode, setCalcMode] = useState<'RAD' | 'DEG'>('RAD');
    const [functionInput, setFunctionInput] = useState('x^2');
    const [graphData, setGraphData] = useState<any>(null);
    const [cursorPos, setCursorPos] = useState<number>(-1);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [showHelp, setShowHelp] = useState(false);

    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setInput('');
            setCursorPos(-1);
            setHistoryIndex(-1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [mode]);

    const parseInput = (str: string): string => {
        let res = str
            .replace(/π/g, 'pi')
            .replace(/e(?![\w])/g, 'e')
            .replace(/i(?![\w])/g, 'i')
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/→/g, '=')
            .replace(/:=/g, '=');

        res = res.replace(/(\d|\))\s*(sqrt|sin|cos|tan|asin|acos|atan|log|log10|ln|exp|abs)\s*\(/g, '$1*$2(');
        res = res.replace(/(\d)\s*\(/g, '$1*(');
        res = res.replace(/\)\s*(\d)/g, ')*$1');
        res = res.replace(/\)\s*\(/g, ')*(');
        res = res.replace(/\b(pi|e)\s*(\d|\()/g, '$1*$2');
        res = res.replace(/(\d)\s*(pi|e)\b/g, '$1*$2');
        res = res.replace(/\bx\s*(\d|\()/g, 'x*$1');
        res = res.replace(/(\d)\s*x\b/g, '$1*x');

        res = res.replace(/(\d|\))\s*√\s*\(/g, '$1*sqrt(');
        res = res.replace(/√\s*\(/g, 'sqrt(');
        res = res.replace(/(\S+)²/g, '($1)^2');

        let openCount = (res.match(/\(/g) || []).length;
        let closeCount = (res.match(/\)/g) || []).length;
        if (openCount > closeCount) {
            res += ')'.repeat(openCount - closeCount);
        }
        return res;
    };

    const formatOutput = (value: any): string => {
        if (typeof value === 'number') {
            if (isNaN(value)) return 'undefined';
            if (!isFinite(value)) return '∞';

            const absValue = Math.abs(value);
            const strValue = absValue.toString().replace('.', '');

            if (strValue.length > 9 || absValue >= 1e9 || (absValue < 1e-6 && absValue > 0)) {
                return value.toExponential(6);
            }

            return math.format(value, { precision: 14 });
        }
        try {
            return math.format(value, { precision: 14 });
        } catch {
            return String(value);
        }
    };

    const insertAtCursor = (text: string) => {
        setInput(prevInput => {
            const currentCursorPos = cursorPos;
            let newInput: string;
            let newCursorPos: number;

            if (currentCursorPos === -1 || currentCursorPos >= prevInput.length) {
                newInput = prevInput + text;
                newCursorPos = newInput.length;
            } else {
                const before = prevInput.slice(0, currentCursorPos);
                const after = prevInput.slice(currentCursorPos);
                newInput = before + text + after;
                newCursorPos = currentCursorPos + text.length;
            }

            setTimeout(() => {
                setCursorPos(newCursorPos);
            }, 0);

            return newInput;
        });
    };

    const handleBackspace = () => {
        if (cursorPos === -1) {
            setInput(prev => prev.slice(0, -1));
        } else {
            const before = input.slice(0, cursorPos - 1);
            const after = input.slice(cursorPos);
            setInput(before + after);
            setCursorPos(prev => Math.max(0, prev - 1));
        }
    };

    const handleClear = () => {
        setInput('');
        setCursorPos(-1);
    };

    const handleKeyPress = (key: string) => {
        if (key === '◄') {
            setCursorPos(prev => {
                if (prev === -1) return input.length - 1;
                return Math.max(0, prev - 1);
            });
            return;
        }
        if (key === '►') {
            setCursorPos(prev => {
                if (prev === -1) return -1;
                return prev < input.length - 1 ? prev + 1 : -1;
            });
            return;
        }

        if (key === '▲') {
            if (history.length > 0) {
                const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]?.expr || '');
                setCursorPos(-1);
            }
            return;
        }
        if (key === '▼') {
            if (historyIndex > -1) {
                const newIndex = historyIndex - 1;
                if (newIndex >= -1) {
                    setHistoryIndex(newIndex);
                    setInput(newIndex === -1 ? '' : history[newIndex]?.expr || '');
                    setCursorPos(-1);
                }
            }
            return;
        }

        if (key === 'AC' || key === 'esc') {
            handleClear();
            return;
        }
        if (key === 'del' || key === '⌫') {
            handleBackspace();
            return;
        }
        if (key === 'ctrl') {
            setCalcMode(prev => prev === 'RAD' ? 'DEG' : 'RAD');
            return;
        }
        if (key === 'menu') {
            setShowHelp(prev => !prev);
            return;
        }
        if (key === 'doc') {
            alert('Fonctions disponibles:\n• Trig: sin, cos, tan, asin, acos, atan\n• Log: ln, log, log10, exp\n• Autres: sqrt, abs, ^, !\n• Constantes: pi, e, i');
            return;
        }

        if (key === 'graph' || key === 'calc') {
            setMode(key === 'graph' ? 'graph' : 'calc');
            return;
        }

        if (key === 'enter' || key === '=') {
            if (input.trim() === '') return;
            try {
                const exprForMath = parseInput(input);
                let result;

                const evalScope: any = {};
                if (calcMode === 'DEG') {
                    evalScope.sin = (x: number) => math.sin(math.unit(x, 'deg').toNumber('rad'));
                    evalScope.cos = (x: number) => math.cos(math.unit(x, 'deg').toNumber('rad'));
                    evalScope.tan = (x: number) => math.tan(math.unit(x, 'deg').toNumber('rad'));
                }

                if (exprForMath.includes('=')) {
                    math.evaluate(exprForMath, evalScope);
                    result = 'Done';
                } else {
                    result = math.evaluate(exprForMath, evalScope);
                }

                const resultStr = formatOutput(result);
                const newId = `${history.length + 1}.1`;
                setHistory(prev => [{ id: newId, expr: input, result: resultStr }, ...prev.slice(0, 19)]);
                setInput('');
                setCursorPos(-1);
                setHistoryIndex(-1);
            } catch (err) {
                const newId = `${history.length + 1}.1`;
                setHistory(prev => [{ id: newId, expr: input, result: 'Error' }, ...prev.slice(0, 19)]);
                setInput('');
                setCursorPos(-1);
            }
            return;
        }

        if (key === '(-)') {
            if (input.startsWith('-')) {
                setInput(prev => prev.slice(1));
                setCursorPos(prev => prev > 0 ? prev - 1 : -1);
            } else {
                setInput(prev => '-' + prev);
                setCursorPos(prev => prev + 1);
            }
            return;
        }

        const funcWithParen: Record<string, string> = {
            '√': 'sqrt',
            'sin': 'sin',
            'cos': 'cos',
            'tan': 'tan',
            'asin': 'asin',
            'acos': 'acos',
            'atan': 'atan',
            'ln': 'ln',
            'log': 'log',
            'e^': 'exp',
            '|x|': 'abs',
        };

        if (funcWithParen[key]) {
            insertAtCursor(funcWithParen[key] + '(');
            return;
        }

        if (key === 'x²') {
            insertAtCursor('^2');
            return;
        }
        if (key === '^') {
            insertAtCursor('^');
            return;
        }

        if (key === 'π') {
            insertAtCursor('pi');
            return;
        }
        if (key === 'e') {
            insertAtCursor('e');
            return;
        }
        if (key === 'i') {
            insertAtCursor('i');
            return;
        }

        if (key === 'sto→') {
            insertAtCursor(' → ');
            return;
        }
        if (key === 'var') {
            insertAtCursor('x');
            return;
        }
        if (key === 'ans') {
            if (history.length > 0) {
                insertAtCursor(history[0].result);
            }
            return;
        }

        insertAtCursor(key);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (mode !== 'calc') return;

        e.preventDefault();
        const key = e.key;

        if (key === 'Enter' || key === '=') {
            handleKeyPress('=');
        } else if (key === 'Backspace') {
            handleBackspace();
        } else if (key === 'Escape') {
            handleClear();
        } else if (key === 'ArrowLeft') {
            handleKeyPress('◄');
        } else if (key === 'ArrowRight') {
            handleKeyPress('►');
        } else if (key === 'ArrowUp') {
            handleKeyPress('▲');
        } else if (key === 'ArrowDown') {
            handleKeyPress('▼');
        } else if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
            insertAtCursor(key);
        }
    };

    const generateGraph = () => {
        if (!functionInput.trim()) {
            alert('Veuillez entrer une fonction');
            return;
        }

        try {
            const expr = functionInput.replace(/x/g, 'X');
            const compiled = math.compile(expr);
            const xValues: number[] = [];
            const yValues: (number | null)[] = [];
            const step = 0.1;

            for (let x = -10; x <= 10; x += step) {
                try {
                    const y = compiled.evaluate({ X: x });
                    if (typeof y === 'number' && isFinite(y) && Math.abs(y) < 1e10) {
                        xValues.push(x);
                        yValues.push(y);
                    } else {
                        xValues.push(x);
                        yValues.push(null);
                    }
                } catch {
                    xValues.push(x);
                    yValues.push(null);
                }
            }

            setGraphData({
                labels: xValues,
                datasets: [
                    {
                        label: `f(x) = ${functionInput}`,
                        data: xValues.map((x, i) => ({
                            x,
                            y: yValues[i] ?? null,
                        })),
                        borderColor: '#22d3ee',
                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.1,
                    },
                ],
            });
        } catch (err) {
            console.error('Erreur graphique:', err);
            alert('Fonction invalide. Exemples: x^2, sin(x), sqrt(x), exp(-x)');
            setGraphData(null);
        }
    };

    const keypadRows: KeypadButton[][] = [
        [
            { label: 'ctrl', color: 'bg-red-600' },
            { label: 'menu', color: 'bg-red-600' },
            { label: '◄', color: 'bg-yellow-500', text: 'text-black' },
            { label: '►', color: 'bg-yellow-500', text: 'text-black' },
            { label: '▲', color: 'bg-yellow-500', text: 'text-black' },
            { label: '▼', color: 'bg-yellow-500', text: 'text-black' },
            { label: 'doc', color: 'bg-gray-700' },
            { label: mode === 'calc' ? 'graph' : 'calc', color: 'bg-purple-600' },
            { label: 'esc', color: 'bg-red-600' },
        ],
        [
            { label: '7', color: 'bg-blue-600' },
            { label: '8', color: 'bg-blue-600' },
            { label: '9', color: 'bg-blue-600' },
            { label: '÷', color: 'bg-gray-700' },
            { label: 'π', color: 'bg-gray-700' },
            { label: '^', color: 'bg-gray-700' },
            { label: '(', color: 'bg-gray-700' },
            { label: ')', color: 'bg-gray-700' },
            { label: 'del', color: 'bg-red-600' },
        ],
        [
            { label: '4', color: 'bg-blue-600' },
            { label: '5', color: 'bg-blue-600' },
            { label: '6', color: 'bg-blue-600' },
            { label: '×', color: 'bg-gray-700' },
            { label: '√', color: 'bg-gray-700' },
            { label: 'x²', color: 'bg-gray-700' },
            { label: 'sin', color: 'bg-gray-700' },
            { label: 'cos', color: 'bg-gray-700' },
            { label: 'tan', color: 'bg-gray-700' },
        ],
        [
            { label: '1', color: 'bg-blue-600' },
            { label: '2', color: 'bg-blue-600' },
            { label: '3', color: 'bg-blue-600' },
            { label: '-', color: 'bg-gray-700' },
            { label: 'e^', color: 'bg-gray-700' },
            { label: 'ln', color: 'bg-gray-700' },
            { label: 'log', color: 'bg-gray-700' },
            { label: '|x|', color: 'bg-gray-700' },
            { label: 'ans', color: 'bg-gray-700' },
        ],
        [
            { label: '0', color: 'bg-blue-600' },
            { label: '.', color: 'bg-blue-600' },
            { label: '(-)', color: 'bg-blue-600' },
            { label: '+', color: 'bg-gray-700' },
            { label: 'AC', color: 'bg-red-600' },
            { label: '=', color: 'bg-green-600' },
        ],
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="w-full max-w-4xl h-[90vh] bg-gray-900 border border-blue-500 rounded-lg overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex justify-between items-center border-b border-blue-500/50">
                    <h3 className="text-blue-400 font-mono flex items-center gap-2">
                        <FaCalculator className="text-lg" />
                        {mode === 'calc' ? 'Calculatrice — Aincrad' : 'Graphique — Aincrad'}
                        <span className={`text-xs px-2 py-0.5 rounded ${calcMode === 'RAD' ? 'bg-cyan-600' : 'bg-purple-600'}`}>
                            {calcMode}
                        </span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-xl transition-colors hover:rotate-90"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {mode === 'calc' ? (
                    <>
                        {/* Écran Calculatrice */}
                        <div
                            ref={inputRef}
                            tabIndex={0}
                            onKeyDown={handleKeyDown}
                            className="p-4 bg-black text-green-400 font-mono h-[55%] overflow-y-auto cursor-text outline-none"
                        >
                            <div className="flex justify-between text-xs mb-2 opacity-70">
                                <span>History</span>
                                <span>Math • CAS</span>
                            </div>

                            {history.length > 0 && (
                                <div className="mb-4 border-b border-gray-700 pb-2 max-h-32 overflow-y-auto">
                                    {history.slice(0, 5).map((item, i) => (
                                        <div key={i} className="text-xs opacity-80 hover:opacity-100 cursor-pointer"
                                            onClick={() => {
                                                setInput(item.expr);
                                                setCursorPos(-1);
                                            }}
                                        >
                                            <span className="text-cyan-400">{item.id}</span> {item.expr}
                                            <span className="text-green-400 ml-2">= {item.result}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-lg min-h-8 flex items-center flex-wrap">
                                {input.split('').map((char, i) => (
                                    <span
                                        key={i}
                                        className={cursorPos === i ? 'bg-green-400 text-black rounded px-0.5' : ''}
                                    >
                                        {char}
                                    </span>
                                ))}
                                {cursorPos === -1 && input.length > 0 && (
                                    <span className="inline-block w-2.5 h-5 bg-green-400 ml-0.5 animate-pulse rounded"></span>
                                )}
                                {input.length === 0 && (
                                    <span className="text-gray-500">Entrez une expression...</span>
                                )}
                            </div>

                            {showHelp && (
                                <div className="mt-4 p-3 bg-gray-800 rounded border border-cyan-500/50 text-xs">
                                    <div className="font-bold text-cyan-400 mb-1">Raccourcis clavier:</div>
                                    <div className="grid grid-cols-2 gap-1 opacity-90">
                                        <span>← → : Naviguer</span>
                                        <span>↑ ↓ : Historique</span>
                                        <span>Enter : Calculer</span>
                                        <span>Esc : Effacer</span>
                                        <span>Backspace : Supprimer</span>
                                        <span>Ctrl : RAD/DEG</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clavier */}
                        <div className="p-2 bg-gray-800 h-[45%] flex flex-col justify-between">
                            {keypadRows.map((row, i) => (
                                <div key={i} className="flex w-full h-12 items-center justify-center gap-1">
                                    {row.map((btn, j) => {
                                        if (btn.label === 'graph' || btn.label === 'calc') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress(btn.label)}
                                                    className={`${btn.color} text-white flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95`}
                                                >
                                                    {btn.label}
                                                </button>
                                            );
                                        }

                                        if (btn.label === 'AC' || btn.label === 'esc') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress(btn.label)}
                                                    className={`${btn.color} text-white flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 font-semibold`}
                                                >
                                                    {btn.label}
                                                </button>
                                            );
                                        }

                                        if (btn.label === 'del') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('⌫')}
                                                    className={`${btn.color} text-white flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95`}
                                                >
                                                    <FaBackspace className="w-4 h-4" />
                                                </button>
                                            );
                                        }

                                        if (btn.label === '=') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('=')}
                                                    className={`${btn.color} text-white flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 font-bold`}
                                                >
                                                    =
                                                </button>
                                            );
                                        }

                                        if (btn.label === 'ctrl') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('ctrl')}
                                                    className={`${btn.color} text-white flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95`}
                                                >
                                                    {calcMode}
                                                </button>
                                            );
                                        }

                                        if (btn.label === 'menu') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('menu')}
                                                    className={`${btn.color} text-white flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95 ${showHelp ? 'ring-2 ring-cyan-400' : ''}`}
                                                >
                                                    <FaQuestion className="w-4 h-4" />
                                                </button>
                                            );
                                        }

                                        if (btn.label === 'doc') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('doc')}
                                                    className={`${btn.color} ${btn.text || 'text-white'} flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95`}
                                                >
                                                    <FaInfo className="w-4 h-4" />
                                                </button>
                                            );
                                        }

                                        if (btn.label === '(-)') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('(-)')}
                                                    className={`${btn.color} ${btn.text || 'text-white'} flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95`}
                                                >
                                                    ±
                                                </button>
                                            );
                                        }

                                        if (btn.label === 'ans') {
                                            return (
                                                <button
                                                    key={j}
                                                    onClick={() => handleKeyPress('ans')}
                                                    className={`${btn.color} ${btn.text || 'text-white'} flex-1 min-w-0 h-full text-sm rounded flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95`}
                                                >
                                                    Ans
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                key={j}
                                                onClick={() => handleKeyPress(btn.label)}
                                                className={`
                                                    ${btn.color}
                                                    ${btn.text || 'text-white'}
                                                    flex-1
                                                    min-w-0
                                                    h-full
                                                    text-sm
                                                    rounded
                                                    flex items-center justify-center
                                                    hover:opacity-90
                                                    transition-opacity
                                                    active:scale-95
                                                `}
                                            >
                                                {btn.label === '(-)' ? '±' : btn.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mode Graphique */}
                        <div className="p-4 bg-black text-green-400 font-mono h-[30%] border-b border-gray-700">
                            <div className="mb-2 text-sm">Entrez une fonction f(x) :</div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={functionInput}
                                    onChange={(e) => setFunctionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && generateGraph()}
                                    className="flex-1 bg-gray-800 text-cyan-400 p-2 rounded border border-gray-600 focus:border-cyan-400 focus:outline-none font-mono"
                                    placeholder="Ex: x^2, sin(x), sqrt(x), exp(-x)"
                                />
                                <button
                                    onClick={generateGraph}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-semibold transition-colors active:scale-95"
                                >
                                    Courbe
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                                Astuce: Appuyez sur Entrée pour générer rapidement
                            </div>
                        </div>

                        {/* Graphique */}
                        <div className="h-[70%] p-4 bg-gray-900">
                            {graphData ? (
                                <Line
                                    data={graphData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        animation: { duration: 300 },
                                        scales: {
                                            x: {
                                                type: 'linear',
                                                position: 'bottom',
                                                title: { display: true, text: 'x', color: '#22d3ee' },
                                                grid: { color: 'rgba(34, 211, 238, 0.1)' },
                                                ticks: { color: '#22d3ee', font: { size: 10 } },
                                                border: { color: '#22d3ee' },
                                            },
                                            y: {
                                                title: { display: true, text: 'f(x)', color: '#22d3ee' },
                                                grid: { color: 'rgba(34, 211, 238, 0.1)' },
                                                ticks: { color: '#22d3ee', font: { size: 10 } },
                                                border: { color: '#22d3ee' },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                labels: { color: '#22d3ee', font: { size: 11 } },
                                                position: 'top',
                                            },
                                            tooltip: {
                                                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                                titleColor: '#22d3ee',
                                                bodyColor: '#fff',
                                                borderColor: '#22d3ee',
                                                borderWidth: 1,
                                            },
                                        },
                                    }}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <FaChartLine className="text-4xl mb-4" />
                                    <div className="text-center">
                                        <p className="mb-2">Entrez une fonction et cliquez sur "Courbe"</p>
                                        <p className="text-xs opacity-70">Exemples: x^2, sin(x), sqrt(x), exp(-x), x*sin(x)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CalculatorModal;
