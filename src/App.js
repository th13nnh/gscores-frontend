import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [sbd, setSbd] = useState('');
  const [student, setStudent] = useState(null);
  const [top10, setTop10] = useState([]);
  const [reportData, setReportData] = useState(null);

  // 1. Search Logic
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/students/${sbd}`);
      setStudent(res.data);
    } catch (err) {
      alert("Student not found!");
    }
  };

  // 2. Load Top 10 and Reports on startup
  useEffect(() => {
    axios.get('http://localhost:8080/api/students/top10').then(res => setTop10(res.data));
    axios.get('http://localhost:8080/api/students/report').then(res => setReportData(res.data));
  }, []);

  return (
      <div style={{ padding: '20px', fontFamily: 'Rubik, sans-serif' }}>
        <h1>G-Scores Dashboard</h1>

        {/* SEARCH SECTION */}
        <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd' }}>
          <h2>Check Score</h2>
          <input
              value={sbd}
              onChange={(e) => setSbd(e.target.value)}
              placeholder="Enter SBD (e.g. 01000001)"
          />
          <button onClick={handleSearch}>Search</button>

          {student && (
              <div style={{ marginTop: '20px' }}>
                <p><strong>Math:</strong> {student.toan}</p>
                <p><strong>Literature:</strong> {student.nguVan}</p>
                <p><strong>English:</strong> {student.ngoaiNgu}</p>
              </div>
          )}
        </section>

        {/* TOP 10 SECTION */}
        <section>
          <h2>Top 10 Group A (Math, Phys, Chem)</h2>
          <table border="1" width="100%">
            <thead>
            <tr><th>SBD</th><th>Math</th><th>Physics</th><th>Chemistry</th><th>Total</th></tr>
            </thead>
            <tbody>
            {top10.map(s => (
                <tr key={s.sbd}>
                  <td>{s.sbd}</td><td>{s.toan}</td><td>{s.vatLi}</td><td>{s.hoaHoc}</td>
                  <td>{(s.toan + s.vatLi + s.hoaHoc).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>

        {/* CHART SECTION */}
        {reportData && (
            <section style={{ marginTop: '40px' }}>
              <h2>Score Statistics (Math)</h2>
              <div style={{ maxWidth: '600px' }}>
                <Bar
                    data={{
                      labels: reportData.levels,
                      datasets: [{ label: 'Number of Students', data: reportData.math_data, backgroundColor: 'rgba(54, 162, 235, 0.5)' }]
                    }}
                />
              </div>
            </section>
        )}
      </div>
  );
}

export default App;