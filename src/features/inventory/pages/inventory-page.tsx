import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { InventoryHubSection } from "@/features/inventory/types/inventory.types";
import { listInventoryHubSectionsMock } from "@/features/inventory/services/inventory.mock.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowLeft, Building2, Users, ArrowLeftRight } from "lucide-react";

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  branches: Building2,
  employees: Users,
  transfers: ArrowLeftRight,
};

export function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<InventoryHubSection[]>([]);

  useEffect(() => {
    listInventoryHubSectionsMock()
      .then((response) => setSections(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)" }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">مرحباً بك في المخزون</CardTitle>
              <CardDescription>اختر القسم الذي تريد إدارته</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((section) => {
            const Icon = sectionIcons[section.id] ?? Package;
            return (
              <Link key={section.id} to={section.path} className="block group">
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)" }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    </div>
                    <h3 className="font-black text-base mt-4">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
