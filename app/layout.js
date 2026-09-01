import "./globals.css";
import NavBar from "./components/NavBar";
import Starfield from "./components/Starfield";

export const metadata = {
  title: "[Pen Name] · Books",
  description: "Read [Pen Name]'s books. Pay by card or crypto.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Starfield />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
