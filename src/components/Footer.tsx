import { Link } from "react-router-dom";
import { MessageSquare, Shield, FileText, Youtube, Award } from "lucide-react";
import { Button } from "./ui/button";
import { siteConfig } from "@/config/site";
import havenLogo from "@/assets/haven-logo.png";
import { FaReddit, FaTiktok } from "react-icons/fa";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-card border-t border-primary/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={havenLogo} alt="HavenRP" className="h-16 w-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              {siteConfig.serverTagline}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Rules
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Apply
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-secondary">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={siteConfig.discordInvite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Discord Server
                </a>
              </li>
              <li>
                <Link to="/staff" className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Staff Team
                </Link>
              </li>
              <li>
                <Link to="/rules" className="text-sm text-muted-foreground hover:text-secondary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Server Rules
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">Get Started</h4>
            <Button
              className="w-full bg-gradient-purple-blue hover:shadow-neon-purple transition-all duration-300"
              asChild
            >
              <a href={`fivem://connect/${siteConfig.fivemConnect}`}>
                Connect Now
              </a>
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {siteConfig.serverName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {siteConfig.reddit && (
                <a
                  href={siteConfig.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Reddit"
                >
                  <FaReddit className="w-5 h-5" />
                </a>
              )}
              {siteConfig.tiktok && (
                <a
                  href={siteConfig.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5" />
                </a>
              )}
              {siteConfig.youtube && (
                <a
                  href={siteConfig.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {siteConfig.medal && (
                <a
                  href={siteConfig.medal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Medal"
                >
                  <Award className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
              FiveM Roleplay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
