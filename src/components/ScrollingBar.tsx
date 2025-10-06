import { siteConfig } from "@/config/site";

export const ScrollingBar = () => {
  const text = siteConfig.serverName;
  
  // Repeat the text multiple times to create seamless scrolling
  const repeatedText = Array(20).fill(text).join(" • ");

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
