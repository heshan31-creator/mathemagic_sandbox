import type { ExamDefinition } from "@/lib/exam-types";

// TODO: needs native speaker review — all si/ta strings below are
// machine-assisted translations, not yet verified by a native-speaking
// math educator. Do not treat as production-ready instructional copy.
export const OL_2023_P2_Q4: ExamDefinition = {
  id: "ol-2023-paper-2-q4",
  // TODO: needs native speaker review
  title: {
    si: "සම්මිශ්‍ර රූපය — අර්ධ වෘත්තයක් ඉවත් කළ සෘජුකෝණාස්‍රය",
    ta: "கூட்டு உருவம் — அரைவட்டம் நீக்கப்பட்ட செவ்வகம்",
  },
  steps: [
    {
      id: "step-1-radius",
      // TODO: needs native speaker review
      title: { si: "අර්ධ වෘත්තයේ අරය සොයන්න", ta: "அரைவட்டத்தின் ஆரையைக் காணவும்" },
      // TODO: needs native speaker review
      prompt: {
        si: "අර්ධ වෘත්තයේ විෂ්කම්භය සෘජුකෝණාස්‍රයේ පළල වන 14cm ට සමාන වේ. අරය කුමක්ද?",
        ta: "அரைவட்டத்தின் விட்டம் செவ்வகத்தின் அகலமான 14cm க்குச் சமம். ஆரை என்ன?",
      },
      maxPoints: 2,
      hintPenaltyPercent: 25,
      // TODO: needs native speaker review
      hintText: {
        si: "අරය යනු විෂ්කම්භයෙන් අඩක් — දෙනු ලබන පළල 2 කින් බෙදන්න.",
        ta: "ஆரை என்பது விட்டத்தின் பாதி — கொடுக்கப்பட்ட அகலத்தை 2 ஆல் வகுக்கவும்.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "7", epsilon: 0.01 },
    },
    {
      id: "step-2-semicircle-area",
      // TODO: needs native speaker review
      title: { si: "අර්ධ වෘත්තයේ වර්ගඵලය සොයන්න", ta: "அரைவட்டத்தின் பரப்பளவைக் காணவும்" },
      // TODO: needs native speaker review
      prompt: {
        si: "r = 7cm ලෙස ගෙන, අර්ධ වෘත්තයේ වර්ගඵලය ගණනය කරන්න (π ≈ 22/7 භාවිතා කරන්න).",
        ta: "r = 7cm எனக் கொண்டு, அரைவட்டத்தின் பரப்பளவைக் கணக்கிடவும் (π ≈ 22/7 பயன்படுத்தவும்).",
      },
      maxPoints: 3,
      hintPenaltyPercent: 25,
      // TODO: needs native speaker review
      hintText: {
        si: "සම්පූර්ණ වෘත්තයක වර්ගඵලය πr² වේ. අර්ධ වෘත්තය එහි හරියටම අඩකි.",
        ta: "முழு வட்டத்தின் பரப்பளவு πr². அரைவட்டம் அதன் சரியான பாதி.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "22/7 * 7^2 / 2", epsilon: 0.5 },
    },
    {
      id: "step-3-rectangle-area",
      // TODO: needs native speaker review
      title: { si: "සෘජුකෝණාස්‍රයේ වර්ගඵලය සොයන්න", ta: "செவ்வகத்தின் பரப்பளவைக் காணவும்" },
      // TODO: needs native speaker review
      prompt: {
        si: "සෘජුකෝණාස්‍රය 20cm x 14cm වේ. එහි වර්ගඵලය කුමක්ද?",
        ta: "செவ்வகம் 20cm x 14cm ஆகும். அதன் பரப்பளவு என்ன?",
      },
      maxPoints: 2,
      hintPenaltyPercent: 20,
      // TODO: needs native speaker review
      hintText: {
        si: "සෘජුකෝණාස්‍ර වර්ගඵලය = දිග × පළල.",
        ta: "செவ்வகப் பரப்பளவு = நீளம் × அகலம்.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "20 * 14", epsilon: 0.01 },
    },
    {
      id: "step-4-composite-area",
      // TODO: needs native speaker review
      title: { si: "සම්මිශ්‍ර රූපයේ වර්ගඵලය සොයන්න", ta: "கூட்டு உருவத்தின் பரப்பளவைக் காணவும்" },
      // TODO: needs native speaker review
      prompt: {
        si: "ඉතිරි රූපයේ වර්ගඵලය සොයා ගැනීමට සෘජුකෝණාස්‍රයේ වර්ගඵලයෙන් අර්ධ වෘත්තයේ වර්ගඵලය අඩු කරන්න.",
        ta: "மீதமுள்ள உருவத்தின் பரப்பளவைக் காண, செவ்வகத்தின் பரப்பளவிலிருந்து அரைவட்டத்தின் பரப்பளவைக் கழிக்கவும்.",
      },
      maxPoints: 3,
      hintPenaltyPercent: 25,
      // TODO: needs native speaker review
      hintText: {
        si: "අර්ධ වෘත්තය සෘජුකෝණාස්‍රයෙන් ඉවත් කර ඇති බැවින්, පියවර 3 හි ප්‍රතිඵලයෙන් පියවර 2 හි ප්‍රතිඵලය අඩු කරන්න.",
        ta: "அரைவட்டம் செவ்வகத்திலிருந்து நீக்கப்பட்டதால், படி 3 இன் விடையிலிருந்து படி 2 இன் விடையைக் கழிக்கவும்.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "20*14 - 22/7*7^2/2", epsilon: 0.5 },
    },
  ],
};
