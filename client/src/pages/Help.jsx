export default function Help() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-auralis-green-dark mb-6">Help</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-gray-700 dark:text-gray-200 border border-sky-100 dark:border-gray-700 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2 text-auralis-green-dark dark:text-auralis-green">If you’re in immediate danger</h2>
          
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3 text-gray-500 dark:text-gray-400">Common emergency numbers (many countries)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-sky-100 dark:border-gray-600 px-4 py-3 bg-sky-50/60 dark:bg-gray-700/40">
              <div className="font-medium text-gray-800 dark:text-gray-100">Police</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">100 or 112</div>
            </div>
            <div className="rounded-xl border border-sky-100 dark:border-gray-600 px-4 py-3 bg-sky-50/60 dark:bg-gray-700/40">
              <div className="font-medium text-gray-800 dark:text-gray-100">Ambulance / Medical</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">102 or 112</div>
            </div>
            <div className="rounded-xl border border-sky-100 dark:border-gray-600 px-4 py-3 bg-sky-50/60 dark:bg-gray-700/40">
              <div className="font-medium text-gray-800 dark:text-gray-100">Fire</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">101 or 112</div>
            </div>
            <div className="rounded-xl border border-sky-100 dark:border-gray-600 px-4 py-3 bg-sky-50/60 dark:bg-gray-700/40">
              <div className="font-medium text-gray-800 dark:text-gray-100">Child helpline</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">1098 (India) or local child helpline</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Numbers can vary by country. If these don&apos;t work where you live, search online for your local emergency, ambulance, police and child-helpline numbers.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-2 text-gray-500 dark:text-gray-400">Mental health support</h2>
          <p className="text-sm">
            For ongoing support, please reach out to a trusted adult, school counsellor, therapist, or local mental health helpline in your region.
          </p>
        </section>
      </div>
    </div>
  );
}
