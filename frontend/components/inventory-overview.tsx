const items = [
  { name: "Laptops", stock: 142, max: 200, color: "bg-cyan-400" },
  { name: "Office Chairs", stock: 38, max: 100, color: "bg-blue-400" },
  { name: "Monitors", stock: 67, max: 150, color: "bg-purple-400" },
  { name: "Keyboards", stock: 12, max: 80, color: "bg-yellow-400" },
  { name: "Headsets", stock: 89, max: 120, color: "bg-emerald-400" },
];

export default function InventoryOverview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Inventory Status</h3>
        <p className="mt-1 text-sm text-gray-400">Top product stock levels</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const pct = Math.round((item.stock / item.max) * 100);
          return (
            <div key={item.name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-white">{item.name}</span>
                <span className="text-gray-400">
                  {item.stock}/{item.max}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-0.5 text-right text-xs text-gray-500">{pct}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
