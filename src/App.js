import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Search, Trophy, BarChart3, GraduationCap, LayoutDashboard, Menu, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const translations = {
  en: {
    flag: "🇺🇸", langName: "EN", title: "Results 2024", dashboard: "Dashboard",
    lookupTitle: "Score Lookup", placeholder: "Enter Student ID...",
    searchBtn: "Search", reportFor: "Report for Student ID", langCode: "Lang Code",
    chartTitle: "Score Level Distribution", rankingTitle: "Top 10 Group A",
    loading: "Loading...", notFound: "Student ID not found!",
    subjects: {
      math: "Math", literature: "Literature", english: "English",
      physics: "Physics", chemistry: "Chemistry", biology: "Biology",
      history: "History", geography: "Geography", civicEdu: "Civic Edu"
    }
  },
  vi: {
    flag: "🇻🇳", langName: "VI", title: "Kết Quả 2024", dashboard: "Trang Chủ",
    lookupTitle: "Tra Cứu Điểm", placeholder: "Nhập SBD...",
    searchBtn: "Tìm", reportFor: "Kết quả cho SBD", langCode: "Mã NN",
    chartTitle: "Phân Phối Điểm", rankingTitle: "Top 10 Khối A",
    loading: "Đang tải...", notFound: "Không tìm thấy SBD!",
    subjects: {
      math: "Toán", literature: "Văn", english: "Anh",
      physics: "Lý", chemistry: "Hóa", biology: "Sinh",
      history: "Sử", geography: "Địa", civicEdu: "GDCD"
    }
  }
};

