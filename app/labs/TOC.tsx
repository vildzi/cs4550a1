"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function TOC() {
  const pathname = usePathname();
  const serverRootUrl = process.env.NEXT_PUBLIC_HTTP_SERVER;

  return (
    <Nav variant="pills">
      <NavItem>
        <NavLink href="/labs" as={Link} className={`nav-link ${pathname.endsWith("labs") ? "active" : ""}`}>Labs</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab1" as={Link} className={`nav-link ${pathname.endsWith("lab1") ? "active" : ""}`}>Lab 1</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab2" as={Link} className={`nav-link ${pathname.endsWith("lab2") ? "active" : ""}`}>Lab 2</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab3" as={Link} className={`nav-link ${pathname.endsWith("lab3") ? "active" : ""}`}>Lab 3</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab4" as={Link} className={`nav-link ${pathname.endsWith("lab4") ? "active" : ""}`}>Lab 4</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/labs/lab5" as={Link} className={`nav-link ${pathname.endsWith("lab5") ? "active" : ""}`}>Lab 5</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/" as={Link}>Kambaz</NavLink>
      </NavItem>
      <NavItem>
        <NavLink id="wd-github" href="https://github.com/vildzi/cs4550a1">My GitHub</NavLink>
      </NavItem>
      <NavItem>
        <NavLink id="wd-server-github" href="https://github.com/vildzi/kambaz-node-server-app" target="_blank" rel="noreferrer">
          Server GitHub
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink id="wd-server-link" href={serverRootUrl} target="_blank" rel="noreferrer">
          Server URL
        </NavLink>
      </NavItem>
    </Nav>
  );
}
