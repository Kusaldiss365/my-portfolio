import { Briefcase } from "lucide-react";

export function ExperienceSection() {
  const experiences = [
    {
      company: "IFS R&D International (Pvt) Ltd.",
      position: "Software Engineer",
      period: "2025 October - Present",
      description: [
        "Working with PL/SQL and Oracle Database in IFS Cloud(Marble framework), collaborating in an Agile/Scrum environment.",
        "Completed the IFS New Software Engineer Program, gaining hands-on experience in PL/SQL, Marble framework, web development, and unit testing.",
      ]
    },
    {
      company: "Visionex Digital (Pvt) Ltd.",
      position: "Software Engineer",
      period: "2025 May - 2025 September",
      description: [
        "Contributing to an international construction based SaaS product using Next.js and Spring Boot in a microservices architecture, and developing web applications with Nuxt.js, Vue.js, and Laravel.",
        "Lead interns and supported requirement analysis and project coordination.",
        "Participating in international client meetings, handling technical discussions and updates.",
        "Actively contributed to stand-ups, and retrospectives within an Agile/Scrum environment.",
        "Managing deployment and hosting of client websites."
      ]
    },
    {
      company: "Visionex Digital (Pvt) Ltd.",
      position: "Associate Software Engineer",
      period: "2024 August - 2025 April",
      description: [
        "Worked on an international construction based SaaS product with Next.js and Spring Boot.",
        "Developed web applications using Nuxt.js, Vue.js, and Laravel.",
        "Participating in international client meetings, handling technical discussions and updates.",
        "Guided interns and took part in product launches and client demos.",
        "Engaged in hosting and maintenance of live websites."
      ]
    },
        {
      company: "Visionex Digital (Pvt) Ltd.",
      position: "Intern Software Engineer",
      period: "2024 February - 2024 August",
      description: [
        "Developed web applications using Nuxt.js, Vue.js, and Laravel.",
        "Developed custom wordpress themes to fit client requirements (Headless wordpress)",
        "Engaged in hosting and maintenance of live websites.",
      ]
    },
    {
      company: "Akbar Brothers | Head Office",
      position: "Commercial Officer",
      period: "2020 February - 2022 January",
      description: [
        "Worked with IFS-V10 (ERP) system on Material purchasing, Shipment planning and Managing BOMs etc.",
        "Effectively managed diverse procurement processes, ensuring timely and cost-effective delivery.",
        "Cultivated strong supplier relationships, negotiated favorable terms, and ensured compliance.",
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Work Experience
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700 hidden md:block"></div>
            
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-0 md:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-800 hidden md:block"></div>
                  
                  <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-blue-600/20 flex-shrink-0">
                        <Briefcase className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-white">
                          {exp.position}
                        </h3>
                        <p className="text-blue-400 text-lg">
                          {exp.company}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {exp.period}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 ml-4">
                      {exp.description.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-slate-300 flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