const App = () => {
  const [lang, setLang] = useState('vi');
  const t = translations[lang];
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [sbdInput, setSbdInput] = useState('');
  const [student, setStudent] = useState(null);
  const [top10, setTop10] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [topRes, reportRes] = await Promise.all([
        axios.get('http://localhost:8080/api/students/top10'),
        axios.get('http://localhost:8080/api/students/report')
      ]);
      setTop10(topRes.data);
      setReportData(reportRes.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const fetchStudentDetails = async (sbd) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/students/${sbd}`);
      setStudent(res.data);
      setSbdInput(sbd);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(t.notFound);
      setStudent(null);
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (sbdInput) fetchStudentDetails(sbdInput);
  };

  const getColorClass = (value) => {
    if (value === null || value === undefined) return 'text-slate-800';
    if (value >= 8) return 'text-emerald-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
      <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900">
        {/* MOBILE SIDEBAR OVERLAY */}
        {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* SIDEBAR */}
        <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-indigo-950 text-white z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shrink-0`}>
          <div className="p-6 text-2xl font-bold flex items-center justify-between border-b border-indigo-900">
            <div className="flex items-center gap-2">
              <GraduationCap size={28} className="text-indigo-400" /> <span>G-Scores</span>
            </div>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
          </div>
          <nav className="mt-6 px-4 flex-1">
            <div className="flex items-center gap-3 p-3 bg-indigo-800 rounded-xl shadow-md cursor-default text-sm font-semibold">
              <LayoutDashboard size={18} /> {t.dashboard}
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* NAV BAR */}
          <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight truncate">{t.title}</h1>
            </div>

            <button
                onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all font-bold text-xs shrink-0"
            >
              <span className="text-lg">{t.flag}</span>
              <span className="hidden sm:inline">{t.langName}</span>
            </button>
          </nav>

          {/* PAGE CONTENT */}
          <div className="p-4 md:p-8 flex-1">
            <div className="grid grid-cols-12 gap-6 md:gap-8 max-w-7xl mx-auto">

              {/* LEFT COLUMN */}
              <div className="col-span-12 lg:col-span-8 space-y-6 md:space-y-8">
                {/* SEARCH CARD */}
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Search size={20} className="text-indigo-600" /> {t.lookupTitle}
                  </h2>
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <input
                        className="flex-1 border-2 border-slate-100 bg-slate-50 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-sm"
                        placeholder={t.placeholder}
                        value={sbdInput}
                        onChange={(e) => setSbdInput(e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-lg shadow-indigo-100">
                      {loading ? '...' : t.searchBtn}
                    </button>
                  </form>

                  {student && (
                      <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
                        <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest flex justify-between items-center">
                          <span>{t.reportFor}: <span className="text-indigo-600 ml-1">{student.sbd}</span></span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                          <ScoreCard label={t.subjects.math} value={student.toan} color={getColorClass(student.toan)} />
                          <ScoreCard label={t.subjects.literature} value={student.nguVan} color={getColorClass(student.nguVan)} />
                          <ScoreCard label={t.subjects.english} value={student.ngoaiNgu} color={getColorClass(student.ngoaiNgu)} />
                          <ScoreCard label={t.subjects.physics} value={student.vatLi} color={getColorClass(student.vatLi)} />
                          <ScoreCard label={t.subjects.chemistry} value={student.hoaHoc} color={getColorClass(student.hoaHoc)} />
                          <ScoreCard label={t.subjects.biology} value={student.sinhHoc} color={getColorClass(student.sinhHoc)} />
                          <ScoreCard label={t.subjects.history} value={student.lichSu} color={getColorClass(student.lichSu)} />
                          <ScoreCard label={t.subjects.geography} value={student.diaLi} color={getColorClass(student.diaLi)} />
                          <ScoreCard label={t.subjects.civicEdu} value={student.gdcd} color={getColorClass(student.gdcd)} />
                          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[9px] text-slate-400 font-black mb-1 uppercase leading-none">{t.langCode}</p>
                            <p className={`text-xl font-black ${student.maNgoaiNgu ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {student.maNgoaiNgu ?? '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                  )}
                </section>

                {/* CHART CARD */}
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-600" /> {t.chartTitle}
                  </h2>
                  {reportData ? (
                      <div className="h-[300px] md:h-[400px]">
                        <Bar
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10, weight: 'bold' } } }
                              },
                              scales: {
                                y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
                                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
                              }
                            }}
                            data={{
                              labels: reportData.subjects.map(s => {
                                const key = s.toLowerCase().replace(/\s/g, "");
                                return t.subjects[key] || s;
                              }),
                              datasets: [
                                { label: '>= 8', data: reportData.level1, backgroundColor: '#10b981' },
                                { label: '6 - 8', data: reportData.level2, backgroundColor: '#3b82f6' },
                                { label: '4 - 6', data: reportData.level3, backgroundColor: '#f59e0b' },
                                { label: '< 4', data: reportData.level4, backgroundColor: '#ef4444' },
                              ]
                            }}
                        />
                      </div>
                  ) : <div className="h-64 flex items-center justify-center text-slate-300 italic">{t.loading}</div>}
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-span-12 lg:col-span-4">
                <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" /> {t.rankingTitle}
                  </h2>
                  <div className="space-y-3">
                    {top10.map((s, index) => {
                      let medalBg = 'bg-slate-200 text-slate-500';
                      if (index === 0) medalBg = 'bg-yellow-400 text-yellow-900 shadow-md shadow-yellow-100';
                      if (index === 1) medalBg = 'bg-slate-300 text-slate-700';
                      if (index === 2) medalBg = 'bg-orange-300 text-orange-900';
                      return (
                          <button
                              key={s.sbd}
                              onClick={() => fetchStudentDetails(s.sbd)}
                              className="w-full flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-indigo-400 hover:bg-white transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 flex items-center justify-center rounded-lg font-black text-[10px] ${medalBg}`}>
                            {index + 1}
                          </span>
                              <span className="font-bold text-slate-700 text-sm">{s.sbd}</span>
                            </div>
                            <span className="text-indigo-600 font-black text-lg">
                          {(s.toan + s.vatLi + s.hoaHoc).toFixed(2)}
                        </span>
                          </button>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* FOOTER - MOVED OUTSIDE GRID */}
          <footer className="mt-auto py-10 border-t border-slate-200 flex flex-col items-center justify-center gap-1.5 text-slate-400 bg-white/50">
            <p className="text-sm font-medium flex items-center gap-2">
              Made with <span className="text-rose-500 animate-pulse text-lg">❤️</span> by
              <span className="text-slate-700 font-extrabold hover:text-indigo-600 transition-colors cursor-default">
              Thien Nguyen
            </span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
              &copy; 2026 G-Scores Dashboard • All Rights Reserved
            </p>
          </footer>
        </main>
      </div>
  );
};

const ScoreCard = ({ label, value, color }) => (
    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition hover:scale-[1.03] hover:shadow-md">
      <p className="text-[9px] text-slate-400 font-black mb-1 uppercase leading-none">{label}</p>
      <p className={`text-xl font-black ${color}`}>
        {(value !== null && value !== undefined) ? value.toFixed(1) : '-'}
      </p>
    </div>
);

export default App;