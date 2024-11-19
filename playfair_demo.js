function createMatrix(key) {
    let matrix = [];
    let seen = new Set();

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

function preprocessText(text) {
    text = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
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

function processPair(matrix, char1, char2) {
    let [row1, col1] = findPosition(matrix, char1);
    let [row2, col2] = findPosition(matrix, char2);

    if (row1 === row2) {
        return matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
    } else if (col1 === col2) {
        return matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
    } else {
        return matrix[row1][col2] + matrix[row2][col1];
    }
}

function visualizeCipher(key, plaintext) {
    const matrix = createMatrix(key);
    const processedText = preprocessText(plaintext);

    // Show the matrix
    const matrixDiv = document.getElementById("matrix");
    matrixDiv.innerHTML = "";
    matrix.flat().forEach(char => {
        const cell = document.createElement("div");
        cell.textContent = char;
        matrixDiv.appendChild(cell);
    });

    // Show the preprocessed text
    document.getElementById("preprocessedText").textContent = processedText;

    // Show how each pair is processed
    let pairs = "";
    let encryptedText = "";

    for (let i = 0; i < processedText.length; i += 2) {
        const char1 = processedText[i];
        const char2 = processedText[i + 1];
        const encryptedPair = processPair(matrix, char1, char2);
        encryptedText += encryptedPair;

        pairs += `Pair: ${char1}${char2} → Encrypted: ${encryptedPair}<br>`;
    }

    document.getElementById("pairDetails").innerHTML = pairs;

    // Show the final encrypted text
    document.getElementById("encryptedText").textContent = encryptedText;
}

document.getElementById("demoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const key = document.getElementById("key").value;
    const plaintext = document.getElementById("plaintext").value;

    if (key && plaintext) {
        visualizeCipher(key, plaintext);
    }
});
