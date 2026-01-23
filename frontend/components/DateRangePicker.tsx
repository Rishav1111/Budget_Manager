'use client';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(startDate, e.target.value);
  };

  const setQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    onChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    
    onChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  const setThisYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    
    onChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setQuickRange(7)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Last 7 days
        </button>
        <button
          onClick={() => setQuickRange(30)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Last 30 days
        </button>
        <button
          onClick={() => setQuickRange(90)}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Last 90 days
        </button>
        <button
          onClick={setThisMonth}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          This Month
        </button>
        <button
          onClick={setLastMonth}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Last Month
        </button>
        <button
          onClick={setThisYear}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          This Year
        </button>
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartChange}
            className="px-3 py-1.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndChange}
            className="px-3 py-1.5 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
