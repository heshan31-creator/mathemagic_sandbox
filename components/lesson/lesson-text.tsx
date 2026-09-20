import type { Locale } from "@/lib/i18n";

/**
 * All learner-facing chrome for the lesson engine, in one place so si/ta can
 * never drift apart silently. Mathematical content itself stays in the
 * ExamDefinition — this file is only the surrounding UI vocabulary.
 *
 * TODO: needs native speaker review — these strings follow the register
 * already used in strict-exam-stepper.tsx, but the new ones (progress,
 * completion, lock states) have not been checked by a native-speaking
 * mathematics educator.
 */
export interface LessonText {
  question: string;
  ofTotal: (n: number) => string;
  step: string;
  submit: string;
  nextStep: string;
  finishQuestion: string;
  hint: string;
  dismiss: string;
  correctPlain: string;
  correctWithHint: (pct: number) => string;
  incorrect: (attempts: number) => string;
  unparseable: string;
  answerPlaceholder: string;
  completed: string;
  viewSolution: string;
  collapse: string;
  lockedHint: (previous: number) => string;
  stepsCleared: (steps: number, points: number) => string;
  hintWasUsed: string;
  progressLabel: (done: number, total: number) => string;
  lessonComplete: string;
  lessonCompleteBody: (points: number, max: number) => string;
  restart: string;
  questionAnnounce: (index: number) => string;
}

export const LESSON_TEXT: Record<Locale, LessonText> = {
  si: {
    question: "ප්‍රශ්නය",
    ofTotal: (n) => `ප්‍රශ්න ${n} කින්`,
    step: "පියවර",
    submit: "ඉදිරිපත් කරන්න",
    nextStep: "ඊළඟ පියවර",
    finishQuestion: "ප්‍රශ්නය අවසන් කරන්න",
    hint: "ඉඟිය",
    dismiss: "ඉවත් කරන්න",
    correctPlain: "නිවැරදියි.",
    correctWithHint: (pct) =>
      `නිවැරදියි — නමුත් ඉඟියක් භාවිතා කළ බැවින්, මෙම පියවර ${pct}% කින් අඩුවෙන් ලකුණු ලබා දේ.`,
    incorrect: (attempts) =>
      attempts >= 3
        ? "තවම නිවැරදි නැහැ. පහත ඉඟිය බලන්න."
        : "තවම නිවැරදි නැහැ. නැවත උත්සාහ කරන්න.",
    unparseable: "එය සංඛ්‍යාවක් හෝ ප්‍රකාශනයක් ලෙස කියවිය නොහැක.",
    answerPlaceholder: "උදා: 22/7 හෝ 3.14",
    completed: "සම්පූර්ණයි",
    viewSolution: "විසඳුම බලන්න",
    collapse: "හකුළන්න",
    lockedHint: (previous) => `මෙය විවෘත කිරීමට ප්‍රශ්නය ${previous} සම්පූර්ණ කරන්න.`,
    stepsCleared: (steps, points) => `පියවර ${steps} ක් සම්පූර්ණයි · ලකුණු ${points}`,
    hintWasUsed: "ඉඟියක් භාවිතා කළා",
    progressLabel: (done, total) => `ප්‍රශ්න ${done} / ${total}`,
    lessonComplete: "පාඩම සම්පූර්ණයි",
    lessonCompleteBody: (points, max) => `ඔබ සියලු ප්‍රශ්න සම්පූර්ණ කළා. ලකුණු ${points} / ${max}.`,
    restart: "නැවත උත්සාහ කරන්න",
    questionAnnounce: (index) => `ප්‍රශ්නය ${index} දැන් විවෘතයි.`,
  },
  ta: {
    question: "கேள்வி",
    ofTotal: (n) => `${n} கேள்விகளில்`,
    step: "படி",
    submit: "சமர்ப்பிக்கவும்",
    nextStep: "அடுத்த படி",
    finishQuestion: "கேள்வியை முடிக்கவும்",
    hint: "குறிப்பு",
    dismiss: "நிராகரி",
    correctPlain: "சரி.",
    correctWithHint: (pct) =>
      `சரி — ஆனால் குறிப்பு பயன்படுத்தப்பட்டதால், இந்தப் படிக்கு ${pct}% குறைவாக மதிப்பெண் வழங்கப்படும்.`,
    incorrect: (attempts) =>
      attempts >= 3
        ? "இன்னும் சரியில்லை. கீழே உள்ள குறிப்பைப் பாருங்கள்."
        : "இன்னும் சரியில்லை. மீண்டும் முயற்சிக்கவும்.",
    unparseable: "அதை எண் அல்லது கணிதக் கூற்றாகப் படிக்க முடியவில்லை.",
    answerPlaceholder: "எ.கா: 22/7 அல்லது 3.14",
    completed: "முடிந்தது",
    viewSolution: "தீர்வைப் பார்க்க",
    collapse: "மடக்கு",
    lockedHint: (previous) => `இதைத் திறக்க கேள்வி ${previous} ஐ முடிக்கவும்.`,
    stepsCleared: (steps, points) => `${steps} படிகள் முடிந்தது · ${points} மதிப்பெண்`,
    hintWasUsed: "குறிப்பு பயன்படுத்தப்பட்டது",
    progressLabel: (done, total) => `கேள்வி ${done} / ${total}`,
    lessonComplete: "பாடம் முடிந்தது",
    lessonCompleteBody: (points, max) => `எல்லா கேள்விகளையும் முடித்துவிட்டீர்கள். ${points} / ${max} மதிப்பெண்.`,
    restart: "மீண்டும் முயற்சிக்கவும்",
    questionAnnounce: (index) => `கேள்வி ${index} இப்போது திறந்துள்ளது.`,
  },
};
