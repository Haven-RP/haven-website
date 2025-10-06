export default function DebugEnv() {
    return (
        <pre>
      {JSON.stringify({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: process.env.NEXT_PUBLIC_SUPABASE_KEY ? '✔️ Loaded' : '❌ Missing',
          nodeEnv: process.env.NODE_ENV,
      }, null, 2)}
    </pre>
    );
}
