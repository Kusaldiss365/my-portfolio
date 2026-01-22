import { Code2, Rocket, Users } from "lucide-react";
import { Card } from "./ui/card";

export function AboutSection() {
  const highlights = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and well-documented code is my priority."
    },
    {
      icon: Rocket,
      title: "Fast Learner",
      description: "Quick to adapt to new technologies and frameworks to deliver innovative solutions."
    },
    {
      icon: Users,
      title: "Team Player",
      description: "Experienced in collaborating with cross-functional teams to achieve common goals."
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            About Me
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-slate-300 text-lg mb-6">
                I'm Kusal Dissanayake, a software engineer with 2 years of experience building scalable web applications and SaaS platforms. I specialize in full-stack development using technologies like Next.js, Spring Boot, Nuxt.js, Vue.js, and Laravel within microservices architectures, creating responsive user interfaces and robust backend systems that drive real-world impact.
              </p>
              <p className="text-slate-300 text-lg mb-6">
                My journey started at the <strong>University of Colombo with a Bachelor of Information and Communication Technology Honours</strong>, building a solid foundation in tech fundamentals. I then sharpened my skills through the intensive <strong>Comprehensive Master Java Developer program at IJSE</strong> - Institute of Software Engineering, mastering Java and real-world development practices that power my work today - from client-facing projects and mentoring interns to international stakeholder collaboration and live system deliveries.
              </p>
              <p className="text-slate-300 text-lg">
                I'm passionate about AI innovation like Cognix, my final-year project using LangChain, RAG and agentic flows to provide smart, personalized guidance for students. Outside coding, basketball keeps me sharp and disciplined. I bring that same focus and teamwork to every project.
              </p>
            </div>
            
            <div className="grid gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700 p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-600/20">
                      <highlight.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-slate-400">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
