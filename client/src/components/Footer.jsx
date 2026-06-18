import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { tenant, PRODUCTS } from '../config';

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us',  path: '/about'    },
    { label: 'Products',  path: '/products' },
    { label: 'Projects',  path: '/projects' },
    { label: 'Contact',   path: '/contact'  },
  ],
  Products: PRODUCTS.map(p => ({ label: p.name, path: `/products/${p.slug}` })),
};

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300">
      {/* CTA Bar */}
      <div className="bg-amber-500 py-8">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-slate-900 font-black text-xl font-display uppercase">
              Ready to modernize your production line?
            </p>
            <p className="text-slate-800 text-sm mt-0.5">Get a free consultation from our engineering team.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-500 font-bold rounded-xl transition-all duration-200 shrink-0"
          >
            Contact Us <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div>
                <div className="text-white font-black text-xl font-display uppercase">Autocon</div>
                <div className="text-slate-400 text-xs tracking-[0.2em] uppercase">Solutions LLP</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Specializing in the manufacturing of custom conveyor systems and material handling solutions 
              for industries across India.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href={tenant.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-lg flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={tenant.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-lg flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.path}
                      className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-amber-500/0 group-hover:bg-amber-500 transition-colors" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${tenant.contact.phone1.replace(/\s/g, '')}`} className="flex items-start gap-3 text-slate-400 hover:text-amber-400 transition-colors group">
                  <Phone size={15} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="text-sm">
                    <p className="font-semibold text-white">{tenant.contact.director1.name}</p>
                    <p>{tenant.contact.phone1}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`tel:${tenant.contact.phone2.replace(/\s/g, '')}`} className="flex items-start gap-3 text-slate-400 hover:text-amber-400 transition-colors group">
                  <Phone size={15} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="text-sm">
                    <p className="font-semibold text-white">{tenant.contact.director2.name}</p>
                    <p>{tenant.contact.phone2}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${tenant.contact.email}`} className="flex items-center gap-3 text-slate-400 hover:text-amber-400 text-sm transition-colors">
                  <Mail size={15} className="shrink-0 text-amber-500" />
                  {tenant.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-500" />
                {tenant.contact.address}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {tenant.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <p>Material Handling & Conveyor Systems | Pune, Maharashtra</p>
            <span className="hidden lg:inline text-slate-700">|</span>
            <Link to="/admin/login" className="hover:text-amber-500 transition-colors hidden lg:block">Admin Login</Link>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-2 text-center lg:hidden lg:mt-0">
             <Link to="/admin/login" className="text-xs text-slate-600 hover:text-amber-500 transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
