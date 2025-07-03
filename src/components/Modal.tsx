// src/components/Modal.tsx


interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function Modal({ title, message, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1f1f1f] border-2 border-[#39ff14] text-white p-6 rounded-2xl shadow-[0_0_30px_#39ff1477] w-[90%] max-w-sm text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-[#39ff14] mb-4 drop-shadow">{title}</h2>
        <p className="mb-6 text-base leading-relaxed text-gray-300">{message}</p>
        <button
          onClick={onClose}
          className="bg-black border-2 border-[#39ff14] text-[#39ff14] px-5 py-2 rounded-lg font-semibold hover:border-red-400 hover:text-red-400 transition-all duration-300 shadow hover:shadow-[0_0_20px_red]"
        >
          🔁 Yana o‘ynash
        </button>

        <div className="absolute -top-3 -right-3">
          <button
            onClick={onClose}
            className="bg-[#39ff14] text-black rounded-full w-7 h-7 font-bold hover:bg-red-500 transition"
            aria-label="Yopish"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

/* Tailwind CSS uchun animatsiya:
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
*/
