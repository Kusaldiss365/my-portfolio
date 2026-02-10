import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "./ui/badge";

export function ProjectsSection() {
  const projects = [
    {
      title: "Electromart",
      description:
        "ElectroMart is an AI-powered e-commerce assistant built with LangGraph, using a multi-agent architecture for sales, support, and order handling. It combines tool-calling agents, Retrieval-Augmented Generation (RAG), and conversation memory to deliver accurate, context-aware responses. Strict guardrails and intent routing ensure deterministic behavior, prevent hallucinations, and enable reliable multi-turn interactions in real-world e-commerce workflows.",
      technologies: [
        "Python",
        "FastAPI",
        "Uvicorn",
        "SQLAlchemy",
        "OpenAI",
        "GPT-4o-mini",
        "LangChain",
        "LangGraph",
        "NextJS (Frontend)",
        "PostgresSQL",
        "PgVector",
      ],
      githubUrl: "https://github.com/Kusaldiss365/Electromart",
      liveUrl: "https://www.youtube.com/watch?v=j0OJNfm8hcY",
      image: "/electromart.png",
    },
    {
      title: "Cognix",
      description:
        "An AI-powered web application designed to support constructive learning by guiding students in answering openended questions. Provides personalized feedback and hints without revealing answers. Built using concepts such as Agentic Flow, Chain of Thought Reasoning, and Retrieval-Augmented Generation (RAG). Incorporates multi-agent architecture to evaluate responses and generate contextual feedback.",
      technologies: [
        "Python",
        "FastAPI",
        "Uvicorn",
        "Hugging Face",
        "ChromaDB",
        "LangChain",
        "GPT-4o-mini",
        "NextJS (Frontend)",
        "Llama3",
      ],
      githubUrl: "https://github.com/Kusaldiss365/Cognix_v1",
      liveUrl: "https://youtu.be/J7KggRkwXy8",
      image: "/cognix.jpeg",
    },
    {
      title: "FotCast",
      description:
        "A mobile application developed to publish news and updates from the Faculty of Technology, focusing on education and sports.",
      technologies: [
        "Java (Andriod)",
        "Firebase Firestore",
        "Firebase Realtime Database",
      ],
      githubUrl: "https://github.com/Kusaldiss365/FotCast",
      liveUrl: "",
      image: "/fotcast.png",
    },
    {
      title: "Rent Car",
      description:
        "A Car rental app, Created to handle customers, handle vehicle details and calculate vehicle rental fees with ease using layered architecture.",
      technologies: ["Java", "JavaFX"],
      githubUrl: "https://github.com/Kusaldiss365/Rent_Car_Project",
      liveUrl: "",
      image: "/rentcar.png",
    },
    {
      title: "GalleryLK",
      description:
        "An E-commerce website with functionality to login as buyers and sellers to buy products or sell their art products online.",
      technologies: ["HTML", "CSS", "PHP", "Bootstrap", "MySQL"],
      githubUrl: "https://github.com/Kusaldiss365/Gallery-lk-Last",
      liveUrl: "",
      image: "/gallerylk.png",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Personal Projects
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 overflow-hidden group hover:border-blue-500 transition-colors">
                {/* <div className={`h-48 bg-gradient-to-br ${project.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div> */}
                <div className="relative w-full pt-[56%] overflow-hidden bg-slate-950">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-fit object-center transition-transform duration-300 group-hover:scale-105"
                      />
                </div>
                
                <div className="p-6 -mt-4">
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-300 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex}
                        variant="outline"
                        className="border-slate-600 text-slate-300 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-700 hover:bg-slate-300"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        Code
                      </a>
                    </Button>
                    {project.liveUrl && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
