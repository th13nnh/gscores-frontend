import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Search, Trophy, BarChart3, GraduationCap, LayoutDashboard } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const translations = {
  en: {
    flag: "🇺🇸",
    langName: "English",
    title: "Exam Results 2024",
    dashboard: "Dashboard",
    lookupTitle: "Score Lookup",
    placeholder: "Enter Student ID...",
    searchBtn: "Search",
    reportFor: "Report for Student ID",
    langCode: "Lang Code",
    chartTitle: "Score Level Distribution",
    rankingTitle: "Top 10 Group A",
    loading: "Compiling data...",
    notFound: "Student ID not found!",
    subjects: {
      math: "Math", literature: "Literature", english: "English",
      physics: "Physics", chemistry: "Chemistry", biology: "Biology",
      history: "History", geography: "Geography", civicEdu: "Civic Edu"
    }
  },
  vi: {
    flag: "🇻🇳",
    langName: "Tiếng Việt",
    title: "Kết Quả Kỳ Thi 2024",
    dashboard: "Bảng Điều Khiển",
    lookupTitle: "Tra Cứu Điểm",
    placeholder: "Nhập số báo danh (SBD)...",
    searchBtn: "Tìm Kiếm",
    reportFor: "Kết quả cho SBD",
    langCode: "Mã Ngoại Ngữ",
    chartTitle: "Phân Phối Mức Điểm",
    rankingTitle: "Top 10 Khối A",
    loading: "Đang tải dữ liệu...",
    notFound: "Không tìm thấy số báo danh này!",
    subjects: {
      math: "Toán", literature: "Ngữ Văn", english: "Ngoại Ngữ",
      physics: "Vật Lí", chemistry: "Hóa Học", biology: "Sinh Học",
      history: "Lịch Sử", geography: "Địa Lí", civicEdu: "GDCD"
    }
  }
};

