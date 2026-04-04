import { AiOutlineLoading } from "react-icons/ai";
const Loading = () => (
  <div className="w-full h-[40vh] flex justify-center items-center">
    <div className="rounded-lg px-6 py-5 flex flex-col items-center gap-2" style={{ background: "#111827", border: "1px solid #1F2937" }}>
      <AiOutlineLoading className="animate-spin text-2xl" style={{ color: "#7C3AED" }} />
      <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Loading...</p>
    </div>
  </div>
);
export default Loading;
