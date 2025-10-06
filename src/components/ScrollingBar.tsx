import { siteConfig } from "@/config/site";

export const ScrollingBar = () => {
  const events = siteConfig.newsTicker;

  // Convert UTC dates to local times
  const localizedEvents = events.map((event) => {
    const localDate = new Date(event.date).toLocaleString(); // Converts UTC to client time
    return `${localDate} - ${event.event}`;
  });

  // Combine events to create a seamless scrolling text
  const repeatedText = Array(20).fill(localizedEvents.join(" • ")).join(" • ");

  return (
      <div className="w-full overflow-hidden bg-gradient-neon py-3 mt-12">
        <div className="flex whitespace-nowrap animate-scroll">
        <span className="text-black font-heading font-bold text-2xl tracking-tight">
          {repeatedText}
        </span>
          <span className="text-black font-heading font-bold text-2xl tracking-tight">
          {repeatedText}
        </span>
        </div>
      </div>
  );
};