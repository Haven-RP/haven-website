import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface ScrollingBarProps {
    className?: string;
}

export const ScrollingBar = ({ className }: ScrollingBarProps = {}) => {
    const events = siteConfig.newsTicker;

    // Convert UTC dates to local times with timezone shortcodes
    const localizedEvents = events.map((event) => {
        const date = new Date(event.date);

        // Format the date with time and extract timezone name
        const dateString = date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short", // Adds CST, EST, etc.
        });

        return `${dateString} - ${event.event}`;
    });

    // Combine events to create a seamless scrolling text
    const repeatedText = Array(20).fill(localizedEvents.join(" • ")).join(" • ");

    return (
        <div className={cn("w-full overflow-hidden bg-gradient-neon py-3", className)}>
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