import { CreateContestForm } from '@/components/admin/CreateContestForm';

export default function NewContestPage() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Шинэ тэмцээн</h1>
        <p className="text-sm text-slate-500 mt-1">Тэмцээний нэр, тайлбар оруулна уу</p>
      </div>

      <CreateContestForm />
    </div>
  );
}
