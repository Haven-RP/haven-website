import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import pageBg from "@/assets/page-bg.png";

const Rules = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const rulesSections = [
    {
      id: "introduction",
      title: "Welcome to Haven RP Server",
      rules: [
        "To ensure an immersive, respectful, and high-quality roleplay experience, all players must adhere to the following rules.",
        "Violations will result in administrative actions based on severity and frequency.",
      ],
    },
    {
      id: "basic",
      title: "0. Basic Requirements and TOS Adherence",
      rules: [
        "0.1 Microphone - To play on this server, you must have a working mic to interact in game.",
        "0.2 Naming Conventions - Your character's name must be realistic, cannot break GTA TOS, and cannot break decency guidelines. Inappropriate names will be manually reviewed by staff.",
        "0.3 Streamer Rules - Players streaming on Twitch.tv, Kick.com, YouTube.com or any other streaming service must additionally obey those site's TOS.",
        "0.4 Recording - Body cams (OBS or Medal.tv) must be used at all times.",
        "0.5 The Golden Rule - Treat others the way you would like to be treated. (Don't be stupid, stupid)",
      ],
    },
    {
      id: "core",
      title: "1. Core Roleplay Rules",
      rules: [
        "1.1 Character Separation - You may create multiple characters with distinct backgrounds. Sharing items, money, vehicles, or knowledge between characters is prohibited.",
        "1.2 Metagaming - Do not use OOC information to influence IC actions. This includes streams, Discord DMs, server logs, or voice chats.",
        "1.3 Powergaming - Avoid forcing RP actions without allowing response. Do not exploit unrealistic game mechanics.",
        "1.4 Fail RP - Breaking immersion or acting unrealistically is not allowed (e.g., ignoring gunshot wounds, sprinting after being tased).",
        "1.5 Value of Life - Your character must value their life at all times. Comply when at a clear disadvantage unless you have a justified reason.",
        "1.6 Fear RP - Demonstrate realistic fear for your character's safety. Do not draw weapons when directly threatened unless context supports it.",
        "1.7 Combat Logging - Logging out to evade RP consequences (arrest, combat, death) is prohibited.",
        "1.8 Maturity and IC Age Restrictions - All characters must be 18+ IC. All players must exhibit maturity to follow rules.",
        "1.9 The New Player Title - New players have 24 hours of play time or 1 week OOC (up to 72 hours) before losing new player status.",
      ],
    },
    {
      id: "interactions",
      title: "2. Interactions with Others",
      rules: [
        "2.1 Respect and Decency - Racism, sexism, homophobia, hate speech, or personal attacks are strictly prohibited IC and OOC. This includes rage baiting. May be waived with prior OOC consent from ALL involved players and witnesses.",
        "2.2 Consent-Based RP - Torture, ERP, or intense RP requires prior OOC consent from all involved players and witnesses. If consent is revoked, RP must end immediately.",
        "2.3 Stream Sniping and Harassment - Using livestreams for IC information or to manipulate players is forbidden. Do not target, stalk, or harass players OOC.",
        "2.4 The Meaning of Consent - Consent frees parties from OOC consequences as long as RP remains IC. A safe word must be agreed upon before controversial RP.",
        "2.5 Female Friendliness - Cat-calling, harassment, unwanted interaction, and threats against female players are not tolerated. OOC threats always result in Tier 4 infraction.",
      ],
    },
    {
      id: "crime",
      title: "3. Crime and Law Enforcement RP",
      rules: [
        "3.1 Criminal Roleplay - Criminal activities must be purposeful, immersive, and consistent with your character. Senseless violence or provoking police without reason is Fail RP.",
        "3.2 Police RP - Law enforcement must act professionally per SOPs. Use of force should follow reasonable escalation.",
        "3.3 Hostage Situations - Hostages must be real, consenting players with clear purpose and proper escalation.",
        "3.4 EMS RP - Respect medical RP scenarios and allow medics to perform duties. Self-reviving or skipping injury RP is not permitted.",
      ],
    },
    {
      id: "vehicle",
      title: "4. Vehicle and Driving RP",
      rules: [
        "4.1 Realistic Driving - Follow traffic laws when appropriate. Reckless driving and treating vehicles as indestructible is Fail RP.",
        "4.2 Vehicle Theft and Chop Shops - Stealing emergency/government vehicles requires high-level planning and RP justification. Chop Shop RP must involve more than driving to a location.",
      ],
    },
    {
      id: "economy",
      title: "5. Economy and Item Use",
      rules: [
        "5.1 Grinding and Farming - Avoid robotic, repetitive behavior. Roleplay your job or means of income.",
        "5.2 Scamming and Robbery - Scamming is allowed if IC and doesn't target new players. Robberies must follow cooldowns and escalation rules.",
      ],
    },
    {
      id: "property",
      title: "6. Property and Business Ownership",
      rules: [
        "6.1 Property Limits - One residence per character unless staff approved. Inactivity beyond two months may result in revocation.",
        "6.2 Business Ownership - Businesses must be run realistically and engage the community. Staff may audit or revoke inactive businesses.",
        "6.3 Staff Ownership Limits - No more than 50% of any business type may be staff-owned at any time.",
      ],
    },
    {
      id: "creators",
      title: "7. Content Creator Guidelines",
      rules: [
        "7.1 Streamers and Video Creators - Must follow all server rules. Do not create drama or RP events solely for views.",
        "7.2 No OOC Stream Commentary - Remain in character while streaming. Coordinating in-game actions through chat is metagaming.",
      ],
    },
    {
      id: "technical",
      title: "8. Technical Rules",
      rules: [
        "8.1 Exploits and Glitches - Any form of exploiting bugs or unintended mechanics is forbidden. Report bugs to staff immediately.",
        "8.2 Modding, Cheating, and Third-Party Tools - External programs providing unfair advantage result in permanent ban.",
      ],
    },
    {
      id: "infractions",
      title: "9. Infraction System",
      rules: [
        "Tier 1 (Minor - 1 Point): Fail RP, accidental metagaming, non-immersive driving",
        "Tier 2 (Moderate - 3 Points): Powergaming, Fear RP violations, minor OOC disrespect",
        "Tier 3 (Severe - 6 Points): Combat logging, harassment, stream sniping",
        "Tier 4 (Critical - 10 Points): Hacking, doxxing, repeated Tier 3 violations",
        "Point Thresholds: 15pts = 24hr ban, 20pts = 3-day ban, 25pts = 7-day ban, 30pts = 14-day ban, 40pts = Permanent ban (appealable)",
        "Points decay after 60 days of clean behavior. Staff may adjust based on context.",
      ],
    },
    {
      id: "whitelisted",
      title: "10. Whitelisted Items",
      rules: [
        "Whitelisted items are unavailable without prior permission from server administration in conjunction with a whitelisted profession.",
        "Refer to the database for the current list of whitelisted items.",
      ],
    },
    {
      id: "blacklisted",
      title: "11. Blacklisted Items",
      rules: [
        "Certain items are strictly prohibited from use, possession, or distribution.",
        "Attempting to obtain, use, or trade blacklisted items will result in disciplinary action.",
        "Refer to the database for the current list of blacklisted items.",
      ],
    },
    {
      id: "appeals",
      title: "12. Appeals and Reporting",
      rules: [
        "Appeals may be submitted through the ticketing system or Discord.",
        "All reports must include evidence (screenshots, clips, logs, timestamps).",
        "Appeals must include bodycam footage (video from your recording software).",
        "Respect the appeals process. Harassment of staff or spamming appeals will result in denial.",
      ],
    },
    {
      id: "staff",
      title: "13. Staff Conduct and Abuse of Power",
      rules: [
        "13.1 Staff Accountability - All staff must act with integrity, fairness, and professionalism. Staff follow the same rules as players.",
        "13.2 Abuse of Power - Staff abuse (unfair punishments, favoritism, leaking info, using tools for personal gain) will not be tolerated.",
        "13.3 Reporting Staff Misconduct - Report suspected abuse through ticketing system. All reports investigated confidentially. Retaliation is prohibited.",
      ],
    },
    {
      id: "glossary",
      title: "14. Glossary",
      rules: [
        "IC (In-Character): Actions/words as your character",
        "OOC (Out-of-Character): Real-world conversation outside RP",
        "Metagaming: Using OOC knowledge in IC situations",
        "Powergaming: Forcing outcomes or using game systems unfairly",
        "Fail RP: Breaking realism or immersion",
        "Fear RP: Not showing appropriate fear in dangerous situations",
        "Combat Logging: Disconnecting to avoid consequences",
        "ERP: Erotic Roleplay (requires consent)",
        "SOP: Standard Operating Procedure",
        "Value of Life: Rule requiring characters behave as though they value living",
      ],
    },
    {
      id: "phrases",
      title: "15. Phrases Used To Remain In Character",
      rules: [
        "Flying In/Flying Out: Joining/Leaving Server",
        "City: Server",
        "Head Popped: Game Crashed",
        "In My Head: Tabbed Out/AFK",
        "Body Cam: Recording",
        "Tsunami: Server Restart",
        "Flex Muscle: Specific Key on Keyboard",
        "Eyes: Screen / In My Eyes: What I see",
        "Voice box: Mic or voice settings",
        "Prayed: Kick or ban",
        "Government: Staff members / Government Laws: Server rules",
        "Pockets: Your Inventory",
        "At the airport: In queue",
        "Aliens/Wizards: Modders",
        "Months in prison: IRL Minutes",
        "Cashapp: ID in game or phone number",
        "Facebook Live: Live Streaming",
        "Headache: Lagging or screen freezing",
        "Email: Discord Message",
        "Surveillance: Checking Medal/Clips",
        "Fly out and Fly back in: Reconnect",
        "Voices inside your head: Twitch chat",
        "Brain: IRL",
        "Locals: NPCs",
        "Go to Sleep: Logging off for the night",
        "Meditating: AFK",
      ],
    },
  ];

  const filteredSections = rulesSections.map(section => ({
    ...section,
    rules: section.rules.filter(rule =>
      rule.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.rules.length > 0);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${pageBg})` }}
    >
      
      <div className="relative z-10">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center mb-8">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
              <span className="text-neon-cyan">Server </span>
              <span className="text-neon-magenta">Rules</span>
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Read and follow all rules to enjoy your time on Haven
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-7xl">

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-black/50 backdrop-blur-sm border-primary/30 focus:border-primary rounded-full"
              />
            </div>
          </div>





          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-5 sticky top-24">
                <h3 className="font-heading font-bold text-base mb-3 text-primary">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {rulesSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-xs text-muted-foreground hover:text-primary transition-colors py-1.5 px-2 rounded hover:bg-white/5"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>


            {/* Rules Content */}
            <div className="lg:col-span-4 space-y-6">
              {filteredSections.map((section) => (
                <div key={section.id} id={section.id} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 scroll-mt-24">
                  <h2 className="text-xl font-heading font-bold mb-4 text-primary">
                    {section.title}
                  </h2>
                  <ul className="space-y-2.5">
                    {section.rules.map((rule, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span className="text-foreground/90 text-sm">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {filteredSections.length === 0 && (
                <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-12 text-center">
                  <p className="text-muted-foreground">No rules found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </div>
  );
};

export default Rules;
