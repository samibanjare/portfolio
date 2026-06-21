import { useCallback } from "react";

export const useTerminalCommands = (CONTENT, cpu, network, setHistory, setShowRocketGame) => {

  const processCommand = useCallback((cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const [command, ...args] = trimmed.split(/\s+/);
    const arg = args.join(" ");

    let output = [];

    switch (command.toLowerCase()) {
      case "help":
        output = [
          "Available commands:",
          "  help            - Show this help",
          "  ls              - List files",
          "  cat <file>      - View file",
          "  rocket          - Launch Rocket Defense Game",
          "  play rocket     - Launch Rocket Defense Game",
          "  clear           - Clear screen",
          "  whoami          - About me",
          "  neofetch        - Show system info",
          "  metrics         - Live system stats"
        ];
        break;

      case "ls":
        output = ["about.txt  education.txt  skills.txt  experience.txt  interests.txt  contact.txt   projects/"];
        break;

      case "cat":
        if (CONTENT[arg]) {
          output = CONTENT[arg];
        } else {
          output = [`cat: ${arg}: No such file or directory`];
        }
        break;

      case "whoami":
        output = [
            "Hi, I'm Sami Banjare!!",
            "",
            "Final-year B.Tech (Information Technology) student passionate about Artificial Intelligence,",
            "Reinforcement Learning, and autonomous systems.",
            "",
            "I build AI-powered applications and full-stack solutions. Currently exploring intelligent",
            "decision-making systems, multi-agent AI, and LLM applications.",
            "",
            "Type 'cat education', 'cat experience', 'cat skills', 'cat projects', 'cat links' or 'cat contact' to explore more."
        ];
        break;

      case "rocket":
      case "play":
        if (setShowRocketGame) {
          setShowRocketGame(true);
        }
        output = ["🚀 Launching Rocket Defense...", "Game opened successfully."];
        break;

      case "neofetch":
        output = [
          "   ███████╗ █████╗ ███╗   ███╗██╗    ██████╗  █████╗ ███╗   ██╗     ██╗ █████╗ ██████╗ ███████╗",
          "   ██╔════╝██╔══██╗████╗ ████║██║    ██╔══██╗██╔══██╗████╗  ██║     ██║██╔══██╗██╔══██╗██╔════╝",
          "   ███████╗███████║██╔████╔██║██║    ██████╔╝███████║██╔██╗ ██║     ██║███████║██████╔╝█████╗  ",
          "   ╚════██║██╔══██║██║╚██╔╝██║██║    ██╔══██╗██╔══██║██║╚██╗██║██   ██║██╔══██║██╔══██╗██╔══╝  ",
          "   ███████║██║  ██║██║ ╚═╝ ██║██║    ██████╔╝██║  ██║██║ ╚████║╚█████╔╝██║  ██║██║  ██║███████╗",
          "   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝",
          "",
          "                              SAMI BANJARE",
          "                       Full Stack Software Developer",
          "",
          `  OS: Kali Linux Portfolio`,
          `  Host: ${navigator.platform}`,
          `  CPU: ${cpu.current.toFixed(0)}%`,
          `  Network: ↑${(network.current/3).toFixed(1)} MB/s`
        ];
        break;

      case "metrics":
        output = [
          `CPU     : ${cpu.current.toFixed(1)}%`,
          `Network : ↑${(network.current/3).toFixed(1)} MB/s`
        ];
        break;

      case "clear":
        setHistory([]);
        return;
      case "github":
        window.open(CONTENT.links.github, "_blank");
        output = ["Opening GitHub profile..."];
        break;
      case "linkedin":
        window.open(CONTENT.links.linkedin, "_blank");
        output = ["Opening LinkedIn profile..."];
        break;

      default:
        output = [`${command}: command not found. Type 'help'`];
    }
    const flatOutput = Array.isArray(output) ? output.flat() : [output];
    if(!Array.isArray(output)) {
        output = [output];
    }

    setHistory(prev => [...prev, `portfolio@samibanjare:~$ ${trimmed}`, ...flatOutput, ""]);
  }, [CONTENT, cpu, network, setHistory, setShowRocketGame]);

  return { processCommand };
};