/**
 * Applies the stored or system theme before first paint, so the page never
 * flashes the wrong colour scheme. Runs synchronously in <head>.
 */
const script = `(function(){try{var s=localStorage.getItem("windii-theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
