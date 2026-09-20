import type { ExamDefinition } from "@/lib/exam-types";

// machine-assisted translations, not yet verified by a native-speaking
// math educator. Do not treat as production-ready instructional copy.
export const GRADE11_REAL_NUMBERS_QUICK_CHECK: ExamDefinition = {
  id: "grade11-real-numbers-quick-check",
  title: {
    si: "ඉක්මන් පරීක්ෂාව — සැබෑ සංඛ්‍යා",
    ta: "விரைவு சோதனை — மெய் எண்கள்",
  },
  steps: [
    {
      id: "step-1-integer-arithmetic",
      title: {
        si: "පූර්ණ සංඛ්‍යා ගණිතය",
        ta: "முழு எண் கணிதம்",
      },
      prompt: {
        si: "අගය සොයන්න: (−5) + 3 × (−2)",
        ta: "மதிப்பைக் காணவும்: (−5) + 3 × (−2)",
      },
      maxPoints: 2,
      hintPenaltyPercent: 25,
      hintText: {
        si: "ක්‍රියාකාරී පිළිවෙළ අනුගමනය කරන්න — පළමුව ගුණ කිරීම, පසුව එකතු කිරීම.",
        ta: "செயல்பாட்டு வரிசையைப் பின்பற்றவும் — முதலில் பெருக்கல், பின் கூட்டல்.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "-5 + 3 * -2", epsilon: 0.01 },
    },
    {
      id: "step-2-recurring-decimal",
      title: {
        si: "පුනරාවර්තන දශම භාග ලෙස ලියන්න",
        ta: "மீள் தசமத்தை பின்னமாக எழுதவும்",
      },
      prompt: {
        si: "පුනරාවර්තන දශමය 0.333... භාගයක් ලෙස ලියන්න.",
        ta: "மீள் தசமமான 0.333... ஐ பின்னமாக எழுதவும்.",
      },
      maxPoints: 3,
      hintPenaltyPercent: 25,
      hintText: {
        si: "සෑම පුනරාවර්තන දශමයක්ම ග්‍රහණය කළ හැකි යුතුම්‍ය සංඛ්‍යාවකි — 0.333... = 1/3.",
        ta: "ஒவ்வொரு மீள் தசமமும் விகிதமுறு எண் — 0.333... = 1/3.",
      },
      validator: { kind: "numeric-tolerance", expectedExpression: "1/3", epsilon: 0.01 },
    },
  ],
};
