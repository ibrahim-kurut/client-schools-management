"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherStudents } from "@/redux/slices/teacherProfileSlice";
import { fetchClassNotes, createNote, deleteNote, updateNote } from "@/redux/slices/notesSlice";
import { 
  Megaphone, 
  Send, 
  Trash2, 
  Pencil,
  Check,
  X,
  Layers, 
  Clock, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import Swal from 'sweetalert2';
import Select from "@/components/ui/Select";

export default function TeacherNotesPage() {
  const dispatch = useDispatch();
  const { classes, loading: profileLoading } = useSelector((state) => state.teacherProfile);
  const { notes, loading: notesLoading, creating } = useSelector((state) => state.notes);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    dispatch(fetchTeacherStudents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClassId) {
      dispatch(fetchClassNotes(selectedClassId));
    }
  }, [selectedClassId, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassId) return toast.error("يرجى اختيار الصف أولاً");
    if (content.trim().length < 5) return toast.error("الملاحظة قصيرة جداً (5 أحرف على الأقل)");

    try {
      await dispatch(createNote({ classId: selectedClassId, content: content.trim() })).unwrap();
      toast.success("تم إرسال الملاحظة بنجاح");
      setContent("");
    } catch (err) {
      toast.error(err || "فشل في إرسال الملاحظة");
    }
  };

  const handleDelete = async (noteId) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذه الملاحظة نهائياً من سجل الطلاب!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'نعم، احذفها',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      direction: 'rtl',
      customClass: {
        popup: 'rounded-[2rem] font-sans rtl',
        confirmButton: 'rounded-xl px-6 py-3 font-bold',
        cancelButton: 'rounded-xl px-6 py-3 font-bold'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteNote(noteId)).unwrap();
          toast.success("تم حذف الملاحظة بنجاح");
        } catch (err) {
          toast.error(err || "فشل في حذف الملاحظة");
        }
      }
    });
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleCancel = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleUpdate = async (noteId) => {
    if (editingContent.trim().length < 5) {
      return toast.error("الملاحظة قصيرة جداً (5 أحرف على الأقل)");
    }

    try {
      await dispatch(updateNote({ noteId, content: editingContent.trim() })).unwrap();
      toast.success("تم تحديث الملاحظة بنجاح");
      setEditingNoteId(null);
    } catch (err) {
      toast.error(err || "فشل في تحديث الملاحظة");
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl shadow-sm outline outline-indigo-200/50">
             <Megaphone className="w-6 h-6 text-indigo-600" />
          </div>
          إعلانات الصفوف
        </h1>
        <p className="text-sm font-bold text-slate-400 mt-2">
          اكتب ملاحظات وتنبيهات لطلابك لتظهر في لوحة التحكم الخاصة بهم.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/40">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500" />
              إرسال ملاحظة جديدة
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Class Selection */}
              <div>
                <Select
                  label="اختر الصف"
                  placeholder="اختر صفاً من القائمة..."
                  value={selectedClassId}
                  onChange={setSelectedClassId}
                  options={classes.map((cls) => ({ value: cls.id, label: cls.name }))}
                />
              </div>

              {/* Note Content */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">نص الملاحظة</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب هنا ما تريد إبلاغ الطلاب به..."
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-bold resize-none"
                />
                <p className="text-[10px] text-slate-400 font-bold mt-2 mr-1">
                   {content.length}/1000 حرف
                </p>
              </div>

              <button
                type="submit"
                disabled={creating || !selectedClassId || content.trim().length < 5}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl py-4 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                {creating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>إرسال الآن</span>
                    <Send className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Notes Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              الملاحظات السابقة {selectedClass && ` لـ ${selectedClass.name}`}
            </h2>
          </div>

          {!selectedClassId ? (
            <div className="bg-white/50 rounded-[2rem] border border-dashed border-slate-200 p-20 text-center">
               <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <p className="text-slate-400 font-bold">يرجى اختيار صف لعرض الملاحظات الخاصة به.</p>
            </div>
          ) : notesLoading ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-slate-400 font-bold tracking-widest">جاري تحميل الملاحظات...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-20 text-center shadow-sm">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="w-10 h-10 text-slate-200" />
               </div>
               <p className="text-slate-400 font-bold">لا توجد ملاحظات مرسلة لهذا الصف حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500/50 group-hover:bg-indigo-500 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                         <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700">تاريخ النشر</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: ar })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {editingNoteId === note.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(note.id)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all shadow-sm"
                            title="حفظ التغييرات"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all shadow-sm"
                            title="إلغاء التعديل"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(note)}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all shadow-sm"
                            title="تعديل الملاحظة"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all shadow-sm"
                            title="حذف الملاحظة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingNoteId === note.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full bg-slate-50 border border-indigo-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-bold resize-none min-h-[100px]"
                        autoFocus
                      />
                      <div className="flex justify-end mt-1">
                        <span className="text-[10px] text-indigo-400 font-bold">{editingContent.length}/1000 حرف</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 font-bold text-sm leading-relaxed whitespace-pre-wrap pr-1">
                      {note.content}
                    </p>
                  )}

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
                           <Layers className="w-3 h-3 text-slate-400" />
                           <span className="text-[10px] font-black text-slate-500">{selectedClass?.name}</span>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-300 italic">بواسطة المعلم</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
