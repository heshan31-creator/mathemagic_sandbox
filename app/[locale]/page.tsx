import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/components/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { isLocale, localeStaticParams, type Locale } from "@/lib/i18n";
import { GradeSwitcher } from "@/components/home/grade-switcher";
import { TopicSearch } from "@/components/home/topic-search";
import { ProgressPanel } from "@/components/home/progress-panel";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return localeStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  return buildMetadata({
    locale: localeParam as Locale,
    path: "",
    title: siteConfig.name,
    description: siteConfig.description,
  });
}

const FAQ_ITEMS = [
  {
    q: "Is this aligned to the Sri Lankan syllabus?",
    a: "The content is built around the Grade 10 and Grade 11 syllabus units, with a dedicated curriculum index and each lesson mapped to the source syllabus.",
    open: true,
  },
  {
    q: "Does a student need an account?",
    a: "No. Mathemagic Sandbox is local-first: progress is stored in the browser, so the core practice experience doesn't depend on a backend account.",
  },
  {
    q: "Can students use Sinhala or Tamil?",
    a: "Yes. The same interactive components sit underneath translated content for both Sinhala and Tamil, switchable from the language button in the header.",
  },
  {
    q: "Are O/L papers timed?",
    a: "No. Past papers are untimed, guided practice sessions that use the same step-by-step engine as the daily units.",
  },
];

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const home = `/${locale}`;
  const pageUrl = `${siteConfig.url}${home}`;

  return (
    <div id="top">
      <JsonLd pageTitle={siteConfig.name} pageDescription={siteConfig.description} pageUrl={pageUrl} />

      <section className="mm-hero">
        <div className="mm-container mm-hero-grid">
          <div>
            <div className="mm-eyebrow">
              <span>✦</span> Interactive Sri Lankan Mathematics
            </div>
            <h1>
              Understand maths.
              <br />
              <span className="mm-accent">Step by step.</span>
            </h1>
            <p>
              Learn the Grade 10 &amp; 11 syllabus through visual explanations, guided practice and
              interactive O/L questions — designed to work smoothly on a phone.
            </p>
            <div className="mm-hero-actions">
              <Link className="mm-primary" href={`${home}#curriculum`}>
                Explore the curriculum →
              </Link>
              <Link className="mm-secondary" href={`${home}#papers`}>
                Practice O/L papers
              </Link>
            </div>
            <div className="mm-hero-meta">
              <span>
                <strong>32</strong> Grade 10 units
              </span>
              <span>
                <strong>25</strong> Grade 11 units
              </span>
              <span>
                <strong>2 languages</strong> ready
              </span>
            </div>
          </div>

          {/* Statically optimized Hero Illustration — CLS safe */}
          <div className="flex justify-center items-center w-full">
            <Image
              src="/hero-illustration.svg"
              alt="Interactive Mathematics Sandbox"
              width={500}
              height={400}
              priority
              className="w-full h-auto max-w-md"
            />
          </div>
        </div>
      </section>

      <div className="mm-trust">
        <div className="mm-container mm-trust-grid">
          <div className="mm-trust-item">
            <strong>SSG-ready</strong>
            <span>Fast static pages</span>
          </div>
          <div className="mm-trust-item">
            <strong>Offline-first</strong>
            <span>Progress in your browser</span>
          </div>
          <div className="mm-trust-item">
            <strong>Step-by-step</strong>
            <span>Guided problem solving</span>
          </div>
          <div className="mm-trust-item">
            <strong>සිං · தமிழ்</strong>
            <span>Bilingual-friendly architecture</span>
          </div>
        </div>
      </div>

      <section className="mm-section" id="progress" style={{ paddingBottom: 20 }}>
        <div className="mm-container">
          <div className="mm-section-head">
            <div>
              <div className="mm-kicker">Continue learning</div>
              <h2>Pick up where you left off.</h2>
              <p className="mm-section-intro">
                Saved on this device — no account needed. Shows your 8 most recently opened
                units and past papers.
              </p>
            </div>
          </div>
          <ProgressPanel />
        </div>
      </section>

      <section className="mm-section" id="curriculum" style={{ paddingTop: 20 }}>
        <div className="mm-container">
          <div className="mm-section-head">
            <div>
              <div className="mm-kicker">Curriculum</div>
              <h2>
                Choose your grade.
                <br />
                Build your confidence.
              </h2>
              <p className="mm-section-intro">
                One consistent learning system from unit guides to exam-style practice. The content
                model is ready to scale to more grades without changing the core learning engine.
              </p>
            </div>
            <Link href={`${home}#learn`} className="mm-text-link">
              See how learning works →
            </Link>
          </div>

          <GradeSwitcher locale={locale} />
        </div>
      </section>

      <section className="mm-section mm-feature-band" id="learn">
        <div className="mm-container mm-feature-grid">
          <div className="mm-feature-copy">
            <div className="mm-kicker" style={{ color: "#e1eebc" }}>
              Mathemagic engine
            </div>
            <h2>Less reading. More doing.</h2>
            <p>
              Every topic becomes a sequence of small, verifiable actions. Students see why an answer
              works — not just whether it is right.
            </p>
            <div className="mm-pill-row">
              <span className="mm-pill">Mafs / JSXGraph</span>
              <span className="mm-pill">KaTeX</span>
              <span className="mm-pill">mathjs</span>
              <span className="mm-pill">Zustand</span>
              <span className="mm-pill">MDX</span>
            </div>
            <Link className="mm-primary" href={`${home}#tools`}>
              See interactive tools →
            </Link>
          </div>

          <div className="mm-visual-grid">
            <div className="mm-feature-card">
              <div className="mm-feature-icon">∑</div>
              <h3>Guided steps</h3>
              <p>Break O/L questions into intermediate decisions and calculations.</p>
            </div>
            <div className="mm-feature-card">
              <div className="mm-feature-icon">⌁</div>
              <h3>Visual maths</h3>
              <p>Move points, inspect graphs and manipulate diagrams instead of reading static figures.</p>
            </div>
            <div className="mm-feature-card">
              <div className="mm-feature-icon">?</div>
              <h3>Smart hints</h3>
              <p>Escalate support after repeated mistakes without interrupting independent practice.</p>
            </div>
            <div className="mm-feature-card">
              <div className="mm-feature-icon">✓</div>
              <h3>Local progress</h3>
              <p>Save completion and practice history directly on the device.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section" id="tools">
        <div className="mm-container">
          <div className="mm-section-head">
            <div>
              <div className="mm-kicker">Built for learning</div>
              <h2>Tools students can actually use.</h2>
              <p className="mm-section-intro">
                Make the differentiators visible before the student ever opens a lesson.
              </p>
            </div>
          </div>
          <div className="mm-tools-grid">
            <article className="mm-tool-card">
              <span className="mm-tag">INTERACTIVE</span>
              <div className="mm-tool-icon">◫</div>
              <h3>Dynamic diagrams</h3>
              <p>Explore geometry with manipulable shapes, labels, transformations and coordinate systems.</p>
            </article>
            <article className="mm-tool-card">
              <span className="mm-tag">GUIDED</span>
              <div className="mm-tool-icon">→</div>
              <h3>Step-by-step practice</h3>
              <p>Require the correct intermediate idea before moving to the next part of a complex problem.</p>
            </article>
            <article className="mm-tool-card">
              <span className="mm-tag">EXAM READY</span>
              <div className="mm-tool-icon">▣</div>
              <h3>O/L past papers</h3>
              <p>Turn past-paper questions into untimed guided practice, using the same interaction model as lessons.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mm-section" id="papers" style={{ paddingTop: 20 }}>
        <div className="mm-container">
          <div className="mm-section-head">
            <div>
              <div className="mm-kicker">Exam practice</div>
              <h2>Practice the paper — not just the answer.</h2>
              <p className="mm-section-intro">
                Keep past papers inside the same guided learning environment so students can learn
                from every step.
              </p>
            </div>
            <Link className="mm-text-link" href={`${home}/past-papers`}>
              Browse all papers →
            </Link>
          </div>
          <div className="mm-papers">
            <Link className="mm-paper-card" href={`${home}/past-papers`}>
              <div>
                <h3>O/L Mathematics · Past papers</h3>
                <p>Untimed • Guided steps • Topic-friendly practice</p>
              </div>
              <div className="mm-paper-badge">O/L</div>
              <span className="mm-arrow">›</span>
            </Link>
            <Link className="mm-paper-card" href={`${home}/past-papers`}>
              <div>
                <h3>Term tests</h3>
                <p>School-style assessment converted into interactive practice</p>
              </div>
              <div className="mm-paper-badge">TEST</div>
              <span className="mm-arrow">›</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mm-section" style={{ paddingTop: 20 }}>
        <div className="mm-container">
          <div className="mm-section-head">
            <div>
              <div className="mm-kicker">Find a topic</div>
              <h2>Search the maths you need.</h2>
              <p className="mm-section-intro">
                An SEO-friendly topic index doubles as a fast navigation layer for students.
              </p>
            </div>
          </div>
          <TopicSearch />
        </div>
      </section>

      <section className="mm-section" id="faq" style={{ paddingTop: 15 }}>
        <div className="mm-container">
          <div className="mm-section-head">
            <div>
              <div className="mm-kicker">FAQ</div>
              <h2>Clear answers before learning starts.</h2>
            </div>
          </div>
          <div className="mm-faq">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} open={item.open}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}