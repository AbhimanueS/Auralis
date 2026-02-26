import { useState } from 'react';

const designations = ['Psychologist', 'Psychiatrist', 'Therapist', 'Counsellor'];
const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function Counselling() {
  const [form, setForm] = useState({
    doctorName: '',
    designation: '',
    date: '',
    time: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Counselling panel */}
        <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-auralis-green/30 to-auralis-blue/30 flex items-center justify-center">
            <span className="text-6xl">👩‍⚕️</span>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-auralis-green-dark">Counselling</h2>
            <p className="text-gray-600 mt-2 text-sm">Book a session with a professional. We’re here to support you.</p>
          </div>
        </div>

        {/* Right: Book appointment */}
        <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-sky-200/50 to-auralis-green/20 flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-800">Book your appointment</h2>
          </div>
          <div className="p-6">
            {submitted ? (
              <p className="text-auralis-green-dark font-medium">Request received. We’ll confirm your appointment soon.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor&apos;s name</label>
                  <input
                    name="doctorName"
                    value={form.doctorName}
                    onChange={handleChange}
                    placeholder="Doctor's name"
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <select
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
                  >
                    <option value="">Select designation</option>
                    {designations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-sky-200 bg-sky-50/50 focus:outline-none focus:ring-2 focus:ring-auralis-green/50"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-100 text-amber-800 font-medium hover:bg-amber-200"
                >
                  Book now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
