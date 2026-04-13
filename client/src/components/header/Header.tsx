import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

type THeaderProps = {
  setActiveModal: React.Dispatch<React.SetStateAction<"login" | "register">>
}

const Header = ({ setActiveModal }: THeaderProps) => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div className="text-2xl font-black text-purple-600 tracking-tight">
        CI/CD VISUALIZER
      </div>
        <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Вийти
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setActiveModal('login')}
              className="text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors"
            >
              Увійти
            </button>
            <button
              onClick={() => setActiveModal('register')}
              className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition-colors"
            >
              Зареєструватися
            </button>
          </>
        )}
      </div>
    </nav>
  )
};

export default Header;