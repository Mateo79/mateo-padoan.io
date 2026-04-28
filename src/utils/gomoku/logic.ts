import { initCombinations } from './combinations';

export const createGomokuAI = (size: number = 20) => {
    const gameSize = 5; // 5 in a row to win
    const ring = 1;
    let curState: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
    const maxPlayer = -1;
    const combinations = initCombinations();

    const checkWin = (): boolean => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (curState[i][j] === 0) continue;
                const val = combinations.valuePosition(
                    getCombo(curState[i][j], i, j, 1, 0),
                    getCombo(curState[i][j], i, j, 0, 1),
                    getCombo(curState[i][j], i, j, 1, 1),
                    getCombo(curState[i][j], i, j, 1, -1)
                );
                if (val === combinations.winValue) return true;
            }
        }
        return false;
    };

    const getCombo = (player: number, i: number, j: number, dx: number, dy: number): number[] => {
        const combo = [player];
        for (let m = 1; m < gameSize; m++) {
            const x = i - dx * m;
            const y = j - dy * m;
            if (x < 0 || y < 0 || x >= size || y >= size) break;
            const val = curState[x][y];
            if (val === -player) {
                combo.unshift(val);
                break;
            }
            combo.unshift(val);
        }
        for (let m = 1; m < gameSize; m++) {
            const x = i + dx * m;
            const y = j + dy * m;
            if (x < 0 || y < 0 || x >= size || y >= size) break;
            const val = curState[x][y];
            if (val === -player) {
                combo.push(val);
                break;
            }
            combo.push(val);
        }
        return combo;
    };

    const getChilds = (parent: number[][], player: number): number[][][] => {
        const candidates: [number, number][] = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (parent[i][j] !== 0) {
                    for (let k = Math.max(0, i - ring); k <= Math.min(size - 1, i + ring); k++) {
                        for (let l = Math.max(0, j - ring); l <= Math.min(size - 1, j + ring); l++) {
                            if (parent[k][l] === 0) {
                                const exists = candidates.some(([x, y]) => x === k && y === l);
                                if (!exists) candidates.push([k, l]);
                            }
                        }
                    }
                }
            }
        }

        return candidates.map(([x, y]) => {
            const child = parent.map(row => [...row]);
            child[x][y] = -player;
            return child;
        });
    };

    const heuristic = (newNode: number[][], oldNode: number[][]): number => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (newNode[i][j] !== oldNode[i][j]) {
                    const curCell = newNode[i][j];
                    const playerVal = combinations.valuePosition(
                        getCombo(curCell, i, j, 1, 0),
                        getCombo(curCell, i, j, 0, 1),
                        getCombo(curCell, i, j, 1, 1),
                        getCombo(curCell, i, j, 1, -1)
                    );
                    newNode[i][j] = -curCell;
                    const oppositeVal = combinations.valuePosition(
                        getCombo(-curCell, i, j, 1, 0),
                        getCombo(-curCell, i, j, 0, 1),
                        getCombo(-curCell, i, j, 1, 1),
                        getCombo(-curCell, i, j, 1, -1)
                    );
                    newNode[i][j] = curCell;
                    return 2 * playerVal + oppositeVal;
                }
            }
        }
        return 0;
    };

    const miniMax = (node: number[][], depth: number, player: number, parent: number[][]): number => {
        if (depth === 0) return heuristic(node, parent);
        let alpha = -Infinity;
        const children = getChilds(node, player);
        for (const child of children) {
            const value = miniMax(child, depth - 1, -player, node);
            alpha = Math.max(alpha, -value);
        }
        return alpha;
    };

    const makeMove = (_humanRow: number, _humanCol: number): [number, number] | null => {
        const children = getChilds(curState, maxPlayer);
        if (children.length === 0) return null;

        let bestValue = -Infinity;
        let bestChild = children[0];

        for (const child of children) {
            const value = miniMax(child, 0, -maxPlayer, curState);
            if (value > bestValue) {
                bestValue = value;
                bestChild = child;
            }
        }

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (bestChild[i][j] !== curState[i][j]) {
                    curState[i][j] = -maxPlayer;
                    return [i, j];
                }
            }
        }
        return null;
    };

    const setState = (newState: number[][]) => {
        curState = newState.map(row => [...row]);
    };

    const reset = () => {
        curState = Array(size).fill(null).map(() => Array(size).fill(0));
    };

    return { makeMove, checkWin, setState, reset };
};
