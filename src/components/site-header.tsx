import Link from "next/link";
import { navItems } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          <span>QUATTRO</span>
          クアトロマップ大阪
        </Link>
        <nav aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
