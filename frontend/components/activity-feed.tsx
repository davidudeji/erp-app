const activities = [
  {
    id: "1",
    user: "Alice Johnson",
    action: "Created invoice",
    target: "#INV-0042",
    time: "2 min ago",
    type: "invoice",
  },
  {
    id: "2",
    user: "Bob Smith",
    action: "Added product",
    target: "Laptop Pro X",
    time: "15 min ago",
    type: "product",
  },
  {
    id: "3",
    user: "Carol Williams",
    action: "Updated stock",
    target: "Office Chair",
    time: "1 hr ago",
    type: "inventory",
  },
  {
    id: "4",
    user: "David Lee",
    action: "Completed order",
    target: "#ORD-1234",
    time: "2 hr ago",
    type: "order",
  },
  {
    id: "5",
    user: "Eve Martinez",
    action: "Registered user",
    target: "operations@acme.com",
    time: "3 hr ago",
    type: "user",
  },
];

const typeColors: Record<string, string> = {
  invoice: "bg-blue-400/10 text-blue-400",
  product: "bg-purple-400/10 text-purple-400",
  inventory: "bg-yellow-400/10 text-yellow-400",
  order: "bg-emerald-400/10 text-emerald-400",
  user: "bg-pink-400/10 text-pink-400",
};

export default function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-400">Latest actions across the system</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${typeColors[activity.type] ?? "bg-gray-400/10 text-gray-400"}`}
            >
              {activity.user[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-gray-400">{activity.action}</span>{" "}
                <span className="font-medium text-cyan-300">{activity.target}</span>
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
