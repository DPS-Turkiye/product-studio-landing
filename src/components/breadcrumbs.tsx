import { Link } from "@/i18n/navigation";
import type { Crumb } from "@/lib/structured-data";

export function Breadcrumbs({
  items,
  label,
}: {
  items: Crumb[];
  label: string;
}) {
  if (items.length < 2) return null;

  return (
    <nav className="breadcrumbs" aria-label={label}>
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
