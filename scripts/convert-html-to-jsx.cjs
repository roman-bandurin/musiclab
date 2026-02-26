const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "public", "musiclab.html");
const outPath = path.join(__dirname, "..", "src", "pages", "MainPageLayout.tsx");

const full = fs.readFileSync(htmlPath, "utf8");
const lines = full.split(/\r?\n/);
const slice = lines.slice(85, 612).join("\n");

let jsx = slice
  .replace(/\bclass=/g, "className=")
  .replace(/\bfor=/g, "htmlFor=")
  .replace(/\btabindex=/g, "tabIndex=")
  .replace(/\bstroke-width=/g, "strokeWidth=")
  .replace(/\bstroke-dasharray=/g, "strokeDasharray=")
  .replace(/\bstroke-dashoffset=/g, "strokeDashoffset=")
  .replace(/\bstroke-linecap=/g, "strokeLinecap=")
  .replace(/\bstroke-linejoin=/g, "strokeLinejoin=");

jsx = jsx.replace(
  /oninput="[^"]*"/g,
  'onChange={(e) => { const t = e.target; if (t && "value" in t) (t as HTMLElement).style.setProperty("--value", (t as HTMLInputElement).value); }}'
);

const sidebarLogout = /<label htmlFor="tab-1" className="sidebar__nav-link-wrap">\s*<a href="#" className="sidebar__nav-link sidebar__nav-link--logout" title="[^"]*">Р’С‹Р№С‚Рё<\/a>\s*<\/label>/s;
jsx = jsx.replace(
  sidebarLogout,
  '<Link to="/login" className="sidebar__nav-link-wrap">\n                <span className="sidebar__nav-link sidebar__nav-link--logout" title="Р’С‹Р№С‚Рё РёР· Р°РєРєР°СѓРЅС‚Р°">Р’С‹Р№С‚Рё</span>\n              </Link>'
);

const mainLogoutStart = jsx.indexOf('<label htmlFor="tab-1" className="main__logout-wrap"');
if (mainLogoutStart !== -1) {
  const afterStart = jsx.slice(mainLogoutStart);
  const labelEnd = afterStart.indexOf("</label>");
  const block = afterStart.slice(0, labelEnd + 8);
  const inner = block
    .replace(/^<label htmlFor="tab-1" className="main__logout-wrap"[^>]*>/s, "")
    .replace(/<\/label>\s*$/, "");
  const replacement =
    '<Link to="/login" className="main__logout-wrap" aria-label="Р’С‹Р№С‚Рё РёР· С‚РµРєСѓС‰РµРіРѕ Р°РєРєР°СѓРЅС‚Р°">' +
    inner +
    "</Link>";
  jsx = jsx.slice(0, mainLogoutStart) + replacement + jsx.slice(mainLogoutStart + block.length);
}

const preamble = "import { Link } from \"react-router-dom\";\n\nexport function MainPageLayout() {\n  return (\n    <>\n";
const end = "\n    </>\n  );\n}\n";

fs.writeFileSync(outPath, preamble + jsx + end, "utf8");
console.log("Wrote", outPath);