const App = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

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
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!sbdInput) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/students/${sbdInput}`);
      setStudent(res.data);
    } catch (err) {
      alert(t.notFound);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (value) => {
    if (value === null || value === undefined) return 'text-slate-800';
    if (value >= 8) return 'text-emerald-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* SIDEBAR */}
        <aside className="w-64 bg-indigo-950 text-white hidden md:flex flex-col shrink-0 shadow-2xl">
          <div className="p-6 text-2xl font-bold flex items-center gap-2 border-b border-indigo-900">
            <GraduationCap size={32} className="text-indigo-400" /> G-Scores
          </div>
          <nav className="mt-8 px-4 flex-1">
            <div className="flex items-center gap-3 p-3 bg-indigo-800 rounded-xl shadow-lg">
              <LayoutDashboard size={20} /> {t.dashboard}
            </div>
          </nav>
        </aside>

        {/* MAIN DASHBOARD */}
        <main className="flex-1 p-4 md:p-10 overflow-x-hidden relative">

          {/* TOP RIGHT LANGUAGE TOGGLE */}
          <div className="absolute top-6 right-10 z-50">
            <button
                onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 font-bold text-slate-700"
            >
              <span className="text-xl">{t.flag}</span>
              <span>{t.langName}</span>
            </button>
          </div>

          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">{t.title}</h1>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full mt-2"></div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* SEARCH CARD */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                  <Search size={22} className="text-indigo-600" /> {t.lookupTitle}
                </h2>
                <form onSubmit={handleSearch} className="flex gap-3">
                  <input
                      className="flex-1 border-2 border-slate-100 bg-slate-50 rounded-2xl px-5 py-3 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
                      placeholder={t.placeholder}
                      value={sbdInput}
                      onChange={(e) => setSbdInput(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100">
                    {loading ? '...' : t.searchBtn}
                  </button>
                </form>

                {student && (
                    <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                      <h3 className="text-sm font-black text-slate-400 mb-6 uppercase tracking-widest">
                        {t.reportFor}: <span className="text-indigo-600">{student.sbd}</span>
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        <ScoreCard label={t.subjects.math} value={student.toan} color={getColorClass(student.toan)} />
                        <ScoreCard label={t.subjects.literature} value={student.nguVan} color={getColorClass(student.nguVan)} />
                        <ScoreCard label={t.subjects.english} value={student.ngoaiNgu} color={getColorClass(student.ngoaiNgu)} />
                        <ScoreCard label={t.subjects.physics} value={student.vatLi} color={getColorClass(student.vatLi)} />
                        <ScoreCard label={t.subjects.chemistry} value={student.hoaHoc} color={getColorClass(student.hoaHoc)} />
                        <ScoreCard label={t.subjects.biology} value={student.sinhHoc} color={getColorClass(student.sinhHoc)} />
                        <ScoreCard label={t.subjects.history} value={student.lichSu} color={getColorClass(student.lichSu)} />
                        <ScoreCard label={t.subjects.geography} value={student.diaLi} color={getColorClass(student.diaLi)} />
                        <ScoreCard label={t.subjects.civicEdu} value={student.gdcd} color={getColorClass(student.gdcd)} />
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition hover:scale-105">
                          <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-tighter">{t.langCode}</p>
                          <p className={`text-2xl font-black ${student.maNgoaiNgu ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {student.maNgoaiNgu ?? '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                )}
              </div>

              {/* CHART CARD */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                  <BarChart3 size={22} className="text-indigo-600" /> {t.chartTitle}
                </h2>
                {reportData ? (
                    <div className="h-[420px]">
                      <Bar
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  usePointStyle: false, // FALSE makes it rectangular
                                  boxWidth: 20,
                                  boxHeight: 12,
                                  font: { weight: 'bold' }
                                }
                              }
                            },
                            scales: {
                              y: { grid: { display: false }, ticks: { font: { weight: 'bold' } } },
                              x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
                            }
                          }}
                          data={{
                            labels: reportData.subjects.map(s => {
                              const key = s.toLowerCase().replace(" ", "");
                              if (key === 'civicedu') return t.subjects.civicEdu;
                              return t.subjects[key] || s;
                            }),
                            datasets: [
                              { label: '>= 8 pts', data: reportData.level1, backgroundColor: '#10b981' },
                              { label: '6 - 8 pts', data: reportData.level2, backgroundColor: '#3b82f6' },
                              { label: '4 - 6 pts', data: reportData.level3, backgroundColor: '#f59e0b' },
                              { label: '< 4 pts', data: reportData.level4, backgroundColor: '#ef4444' },
                            ]
                          }}
                      />
                    </div>
                ) : <div className="h-64 flex items-center justify-center text-slate-400 italic">{t.loading}</div>}
              </div>
            </div>

            {/* RIGHT: RANKING */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
                  <Trophy size={22} className="text-amber-500" /> {t.rankingTitle}
                </h2>
                <div className="space-y-4">
                  {top10.map((s, index) => {
                    let medalBg = 'bg-slate-200 text-slate-500';
                    if (index === 0) medalBg = 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-100';
                    if (index === 1) medalBg = 'bg-slate-300 text-slate-700';
                    if (index === 2) medalBg = 'bg-orange-300 text-orange-900';
                    return (
                        <div key={s.sbd} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-default shadow-sm hover:shadow-md">
                          <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-xl font-black text-xs ${medalBg}`}>
                          {index + 1}
                        </span>
                            <span className="font-bold text-slate-700 tracking-tight">{s.sbd}</span>
                          </div>
                          <span className="text-indigo-600 font-black text-xl group-hover:scale-110 transition-transform">
                        {(s.toan + s.vatLi + s.hoaHoc).toFixed(2)}
                      </span>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

const ScoreCard = ({ label, value, color }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition hover:scale-105 hover:shadow-md">
      <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-tighter leading-none">{label}</p>
      <p className={`text-2xl font-black ${color}`}>
        {(value !== null && value !== undefined) ? value.toFixed(1) : '-'}
      </p>
    </div>
);

export default App;