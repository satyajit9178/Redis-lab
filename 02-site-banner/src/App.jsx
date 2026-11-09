import { useEffect, useState } from "react"
const API = "http://localhost:3000";


const App = () => {
  const [message,setMessage] = useState(null);
  const [input,setInput] = useState("");
  const[loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const fetchBanner = async()=>{
    try{
      const response = await fetch(`${API}/banner`);
      if(!response.ok) throw new Error("Failed to fetch banner");
      const data = await response.json();

      setMessage(data.message || null);
      setInput(data.message || "");
    }
    catch(err){
       setError(err.message);
    }
  }

  useEffect(()=>{
    fetchBanner();
  },[]);

  const publishBanner=async(e)=>{
     e.preventDefault();
     if(!input.trim()) return;

     setLoading(true);
     setError("");

     try{
        const response = await fetch(`${API}/banner`,{
          method:"POST",
          headers : {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({message:input}),
        });

        if(!response.ok) throw new Error("Failed to publish banner");

        await fetchBanner();
     }catch(err){
        setError(err.message);
     }finally{
      setLoading(false);
     }
  }

  const deleteBanner = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/banner`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete banner");

      setMessage(null);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white" >
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            Redis<span className="text-blue-500">Banner</span>
          </h1>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
            Node.js + Redis
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        {/* Banner Preview */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Live announcement preview
          </h2>

          {message ? (
            <div className="flex items-center justify-between gap-4 rounded-xl bg-blue-600 px-5 py-4 shadow-lg shadow-blue-950/30">
              <p className="font-medium">{message}</p>
              <span className="shrink-0 text-xl">🎉</span>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center">
              <p className="text-slate-400">
                No active announcement
              </p>
            </div>
          )}
        </section>

        {/* Banner Controls */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-2 text-xl font-semibold">
            Manage banner
          </h2>

          <p className="mb-6 text-sm text-slate-400">
            Publish or remove an announcement stored in Redis.
          </p>

          <form onSubmit={publishBanner}>
            <label className="mb-2 block text-sm text-slate-300">
              Announcement message
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your announcement..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-4 text-white outline-none transition focus:border-blue-500"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Processing..." : "Publish banner"}
              </button>

              <button
                type="button"
                onClick={deleteBanner}
                disabled={loading || !message}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete banner
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}
        </section>

      </main>

    </div>
  )
}

export default App

