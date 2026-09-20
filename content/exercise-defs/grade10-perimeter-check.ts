import type { ExamDefinition } from "@/lib/exam-types";


export const GRADE10_PERIMETER_QUICK_CHECK: ExamDefinition = {
  id: "grade10-perimeter-quick-check",
  title: {
    si: "ඉක්මන් පරීක්ෂාව — චාප දිග",
    ta: "விரைவு சோதனை — வில் நீளம்",
  },
  steps: [
    {
      id: "step-1-arc-length",
      title: {
        si: "චාප දිග ගණනය කරන්න",
        ta: "வில் நீளத்தைக் கணக்கிடவும்",
      },
      prompt: {
        si: "අරය 7cm සහ කේන්ද්‍රීය කෝණය 90° වන අංශකයක චාප දිග කුමක්ද? (π ≈ 22/7 භාවිතා කරන්න)",
        ta: "ஆரை 7cm மற்றும் மைய கோணம் 90° ஆக உள்ள துண்டின் வில் நீளம் என்ன? (π ≈ 22/7 பயன்படுத்தவும்)",
      },
      maxPoints: 2,
      hintPenaltyPercent: 25,
      hintText: {
        si: "චාප දිග = (θ/360) × 2πr. පළමුව θ/360 අඩු කරන්න, පසුව 2πr වලින් ගුණ කරන්න.",
        ta: "வில் நீளம் = (θ/360) × 2πr. முதலில் θ/360 ஐ எளிமையாக்கி, பின் 2πr ஆல் பெருக்கவும்.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "90/360 * 2 * (22/7) * 7", epsilon: 0.5 },
    },
  ],
};
