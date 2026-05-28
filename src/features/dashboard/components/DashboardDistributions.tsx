import { Activity, Package, Banknote } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DashboardGridCard } from "./DashboardGridCard";
import { EmptyChartState } from "./EmptyChartState";

export function DashboardDistributions() {
  return (
    <>
      <SectionHeader
        title="التوزيعات والتحليلات"
        description="النشاط، المخزون، والمدفوعات حسب النوع"
        className="mt-10"
      />
      <section className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:auto-rows-fr">
        <DashboardGridCard
          title={
            <>
              <Activity className="h-5 w-5 text-muted-foreground" />
              توزيع النشاط
            </>
          }
          description="حسب نوع الكيان أو الإجراء — مرتب حسب العدد مع نسبة كل فئة"
          contentMinHeight={270}
        >
          <EmptyChartState
            icon={<Activity className="h-12 w-12 text-muted-foreground/50" />}
            message="سيتم عرض توزيع النشاط عند ربط واجهة برمجة التطبيقات"
            className="min-h-0 flex-1 justify-center"
            minHeight={200}
          />
        </DashboardGridCard>

        <DashboardGridCard
          title={
            <>
              <Package className="h-5 w-5 text-muted-foreground" />
              المخزون
            </>
          }
          description="حلقات نسبية — معدل الاستخدام"
          contentMinHeight={270}
        >
          <EmptyChartState
            icon={<Package className="h-12 w-12 text-muted-foreground/50" />}
            message="سيتم عرض بيانات المخزون عند ربط واجهة برمجة التطبيقات"
            className="min-h-0 flex-1 justify-center"
            minHeight={200}
          />
        </DashboardGridCard>

        <DashboardGridCard
          title={
            <>
              <Banknote className="h-5 w-5 text-muted-foreground" />
              المدفوعات حسب النوع
            </>
          }
          description="شرائح نسبية — عرض توزيع كل نوع دفع مع المبلغ وعدد العمليات"
          contentMinHeight={270}
        >
          <EmptyChartState
            icon={<Banknote className="h-12 w-12 text-muted-foreground/50" />}
            message="سيتم عرض بيانات المدفوعات عند ربط واجهة برمجة التطبيقات"
            className="min-h-0 flex-1 justify-center"
            minHeight={200}
          />
        </DashboardGridCard>
      </section>
    </>
  );
}
