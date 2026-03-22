import { Badge } from "./ui/badge";
import { motion, type Variants } from "framer-motion";
import {
  Code2,
  Database,
  Cloud,
  Laptop,
  Server,
  Wrench,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

export function SkillsSection() {
  const skillCategories: {
    category: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
      skills: string[];
  }[] = [
    {
      category: "Programming Languages",
      icon: Code2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      skills: ["Java", "C", "C#", "Python", "TypeScript", "JavaScript"],
    },
    {
      category: "Frontend",
      icon: Laptop,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      skills: [
        "React",
        "Next.js",
        "Vue.js",
        "Nuxt.js",
        "Tailwind CSS",
        "Zustand",
        "HTML5",
        "CSS3",
        "Marble (IFS)",
      ],
    },
    {
      category: "Backend",
      icon: Server,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      skills: [
        "Spring Boot",
        "Laravel",
        "Node.js",
        "FastAPI",
        "REST APIs",
        "Microservices",
        "ASP.NET Core",
      ],
    },
    {
      category: "Databases",
      icon: Database,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      skills: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Firebase",
        "ChromaDB",
        "pgvector",
        "PL/SQL",
      ],
    },
    {
      category: "CMS & DevOps",
      icon: Cloud,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      skills: [
        "WordPress (Headless)",
        "cPanel Hosting",
      ],
    },
    {
      category: "AI Tools",
      icon: BrainCircuit,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      skills: [
        "LangChain",
        "LangGraph",
        "Hugging Face",
        "Ollama",
        "OpenAI",
        "RAG",
      ],
    },
    {
      category: "Tools",
      icon: Wrench,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      skills: [
        "Git",
        "Postman",
        "Bruno",
        "Swagger",
        "Figma",
        "Docker",
      ],
    },
    {
      category: "Project Management",
      icon: Wrench,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      skills: ["Jira", "Azure DevOps"],
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.8, 0.25, 1],
      },
    },
  };

  const skillBadgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <section
      id="skills"
      className="py-20 bg-slate-800 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900 opacity-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Skills & Technologies
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              A comprehensive overview of my technical expertise and tools I
              work with
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>

                <div className="relative bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  {/* Icon Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className={`${category.bgColor} p-4 rounded-lg`}
                      whileHover={{
                        scale: 1.08,
                        backgroundColor: "#1e293b",
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <category.icon className={`h-7 w-7 ${category.color}`} />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {category.category}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {category.skills.length} skills
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={containerVariants}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        variants={skillBadgeVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50 hover:border-slate-600 transition-all duration-200 cursor-default text-xs py-1.5 px-3"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
