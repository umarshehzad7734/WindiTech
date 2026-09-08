/**
 * Applies the visitor's stored theme before first paint, so the page never
 * flashes the wrong colour scheme.
 *
 * Dark is the default: the brand is green on black, so the site leads with
 * black and only switches to light if the visitor has explicitly chosen it.
 */
const script = `(function(){try{var t=localStorage.getItem("windii-theme")==="light"?"light":"dark";var c=document.documentElement.classList;c.add(t);c.remove(t==="dark"?"light":"dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
