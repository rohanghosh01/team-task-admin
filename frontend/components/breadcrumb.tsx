"use client";
import { NextPage } from "next";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {}

const BreadcrumbComponent: NextPage<Props> = ({}) => {
  const pathname = usePathname();

  // Function to generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    // Start with only the dashboard as the base breadcrumb
    const breadcrumbs = [{ name: "Dashboard", href: "/dashboard" }];

    // Only add dynamic breadcrumbs for sub-paths (after /dashboard)
    if (pathSegments.length > 1) {
      let currentHref = "/dashboard";
      pathSegments.slice(1).forEach((segment) => {
        currentHref = `${currentHref}/${segment}`;
        breadcrumbs.push({
          name: decodeURIComponent(segment.replace(/%20/g, " ")),
          href: currentHref,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Skip rendering breadcrumbs if we're only on "/dashboard"
  const isDashboardOnly = pathname === "/dashboard";

  if (isDashboardOnly) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={index}>
            {index < breadcrumbs.length - 1 ? (
              <>
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>
                    <span className="capitalize">{crumb.name}</span>
                  </Link>
                </BreadcrumbLink>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <BreadcrumbPage>
                <span className="capitalize">{crumb.name}</span>
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
