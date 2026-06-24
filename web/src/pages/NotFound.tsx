import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold mb-2">404 - Page not found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="cursor-pointer bg-red-400 border-black rounded-lg px-2 py-1 mt-4">Click here to go to Home page</Link>
    </main>
  );
}

export default NotFound;
