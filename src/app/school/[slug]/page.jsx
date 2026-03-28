import Navbar from "@/components/Navbar";

export default async function SchoolPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  return (






    <div className="min-h-screen font-sans flex flex-col">
          <Navbar />
          <main className="flex-1">
             <h1 className="text-4xl font-bold text-slate-800 mb-4">لوحة تحكم المدرسة</h1>
      <p className="text-lg text-slate-600">المدرسة الحالية: {decodeURIComponent(slug)}</p>
          </main>
          {/* <Footer /> */}
        </div>






  );
}
