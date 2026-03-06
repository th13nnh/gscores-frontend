import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Search, Trophy, BarChart3, GraduationCap, LayoutDashboard } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [sbd, setSbd] = useState('');
  const [student, setStudent] = useState(null);
  const [top10, setTop10] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const fetchGlobalData = async () => {
    try {
      const [topRes, reportRes] = await Promise.all([
        axios.get('http://localhost:8080/api/students/top10'),
        axios.get('http://localhost:8080/api/students/report')
      ]);
      setTop10(topRes.data);
      setReportData(reportRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!sbd) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/students/${sbd}`);
      setStudent(res.data);
    } catch (err) {
      alert("Student ID not found!");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex min-h-screen bg-slate-50">
        {/* SIDEBAR */}
        <aside className="w-64 bg-indigo-900 text-white hidden md:block">
          <div className="p-6 text-2xl font-bold flex items-center gap-2">
            <GraduationCap size={32} /> G-Scores
          </div>
          <nav className="mt-10 px-4">
            <div className="flex items-center gap-3 p-3 bg-indigo-800 rounded-lg mb-2">
              <LayoutDashboard size={20} /> Dashboard
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Exam Results 2024</h1>
            <p className="text-slate-500">Golden Owl Internship Assignment</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: SEARCH & TOP 10 */}
            <div className="lg:col-span-2 space-y-8">

              {/* SEARCH CARD */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Search size={20} className="text-indigo-600" /> Check Student Score
                </h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Enter Registration Number (SBD)..."
                      value={sbd}
                      onChange={(e) => setSbd(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {student && (
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                      <ScoreItem label="Math" value={student.toan} />
                      <ScoreItem label="Literature" value={student.nguVan} />
                      <ScoreItem label="English" value={student.ngoaiNgu} />
                      <ScoreItem label="Physics" value={student.vatLi} />
                      <ScoreItem label="Chemistry" value={student.hoaHoc} />
                      <ScoreItem label="Biology" value={student.sinhHoc} />
                    </div>
                )}
              </div>

              {/* CHART CARD */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-indigo-600" /> Subject Distribution
                </h2>
                {reportData ? (
                    <div className="h-80">
                      <Bar
                          options={{ responsive: true, maintainAspectRatio: false }}
                          data={{
                            labels: reportData.subjects,
                            datasets: [
                              { label: '>= 8', data: reportData.level1, backgroundColor: '#10b981' },
                              { label: '6-8', data: reportData.level2, backgroundColor: '#3b82f6' },
                              { label: '4-6', data: reportData.level3, backgroundColor: '#f59e0b' },
                              { label: '< 4', data: reportData.level4, backgroundColor: '#ef4444' },
                            ]
                          }}
                      />
                    </div>
                ) : <p>Loading chart data...</p>}
              </div>
            </div>

            {/* RIGHT COLUMN: TOP 10 */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" /> Top 10 Group A
                </h2>
                <div className="space-y-4">
                  {top10.map((s, index) => (
                      <div key={s.sbd} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                        <div>
                          <span className="text-xs font-bold text-slate-400 mr-2">#{index + 1}</span>
                          <span className="font-medium text-slate-700">{s.sbd}</span>
                        </div>
                        <span className="text-indigo-600 font-bold">
                      {(s.toan + s.vatLi + s.hoaHoc).toFixed(2)}
                    </span>
                      </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
  );
};

const ScoreItem = ({ label, value }) => (
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
      <p className="text-lg font-semibold text-slate-800">{value ?? 'N/A'}</p>
    </div>
);

export default App;