import { LANGS, NATIVE_NAME } from "@/lib/i18n/langs";
import { schibsted } from "./fonts";
import "@/styles/globals.css";
export default function NotFound() {
  return (
    <html lang="en">
      <body className={schibsted.variable}>
        <main className="wrap section">
          <h1>Page not found</h1>
          <ul>
            {LANGS.map((l) => (
              <li key={l}>
                <a href={"/" + l} lang={l}>
                  {NATIVE_NAME[l]}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
