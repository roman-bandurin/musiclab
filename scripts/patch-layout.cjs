const fs = require("fs");
const path = require("path");
const outPath = path.join("c:", "Users", "roman", "Documents", "roman-bandurin", "musiclab", "src", "pages", "MainPageLayout.tsx");
let s = fs.readFileSync(outPath, "utf8");
const sidebarRe = /<label htmlFor="tab-1" className="sidebar__nav-link-wrap">\s*<a href="#" className="sidebar__nav-link sidebar__nav-link--logout" title="[^"]*">[^<]*<\/a>\s*<\/label>/s;
s = s.replace(sidebarRe, '<Link to="/login" className="sidebar__nav-link-wrap">\n                <span className="sidebar__nav-link sidebar__nav-link--logout" title="Р’С‹Р№С‚Рё РёР· Р°РєРєР°СѓРЅС‚Р°">Р’С‹Р№С‚Рё</span>\n              </Link>');
s = s.replace(/<Link to="\/login" className="main__logout-wrap" aria-label="[^"]*">/, '<Link to="/login" className="main__logout-wrap" aria-label="Р’С‹Р№С‚Рё Рё РїРµСЂРµР№С‚Рё РЅР° СЃС‚СЂР°РЅРёС†Сѓ РІС…РѕРґР°">');
fs.writeFileSync(outPath, s, "utf8");
console.log("Patched");
