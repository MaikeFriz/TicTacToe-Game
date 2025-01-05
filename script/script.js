let fields = [
    null, null, null,
    null, null, null,
    null, null, null,
];

let currentPlayer = 'circle'; // Start mit Kreis

function render() {
    let contentDiv = document.getElementById('content');
    let tableHTML = '<table id="gameTable">';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            let className = '';

            if (fields[index] === 'circle') {
                symbol = generateCircleSVG();
                className = 'o';
            } else if (fields[index] === 'cross') {
                symbol = generateXSVG();
                className = 'x';
            }

            // Onclick-Event für leere Felder hinzufügen
            tableHTML += `
                <td class="${className}" onclick="handleClick(${index}, this)">
                    ${symbol}
                </td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    contentDiv.innerHTML = tableHTML;
}

function handleClick(index, element) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;
        element.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateXSVG();
        element.onclick = null;

        if (checkGameOver()) {
            return; // Spiel beendet
        }

        currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }
}

function checkGameOver() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
        [0, 4, 8], [2, 4, 6],           // Diagonalen
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(a, b, c);
            return true;
        }
    }
    return false;
}

function drawWinningLine(a, b, c) {
    const table = document.getElementById('gameTable');
    const cells = table.getElementsByTagName('td');
    const startCell = cells[a];
    const endCell = cells[c];

    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none"; // Keine Interaktion mit dem SVG

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "4");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
    document.body.appendChild(svg);
}

function generateCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#03ADE7" 
                stroke-width="8" 
                stroke-dasharray="0 282.6" 
                stroke-linecap="round" 
                style="animation: fillCircle 2s ease-in-out forwards;">
            </circle>
            <style>
                @keyframes fillCircle {
                    to {
                        stroke-dasharray: 282.6 0;
                    }
                }
            </style>
        </svg>
    `;
}

function generateXSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line 
                x1="85" 
                y1="15" 
                x2="15" 
                y2="85" 
                stroke="#FEC000" 
                stroke-width="8" 
                stroke-linecap="round" 
                stroke-dasharray="98" 
                stroke-dashoffset="98" 
                style="animation: drawLine1 1s ease-in-out forwards;">
            </line>
            <line 
                x1="15" 
                y1="15" 
                x2="85" 
                y2="85" 
                stroke="#FEC000" 
                stroke-width="8" 
                stroke-linecap="round" 
                stroke-dasharray="98" 
                stroke-dashoffset="98" 
                style="animation: drawLine2 1s ease-in-out forwards;">
            </line>
            <style>
                @keyframes drawLine1 {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes drawLine2 {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                line:nth-of-type(2) {
                    animation-delay: 1s;
                }
            </style>
        </svg>
    `;
}


function restartGame(){
    fields = [
        null, null, null,
        null, null, null,
        null, null, null,
    ];
    render();
}
