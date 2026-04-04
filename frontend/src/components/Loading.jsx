import { AiOutlineLoading } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="w-full h-[40vh] flex justify-center items-center flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm flex flex-col items-center gap-3">
        <AiOutlineLoading className="animate-spin text-blue-600 text-3xl" />
        <p className="text-sm font-medium text-slate-600">Loading data...</p>
      </div>
    </div>
  );
};

export default Loading;

