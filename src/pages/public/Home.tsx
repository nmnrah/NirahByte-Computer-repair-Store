import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, HardDrive, ShieldCheck, Wrench, Clock, BadgeCheck, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#FCFDFD] overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]"></div>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2C5254]/10 text-[#2C5254] text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Repair Technicians</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Premium care for your <span className="text-[#2C5254]">essential technology.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed mx-auto md:mx-0">
              Expert diagnostics, fast repairs, and reliable data recovery for professionals who can't afford downtime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/book"
                className="bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-8 py-4 rounded-xl text-base font-medium transition-colors shadow-lg shadow-[#2C5254]/20 flex items-center justify-center gap-2"
              >
                Book a Repair <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#services"
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl text-base font-medium transition-colors flex items-center justify-center"
              >
                View Services
              </a>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2C5254]/20 to-transparent rounded-3xl blur-3xl"></div>
            <div className="relative bg-white p-2 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Professional repairing a computer" 
                className="rounded-2xl object-cover w-full h-[400px] md:h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">Specialized Services</h2>
            <p className="text-lg text-gray-600">Comprehensive hardware and software solutions performed by certified experts in a secure environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Cpu className="w-8 h-8 text-[#2C5254]" />}
              title="Hardware Diagnostics"
              description="Comprehensive testing of all physical components to identify failing hardware before catastrophic failure."
              image="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <ServiceCard 
              icon={<HardDrive className="w-8 h-8 text-[#2C5254]" />}
              title="Data Recovery"
              description="Secure retrieval of lost or corrupted files from damaged hard drives, SSDs, and external storage media."
              image="https://images.unsplash.com/photo-1600861194942-f883de0dfe96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <ServiceCard 
              icon={<Wrench className="w-8 h-8 text-[#2C5254]" />}
              title="System Optimization"
              description="Thorough cleaning, thermal paste replacement, and OS tuning to restore factory-level performance."
              image="https://images.unsplash.com/photo-1588508065123-287b28e013da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* About / Trust Section */}
      <section id="about" className="py-24 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <img 
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd37be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Clean workshop" 
              className="rounded-3xl shadow-xl object-cover w-full h-[500px]"
            />
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <BadgeCheck className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-gray-900">10k+</p>
                  <p className="text-sm text-gray-500 font-medium">Repairs Completed</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              A refined approach to technical support.
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                We understand that your devices are essential to your livelihood. That's why we've built a repair process focused on transparency, security, and precision.
              </p>
              <p>
                Unlike standard repair shops, our facility operates with laboratory-grade cleanliness and strict data privacy protocols. Your hardware is handled with the utmost care, and your data remains strictly confidential.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 shrink-0">
                  <Clock className="w-6 h-6 text-[#2C5254]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fast Turnaround</h4>
                  <p className="text-sm text-gray-500 mt-1">Most repairs completed within 24-48 hours.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#2C5254]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Guaranteed Work</h4>
                  <p className="text-sm text-gray-500 mt-1">90-day warranty on all parts and labor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description, image }: { icon: React.ReactNode, title: string, description: string, image: string }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-[#2C5254]/20 group-hover:bg-transparent transition-colors z-10"></div>
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-8 flex-1 leading-relaxed">{description}</p>
        <Link to="/book" className="inline-flex items-center gap-2 text-[#2C5254] font-medium group-hover:text-[#1E3B3D] transition-colors mt-auto">
          Book Service <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
