import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-6 z-10">
        <div className="max-w-5xl mx-auto text-start flex flex-col lg:flex-row justify-between">
          <div className="mb-6 flex">
            <img src="/kusal-dp.jpg" alt="KD" className="-mb-8 mt-4 lg:mt-0 h-40 lg:h-68 w-auto mx-auto mb-6 rounded-full flex items-center justify-center text-white text-5xl font-bold"/>
            {/* <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold">
              KD
            </div> */}
          </div>
          
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              Kusal Dissanayake
            </h1>
            
            <p className="text-2xl md:text-3xl text-blue-400 mb-6">
              Full Stack Software Engineer
            </p>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Software engineer turning complex challenges into elegant, reliable web solutions. Experienced in React, Next.js, Spring Boot and cloud technologies.
            </p>
            
            <div className="flex gap-4 justify-start mb-12">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                onClick={() => scrollToSection('contact')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-white text-black hover:bg-slate-300 cursor-pointer"
                onClick={() => scrollToSection('projects')}
              >
                View Projects
              </Button>
            </div>
            
            <div className="flex gap-6 justify-start">
              <a 
                href="https://github.com/Kusaldiss365" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/kusal-dissanayake/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="mailto:kusaldissanayake2@gmail.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-white transition-colors animate-bounce cursor-pointer"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>
  );
}
