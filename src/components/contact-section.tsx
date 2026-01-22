import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [result, setResult] = useState("");

const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  setResult("Sending...");

  const form = event.currentTarget;
  const formDataObj = new FormData(form);
  formDataObj.append("access_key", "8f9651de-e45e-4a75-ad42-b0b34dcac20e");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formDataObj,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Sent Successfully!");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setResult(data.message || "Something went wrong!");
      console.error("Web3Forms error:", data);
    }
  } catch (error) {
    setResult("Network error - please try again");
    console.error("Fetch error:", error);
  }
};

  useEffect(() => {
      if (result && result !== "Sending...") {
        const timer = setTimeout(() => {
          setResult("");
        }, 3000);

        return () => clearTimeout(timer);
      }
    }, [result]);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "kusaldissanayake2@gmail.com",
      link: "mailto:kusaldissanayake2@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+94768871660",
      link: "tel:+94768871660"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Kaduwela, Sri Lanka",
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-300 text-lg mb-8">
                I'm always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-600/20">
                        <info.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">{info.label}</p>
                        {info.link ? (
                          <a 
                            href={info.link}
                            className="text-white hover:text-blue-400 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-white">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <Card className="bg-slate-800 border-slate-700 p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-slate-300 mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-slate-900 border-slate-700 text-white"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-slate-300 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-slate-900 border-slate-700 text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-slate-300 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-slate-900 border-slate-700 text-white min-h-32"
                    placeholder="Your message..."
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <p className={`${result === "Sending..." ? "text-yellow-300 animate-pulse" : result === "Sent Successfully!" ? "text-green-400" : "text-red-400" }`}>{result}</p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
