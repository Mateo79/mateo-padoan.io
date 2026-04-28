export const initCombinations = () => {
    const win = [[1, 1, 1, 1, 1]];
    const unCovered4 = [[0, 1, 1, 1, 1, 0]];
    const unCovered3 = [
        [0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 0],
        [0, 1, 1, 0, 1, 0]
    ];
    const unCovered2 = [
        [0, 0, 1, 1, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0],
        [0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 1, 0]
    ];
    const covered4 = [
        [-1, 1, 0, 1, 1, 1],
        [-1, 1, 1, 0, 1, 1],
        [-1, 1, 1, 1, 0, 1],
        [-1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, -1],
        [1, 0, 1, 1, 1, -1],
        [1, 1, 0, 1, 1, -1],
        [1, 1, 1, 0, 1, -1]
    ];
    const covered3 = [
        [-1, 1, 1, 1, 0, 0],
        [-1, 1, 1, 0, 1, 0],
        [-1, 1, 0, 1, 1, 0],
        [0, 0, 1, 1, 1, -1],
        [0, 1, 0, 1, 1, -1],
        [0, 1, 1, 0, 1, -1],
        [-1, 1, 0, 1, 0, 1, -1],
        [-1, 0, 1, 1, 1, 0, -1],
        [-1, 1, 1, 0, 0, 1, -1],
        [-1, 1, 0, 0, 1, 1, -1]
    ];

    // Ajouter les combinaisons pour l'autre joueur
    const allCombos = [win, unCovered4, unCovered3, unCovered2, covered4, covered3];
    for (const combo of allCombos) {
        const temp = combo.map(arr => arr.map(x => -x));
        combo.push(...temp);
    }

    const valueCombo = (w: number, u2: number, u3: number, u4: number, c3: number, c4: number) => {
        if (w > 0) return 1000000000;
        if (u4 > 0) return 100000000;
        if (c4 > 1) return 10000000;
        if (u3 > 0 && c4 > 0) return 1000000;
        if (u3 > 1) return 100000;
        if (u3 === 1) {
            if (u2 >= 3) return 40000;
            if (u2 === 2) return 38000;
            if (u2 === 1) return 35000;
            return 3450;
        }
        if (c4 === 1) {
            if (u2 >= 3) return 4500;
            if (u2 === 2) return 4200;
            if (u2 === 1) return 4100;
            return 4050;
        }
        if (c3 === 1) {
            if (u2 >= 3) return 3400;
            if (u2 === 2) return 3300;
            if (u2 === 1) return 3100;
        }
        if (c3 === 2) {
            if (u2 === 2) return 3000;
            if (u2 === 1) return 2900;
        }
        if (c3 === 3 && u2 === 1) return 2800;
        if (u2 === 4) return 2700;
        if (u2 === 3) return 2500;
        if (u2 === 2) return 2000;
        if (u2 === 1) return 1000;
        return 0;
    };

    const findArray = (arr: number[], inArr: number[]) => {
        const fCount = arr.length;
        const sCount = inArr.length;
        for (let i = 0; i <= fCount - sCount; i++) {
            let k = 0;
            for (let j = 0; j < sCount; j++) {
                if (arr[i + j] === inArr[j]) k++;
                else break;
            }
            if (k === sCount) return true;
        }
        return false;
    };

    const isAnyInArrays = (combos: number[][], arr: number[]) => {
        return combos.some(combo => findArray(arr, combo));
    };

    return {
        winValue: 1000000000,
        valuePosition: (arr1: number[], arr2: number[], arr3: number[], arr4: number[]) => {
            let w = 0, u2 = 0, u3 = 0, u4 = 0, c3 = 0, c4 = 0;
            const allArr = [arr1, arr2, arr3, arr4];
            for (const arr of allArr) {
                if (isAnyInArrays(win, arr)) { w++; continue; }
                if (isAnyInArrays(covered4, arr)) { c4++; continue; }
                if (isAnyInArrays(covered3, arr)) { c3++; continue; }
                if (isAnyInArrays(unCovered4, arr)) { u4++; continue; }
                if (isAnyInArrays(unCovered3, arr)) { u3++; continue; }
                if (isAnyInArrays(unCovered2, arr)) { u2++; }
            }
            return valueCombo(w, u2, u3, u4, c3, c4);
        }
    };
};