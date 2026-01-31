// Points for fingers
const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

// Drawing function for Handpose
export const drawHand = (predictions, ctx) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const landmarks = prediction.landmarks;

            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j];
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                    const firstJointIndex = fingerJoints[finger][k];
                    const secondJointIndex = fingerJoints[finger][k + 1];

                    ctx.beginPath();
                    ctx.moveTo(
                        landmarks[firstJointIndex][0],
                        landmarks[firstJointIndex][1]
                    );
                    ctx.lineTo(
                        landmarks[secondJointIndex][0],
                        landmarks[secondJointIndex][1]
                    );
                    ctx.strokeStyle = "plum";
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }

            for (let i = 0; i < landmarks.length; i++) {
                const x = landmarks[i][0];
                const y = landmarks[i][1];
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 3 * Math.PI);
                ctx.fillStyle = "indigo";
                ctx.fill();
            }
        });
    }
};

// Color map for COCO-SSD object classes
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

const getColor = (className) => {
    return colorMap[className] || colorMap.default;
};

// Drawing function for COCO-SSD
export const drawRect = (predictions, ctx) => {
    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const className = prediction.class;
        const score = prediction.score;

        if (score > 0.5) {
            const color = getColor(className);

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.fillStyle = color;
            ctx.font = 'bold 16px Arial';

            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.stroke();

            const label = `${className} ${(score * 100).toFixed(0)}%`;
            const textWidth = ctx.measureText(label).width;
            const textHeight = 20;

            ctx.fillRect(
                x,
                y > textHeight ? y - textHeight : y,
                textWidth + 10,
                textHeight
            );

            ctx.fillStyle = 'black';
            ctx.fillText(
                label,
                x + 5,
                y > textHeight ? y - 5 : y + 15
            );
        }
    });
};
