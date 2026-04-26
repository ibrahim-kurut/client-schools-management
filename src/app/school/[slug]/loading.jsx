import { Skeleton } from "@/components/ui/Skeleton"

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-6 w-full max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-[32px] border border-slate-100 dark:border-slate-700 h-[380px] flex flex-col justify-between">
             <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <Skeleton className="h-10 w-10 rounded-xl" />
                 <Skeleton className="h-6 w-32" />
               </div>
               <Skeleton className="h-4 w-48" />
             </div>
             
             <div className="flex justify-center my-6">
                <Skeleton className="h-40 w-40 rounded-full" />
             </div>
             
             <div className="space-y-3">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-4/5" />
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
