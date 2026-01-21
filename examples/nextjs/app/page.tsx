export default function Home() {
  return (
    <div className="flex items-center justify-center p-4">
      <a
        href={`https://auth.bundleup.io/authorize?client_id=${process.env.NEXT_PUBLIC_BUNDLEUP_CLIENT_ID}&integration_id=slack&redirect_uri=${encodeURIComponent(`http://localhost:3000/callback`)}`}
        className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
      >
        Connect Slack
      </a>
    </div>
  );
}
