import { Inter } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "@/common_component/Footer";
import Header from "@/common_component/Header";
import { QueryProvider } from "@/modules/globals/QueryProvider";
import BlockChainWrapper from "@/modules/globals/BlockChainWrapper";
import { Toaster } from "sonner";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "TAN Dapps",
  description: "Next gen ultra pro max extreme dapps by TAN",

  icons: {
    icon: "/assets/brand/onlyLogo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${interSans.variable} antialiased min-h-screen`}>
        <QueryProvider>
          <BlockChainWrapper>
            <div className="mx-2 md:mx-12 ">
              <Toaster theme="dark" />
              <Header />
              {children}
              <Footer />
            </div>
          </BlockChainWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
