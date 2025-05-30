import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Branding", url: "#" },
        { name: "Design", url: "#" },
        { name: "Marketing", url: "#" },
        { name: "Advertisement", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About us", url: "#" },
        { name: "Contact", url: "#" },
        { name: "Jobs", url: "#" },
        { name: "Press kit", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of use", url: "#" },
        { name: "Privacy policy", url: "#" },
        { name: "Cookie policy", url: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of use", url: "#" },
        { name: "Privacy policy", url: "#" },
        { name: "Cookie policy", url: "#" },
      ],
    },
  ];

  const socials = [
    {
      icon: IconBrandFacebook,
      href: "#",
    },
    {
      icon: IconBrandInstagram,
      href: "#",
    },
    {
      icon: IconBrandYoutube,
      href: "#",
    },
    {
      icon: IconBrandLinkedin,
      href: "#",
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="divider"></div>
      </div>
      <footer className="footer sm:footer-horizontal bg-background text-neutral-content p-10 top-div">
        {footerSections.map((section, index) => (
          <nav key={index}>
            <h6 className="footer-title">{section.title}</h6>
            {section.links.map((link, linkIndex) => (
              <a key={linkIndex} className="link link-hover" href={link.url}>
                {link.name}
              </a>
            ))}
          </nav>
        ))}
        <nav className="w-full flex items-end flex-col">
          {socials?.map((item, idx) => {
            return (
              <Link href={item?.href} key={idx}>
                <item.icon className="cursor-pointer" />
              </Link>
            );
          })}
        </nav>
      </footer>
    </>
  );
};

export default Footer;
