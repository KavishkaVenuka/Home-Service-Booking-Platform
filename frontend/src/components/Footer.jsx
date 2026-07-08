import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const FOOTER_LINKS = {
  Services: ['Plumbing', 'Electrical', 'Cleaning', 'Repairs', 'Painting'],
  Company:  ['About Us', 'Careers', 'Blog', 'Press'],
  Support:  ['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy'],
};

/**
 * Shared Footer component with links, social icons, and brand info.
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">

      {/* Main Footer Grid */}
      <div className="container-app py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-white mb-4">
              <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                <FiHome size={16} />
              </span>
              HomeServe
            </Link>
            <p className="text-sm leading-relaxed mb-4 max-w-xs">
              Connecting homeowners with trusted, verified service professionals. Fast, reliable, and affordable.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:hello@homeserve.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <FiMail size={14}/> hello@homeserve.com
              </a>
              <a href="tel:+11234567890" className="flex items-center gap-2 hover:text-white transition-colors">
                <FiPhone size={14}/> +1 (123) 456-7890
              </a>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {[FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-semibold text-white text-sm mb-4">{heading}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} HomeServe. All rights reserved.</p>
          <p>Built with ❤️ for homeowners everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
