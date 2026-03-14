"use client";

import { useState } from "react";
import { Plus, Loader2, XCircle, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProblemFormSchema,
  type CreateProblemFormInput,
} from "@/lib/schemas/contest.schema";
import { useAdmin } from "@/hooks/useAdmin";
import type { Problem, ApiResponse } from "@/lib/types";

const INPUT_CLS =
  "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500 placeholder:text-slate-600";
const INPUT_ERR_CLS =
  "w-full bg-white/[0.04] border border-red-500/50 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-red-500 placeholder:text-slate-600";

interface ProblemsTabProps {
  readonly contestId: number;
  readonly initialProblems: readonly Problem[];
}

export function ProblemsTab({ contestId, initialProblems }: ProblemsTabProps) {
  const { authFetch } = useAdmin();
  const [problems, setProblems] = useState<readonly Problem[]>(initialProblems);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProblemFormInput>({
    resolver: zodResolver(createProblemFormSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (data: CreateProblemFormInput) => {
    const res = await authFetch<Problem>(
      `/api/contests/${contestId}/problems`,
      {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          max_points: 100,
          sort_order: problems.length,
        }),
      },
    );
    if (res.success && res.data) {
      setProblems((prev) => [...prev, res.data!]);
    }
    setShowForm(false);
    reset();
  };

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const onDelete = async (problemId: number) => {
    setDeletingId(problemId);
    try {
      const res = await authFetch(
        `/api/contests/${contestId}/problems/${problemId}`,
        {
          method: "DELETE",
        },
      );
      if (res.success) {
        setProblems((prev) => prev.filter((p) => p.id !== problemId));
      }
    } catch {
      // network error — ignore
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Бодлогууд</h2>
          <span className="text-xs font-bold text-slate-500 bg-white/[0.04] px-2.5 py-1 rounded-lg">
            {problems.length}
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors cursor-pointer"
        >
          <Plus size={15} /> Бодлого нэмэх
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Бодлогын нэр
            </label>
            <input
              {...register("title")}
              className={errors.title ? INPUT_ERR_CLS : INPUT_CLS}
              placeholder="Binary Search, Dynamic Programming..."
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>
          <p className="text-xs text-slate-600">Бодлого бүр 0–100 оноотой.</p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}{" "}
              Нэмэх
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="inline-flex items-center gap-2 border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-slate-200 font-semibold px-5 py-2.5 rounded-xl text-sm bg-transparent cursor-pointer transition-colors"
            >
              Болих
            </button>
          </div>
        </form>
      )}

      {problems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
          <Hash size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Бодлого нэмээгүй байна</p>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((p, i) => (
            <div
              key={p.id}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 hover:border-white/[0.12] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xs font-black text-cyan-400">
                  {i + 1}
                </span>
                <h3 className="font-bold text-white">{p.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-lg ring-1 ring-inset ring-cyan-500/20">
                  {p.max_points} оноо
                </span>
                <button
                  onClick={() => onDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-red-400/40 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Устгах"
                >
                  {deletingId === p.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <XCircle size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
