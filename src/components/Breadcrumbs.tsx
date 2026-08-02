import Link from "next/link";

export type BreadcrumbLink = { name: string; path: string };

export function Breadcrumbs({ items }: { items: readonly BreadcrumbLink[] }) {
  return (
    <nav aria-label="パンくずリスト" className="breadcrumbs">
      <ol>
        {items.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>{item.name}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
