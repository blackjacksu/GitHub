"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Mode, QuizQuestion } from "@/lib/types";
import { saveMode } from "@/lib/mode-storage";

type ModeCard = Pick<Mode, "id" | "name" | "tagline" | "description" | "homeSource">;

export function ModeSelector({
  quiz,
  modes,
}: {
  quiz: QuizQuestion[];
  modes: ModeCard[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const answered = Object.keys(answers).length;
  const done = answered === quiz.length;

  const ranking = useMemo(() => {
    const scores: Record<string, number> = {};
    for (const mode of modes) scores[mode.id] = 0;

    quiz.forEach((question) => {
      const choice = answers[question.id];
      if (choice === undefined) return;
      const option = question.options[choice];
      for (const [modeId, points] of Object.entries(option.weights)) {
        scores[modeId] = (scores[modeId] ?? 0) + points;
      }
    });

    return modes
      .map((mode) => ({ mode, score: scores[mode.id] ?? 0 }))
      .sort((a, b) => b.score - a.score);
  }, [answers, modes, quiz]);

  function choose(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setStep((prev) => Math.min(prev + 1, quiz.length - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (showAll) {
    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">All four modes.</p>
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="text-sm text-brick underline underline-offset-4"
          >
            Take the four questions instead
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {modes.map((mode) => (
            <ModeResultCard key={mode.id} mode={mode} />
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    const [best, ...rest] = ranking;
    const runnerUp = rest.find((entry) => entry.score < best.score) ?? rest[0];

    return (
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-brick">
          Closest match
        </p>
        <div className="mt-4">
          <ModeResultCard mode={best.mode} primary />
        </div>

        {runnerUp && (
          <div className="mt-8">
            <p className="text-sm text-muted">
              You were close to <strong>{runnerUp.mode.name}</strong> too. These
              aren&rsquo;t boxes — read both and take whichever describes the
              life you want.
            </p>
            <div className="mt-4">
              <ModeResultCard mode={runnerUp.mode} />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <button
            type="button"
            onClick={restart}
            className="text-brick underline underline-offset-4"
          >
            Answer again
          </button>
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-muted underline underline-offset-4 hover:text-brick"
          >
            Show me all four
          </button>
        </div>
      </div>
    );
  }

  const question = quiz[step];
  const selected = answers[question.id];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {quiz.map((q, index) => (
            <span
              key={q.id}
              aria-hidden
              className={`h-1.5 w-8 rounded-full transition ${
                answers[q.id] !== undefined
                  ? "bg-brick"
                  : index === step
                    ? "bg-muted/60"
                    : "bg-line"
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-muted">
            {step + 1} of {quiz.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-sm text-muted underline underline-offset-4 hover:text-brick"
        >
          Skip, show me all four
        </button>
      </div>

      <div
        className={`mt-8 rounded-xl border p-6 sm:p-8 ${
          question.fork
            ? "border-brick/40 bg-bricksoft"
            : "border-line bg-surface"
        }`}
      >
        {question.fork && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brick">
            The fork
          </p>
        )}
        <h2
          className={`font-serif font-semibold tracking-tight ${
            question.fork ? "mt-3 text-3xl" : "text-2xl"
          }`}
        >
          {question.prompt}
        </h2>
        {question.note && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {question.note}
          </p>
        )}

        <div className="mt-6 grid gap-2">
          {question.options.map((option, index) => (
            <button
              key={option.label}
              type="button"
              onClick={() => choose(question.id, index)}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition hover:border-brick hover:text-brick ${
                selected === index
                  ? "border-brick bg-surface text-brick"
                  : "border-line bg-surface"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          className="mt-5 text-sm text-muted underline underline-offset-4 hover:text-brick"
        >
          Back
        </button>
      )}
    </div>
  );
}

function ModeResultCard({
  mode,
  primary = false,
}: {
  mode: ModeCard;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        primary ? "border-brick bg-bricksoft" : "border-line bg-surface"
      }`}
    >
      <h3 className="font-serif text-2xl font-semibold tracking-tight">
        {mode.name}
      </h3>
      <p className="mt-1 text-sm text-brick">{mode.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {mode.description}
      </p>
      <p className="mt-4 text-sm">
        <span className="text-muted">Home comes from: </span>
        <span className="font-medium">{mode.homeSource}</span>
      </p>
      <Link
        href={`/mode/${mode.id}`}
        onClick={() => saveMode(mode.id)}
        className="mt-5 inline-flex rounded-lg bg-brick px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        See this Boston
      </Link>
    </div>
  );
}
