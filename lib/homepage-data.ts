export interface CurriculumTopic {
  num: string;
  title: string;
  description: string;
}

export const CURRICULUM: Record<"grade-10" | "grade-11", CurriculumTopic[]> = {
  "grade-10": [
    { num: "01", title: "Perimeter", description: "Measure, compare and apply perimeter rules." },
    { num: "02", title: "Square root", description: "Estimate and calculate square roots." },
    { num: "03", title: "Fractions", description: "Operate confidently with fractions." },
    { num: "04", title: "Binomial expressions", description: "Expand and simplify expressions." },
    { num: "05", title: "Congruence of triangles", description: "Use geometric rules to prove congruence." },
    { num: "06", title: "Area", description: "Apply area relationships to figures." },
    { num: "07", title: "Quadratic expressions", description: "Factor and interpret quadratic forms." },
    { num: "08", title: "Triangles", description: "Reason with angle and side properties." },
  ],
  "grade-11": [
    { num: "01", title: "Algebra & equations", description: "Build fluency with algebraic reasoning." },
    { num: "02", title: "Geometry", description: "Solve multi-step geometric problems." },
    { num: "03", title: "Trigonometry", description: "Connect ratios, angles and diagrams." },
    { num: "04", title: "Graphs & functions", description: "Read and construct mathematical graphs." },
    { num: "05", title: "Statistics", description: "Interpret data and distributions." },
    { num: "06", title: "Probability", description: "Model and reason about chance." },
    { num: "07", title: "Mensuration", description: "Solve surface-area and volume problems." },
    { num: "08", title: "Exam problem solving", description: "Combine skills in O/L-style questions." },
  ],
};

export const ALL_TOPICS = [
  ...CURRICULUM["grade-10"].map((t) => ({ ...t, grade: "Grade 10" as const })),
  ...CURRICULUM["grade-11"].map((t) => ({ ...t, grade: "Grade 11" as const })),
];
