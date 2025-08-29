 
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">
        AI Interview Assistant
      </h1>

      <p className="text-lg text-gray-700 max-w-2xl mb-6">
        Our desktop app helps students prepare for interviews using powerful AI
        tools. Practice questions, get instant feedback, and improve your
        confidence — all in one place.
      </p>
 
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-purple-800 transition"
      >
        Pay to Unlock App
      </a>

      <div className="mt-10 max-w-lg bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Why Choose Us?
        </h2>
        <ul className="text-gray-600 space-y-2 text-left">
          <li>✔ Practice real interview questions with AI support</li>
          <li>✔ Get instant feedback on your answers</li>
          <li>✔ Improve confidence with mock sessions</li>
          <li>✔ One-time payment, lifetime access</li>
        </ul>
      </div>

      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} AI Interview Assistant | Contact:
        rahulshanisare91@gmail.com
      </footer>
    </div>
  );
}

export default App;
