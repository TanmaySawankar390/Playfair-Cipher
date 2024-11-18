function createMatrix(key) {
    let matrix = [];
    let seen = new Set();

    // Prepare the key: Uppercase, replace J with I, and remove duplicates
    key = key.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    key += "ABCDEFGHIKLMNOPQRSTUVWXYZ";

    for (let char of key) {
        if (!seen.has(char)) {
            matrix.push(char);
            seen.add(char);
        }
    }

    return Array.from({ length: 5 }, (_, i) => matrix.slice(i * 5, i * 5 + 5));
}

function preprocessText(text, isDecrypting = false) {
    text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    if (!isDecrypting) {
        // Insert X between duplicate characters and pad with X if odd-length
        let processed = "";
        for (let i = 0; i < text.length; i++) {
            processed += text[i];
            if (i + 1 < text.length && text[i] === text[i + 1]) {
                processed += "X";
            }
        }
        if (processed.length % 2 !== 0) processed += "X";
        return processed;
    }
    return text;
}

function findPosition(matrix, char) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === char) {
                return [row, col];
            }
        }
    }
    return [-1, -1];
}

function processPair(matrix, char1, char2, isDecrypting) {
    let [row1, col1] = findPosition(matrix, char1);
    let [row2, col2] = findPosition(matrix, char2);

    const shift = isDecrypting ? -1 : 1;

    if (row1 === row2) {
        return matrix[row1][(col1 + shift + 5) % 5] + matrix[row2][(col2 + shift + 5) % 5];
    } else if (col1 === col2) {
        return matrix[(row1 + shift + 5) % 5][col1] + matrix[(row2 + shift + 5) % 5][col2];
    } else {
        return matrix[row1][col2] + matrix[row2][col1];
    }
}

function processPlayfair(key, text, isDecrypting) {
    const matrix = createMatrix(key);
    const processedText = preprocessText(text, isDecrypting);
    let result = "";

    for (let i = 0; i < processedText.length; i += 2) {
        result += processPair(matrix, processedText[i], processedText[i + 1], isDecrypting);
    }

    return result;
}

document.getElementById("cipherForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const key = document.getElementById("key").value;
    const text = document.getElementById("plaintext").value;
    const action = document.getElementById("action").value;

    if (key && text) {
        const isDecrypting = action === "decrypt";
        const result = processPlayfair(key, text, isDecrypting);
        document.getElementById("ciphertext").textContent = result;
    }
});
