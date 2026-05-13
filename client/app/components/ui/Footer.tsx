import { Link } from "react-router";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/content/logo.png"
                alt="POLLMAN"
                className="w-8 h-8 rounded-2xl object-cover"
              />
              <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">
                POLLMAN
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Create polls, collect feedback, and analyze results in real-time.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <div className="space-y-2">
              <Link
                to="/documentation"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Documentation
              </Link>
              <Link
                to="/about"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                About
              </Link>
              <Link
                to="/terms"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/lalit999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/lalit7363"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/lalitgujar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:gujarlalit79@gmail.com"
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Other Projects */}
          <div className="space-y-4">
            <h3 className="font-semibold">Other Projects</h3>
            <div className="space-y-2">
              <a
                href="https://wdc.lalitgurjar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                WDC Induction Portal <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://l-s-p.lalitgurjar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                Local Service Provider <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://onem-check-box.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                1M Checkbox App <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.lalitgurjar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                Portfolio Website <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://realtime-rider-location-tracting.onrender.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                Rider Location Tracking <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2026 POLLMAN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
