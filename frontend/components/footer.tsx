import { Github, Linkedin, MessageCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Footer = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="bg-blue-600 text-white p-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-500 transition">
            Made with ❤️
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="bg-gray-900 text-white p-4 rounded-lg shadow-lg w-64 text-center">
          <p className="text-sm italic">
            "Code is like humor. When you have to explain it, it’s bad." - Cory
            House
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <a
              href="https://github.com/rohanghosh01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center"
            >
              <Github className="mr-1 w-5 h-5" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rohan-g11/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center"
            >
              <Linkedin className="mr-1 w-5 h-5" /> LinkedIn
            </a>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Footer;
