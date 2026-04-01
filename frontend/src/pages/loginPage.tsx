export const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/github';
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="mb-6 text-2xl font-bold text-white">The Gateway</h1>
        <button 
          onClick={handleLogin}
          className="flex items-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
        >
          <span>Login with GitHub</span>
        </button>
      </div>
    </div>
  );
};