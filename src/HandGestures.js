import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

// Define "Thumbs Up" Gesture
export const thumbsUpGesture = new GestureDescription('thumbs_up');

// Thumb: No curl, vertical up
thumbsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
thumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.25);
thumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.25);

// Other fingers: Full curl
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    thumbsUpGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    thumbsUpGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}


// Define "Hello" (Open Palm) Gesture
export const helloGesture = new GestureDescription('hello');

// All fingers: No curl
for (let finger of [Finger.Thumb, Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    helloGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Define "Victory" (Love/Peace) Gesture
export const victoryGesture = new GestureDescription('victory');

// Index and Middle: No curl
victoryGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
victoryGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// Others: Curled
victoryGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
victoryGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);
victoryGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
victoryGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);
victoryGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
victoryGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);


export const loveGesture = new GestureDescription('iloveyou');

// Thumb, Index, Pinky: No curl
loveGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
loveGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
loveGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);

// Ring, Middle: Full curl
loveGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
loveGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);


// Define "OK" Gesture
export const okGesture = new GestureDescription('ok');

// Thumb: Allow range of curls/directions
okGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
okGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);

// Index: Curve to form 'O'
okGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);
okGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5);

// Middle, Ring, Pinky: Strictly Extended
for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
    okGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}
