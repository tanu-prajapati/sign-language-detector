// Color map for different object classes
const colorMap = {
    person: '#FF6B6B',      // Red
    hand: '#4ECDC4',        // Teal
    cell_phone: '#45B7D1',  // Blue
    bottle: '#96CEB4',      // Green
    cup: '#FFEAA7',         // Yellow
    laptop: '#DDA0DD',      // Plum
    keyboard: '#98D8C8',    // Mint
    mouse: '#F7DC6F',       // Gold
    book: '#BB8FCE',        // Purple
    default: '#FF6B6B'      // Default red
};

// Function to get color for a class
const getColor = (className) => {
    return colorMap[className] || colorMap.default;
};

// Draw rectangles for COCO-SSD predictions
export const drawRect = (predictions, ctx) => {
    predictions.forEach(prediction => {
        // Extract prediction info
        const [x, y, width, height] = prediction.bbox;
        const className = prediction.class;
        const score = prediction.score;

        // Only draw if confidence is above threshold
        if (score > 0.5) {
            const color = getColor(className);

            // Set styling
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.fillStyle = color;
            ctx.font = 'bold 16px Arial';

            // Draw rectangle
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();

            // Draw label background
            const label = `${className} ${(score * 100).toFixed(0)}%`;
            const textWidth = ctx.measureText(label).width;
            const textHeight = 20;

            ctx.fillRect(
                x,
                y > textHeight ? y - textHeight : y,
                textWidth + 10,
                textHeight
            );

            // Draw label text
            ctx.fillStyle = 'black';
            ctx.fillText(
                label,
                x + 5,
                y > textHeight ? y - 5 : y + 15
            );
        }
    });
};

// Legacy labelMap for sign language (kept for future custom model use)
export const labelMap = {
    1: { name: 'Hello', color: '#FF6B6B' },
    2: { name: 'Thank You', color: '#FFEAA7' },
    3: { name: 'I Love You', color: '#96CEB4' },
    4: { name: 'Yes', color: '#45B7D1' },
    5: { name: 'No', color: '#DDA0DD' },
};
