import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnquiryModal from "./EnquiryModal";
import { tenant, PRODUCTS } from "../config";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setProductsOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProductsOpen(false);
  }, [location]);

  const active = (p) => location.pathname === p;
  const prodActive =
    location.pathname.startsWith("/products") ||
    location.pathname.startsWith("/product");

  const linkCls = (path) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      active(path)
        ? "text-amber-500 bg-amber-500/10"
        : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
    }`;

  return (
    <>
      <nav
        className={`bg-white sticky top-0 z-50 border-b border-slate-200 transition-all duration-300 ${scrolled ? "shadow-lg shadow-black/5" : ""}`}
      >
        {/* Amber accent line */}
        <div className="h-[3px] w-full bg-amber-500" />

        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-[62px]">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="flex flex-col leading-none">
                <span className="text-[#0F172A] font-black text-xl uppercase tracking-tight font-poppins">
                  Auto<span className="text-amber-500">con</span>
                </span>
                <span className="text-[#64748B] text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5">
                  Solutions LLP
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((l) => (
                <Link key={l.name} to={l.path} className={linkCls(l.path)}>
                  {l.name}
                </Link>
              ))}

              {/* Products dropdown */}
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setProductsOpen((v) => !v)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    prodActive
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
                  }`}
                >
                  Products
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.14 }}
                      className="absolute top-full left-0 mt-2 w-76 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-[#0F172A]">
                        <Link
                          to="/products"
                          className="block text-white font-black text-sm hover:text-amber-400 transition-colors uppercase tracking-wide"
                          onClick={() => setProductsOpen(false)}
                        >
                          All Conveyor Products
                        </Link>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Browse all 6 product categories
                        </p>
                      </div>
                      <ul className="py-2">
                        {PRODUCTS.map((p) => (
                          <li key={p.slug}>
                            <Link
                              to={`/products/${p.slug}`}
                              onClick={() => setProductsOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#64748B] hover:bg-amber-50 hover:text-amber-700 transition-colors group/item"
                            >
                              <ChevronRight
                                size={12}
                                className="text-amber-500 shrink-0 group-hover/item:translate-x-0.5 transition-transform"
                              />
                              {p.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone */}
              <a
                href={`tel:${tenant.contact.phone1.replace(/\s/g, "")}`}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-amber-600 transition-colors ml-1"
              >
                <Phone size={13} className="text-amber-500" />
                {tenant.contact.phone1}
              </a>

              {/* Get a Quote CTA */}
              <button
                onClick={() => setModalOpen(true)}
                className="ml-2 bg-amber-500 hover:bg-amber-400 text-[#0F172A] px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all duration-200 shadow-md shadow-amber-500/20 hover:shadow-amber-400/30 active:scale-95"
              >
                Get a Quote
              </button>
            </div>

            {/* ── Mobile controls ── */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-amber-500 text-[#0F172A] px-4 py-2 rounded-lg text-sm font-black uppercase"
              >
                Quote
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 rounded-lg text-[#64748B] hover:bg-slate-100 transition-colors"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.name}
                    to={l.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold ${active(l.path) ? "bg-amber-50 text-amber-600" : "text-[#0F172A] hover:bg-slate-50"}`}
                  >
                    {l.name}
                  </Link>
                ))}
                <button
                  onClick={() => setMobileProducts((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${prodActive ? "bg-amber-50 text-amber-600" : "text-[#0F172A] hover:bg-slate-50"}`}
                >
                  Products
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${mobileProducts ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileProducts && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden ml-4 border-l-2 border-amber-300 pl-4 space-y-1"
                    >
                      <Link
                        to="/products"
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-sm font-black text-[#0F172A]"
                      >
                        All Products
                      </Link>
                      {PRODUCTS.map((p) => (
                        <Link
                          key={p.slug}
                          to={`/products/${p.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 text-sm text-[#64748B] hover:text-amber-600"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <a
                  href={`tel:${tenant.contact.phone1.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-amber-600"
                >
                  <Phone size={14} /> {tenant.contact.phone1}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
