// components/LoadingSkeleton.jsx
// Animated shimmer skeleton that mirrors the AnimalProfile two-column layout.

function Bar({ w = 'w-full', h = 'h-4' }) {
  return <div className={`shimmer rounded-md ${w} ${h}`} />
}

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[40%_60%]">
      {/* Left column */}
      <div className="space-y-6">
        <div className="shimmer h-72 w-full rounded-card" />
        <div className="glass space-y-4 p-6">
          <Bar w="w-1/2" h="h-5" />
          <Bar w="w-3/4" />
          <Bar w="w-2/3" />
          <Bar w="w-1/2" />
          <div className="pt-2">
            <Bar w="w-40" h="h-7" />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="glass space-y-5 p-8">
        <Bar w="w-1/3" h="h-7" />
        <Bar />
        <Bar w="w-11/12" />
        <Bar w="w-4/5" />
        <div className="pt-4" />
        <Bar w="w-1/3" h="h-7" />
        <Bar />
        <Bar w="w-10/12" />
        <Bar w="w-3/4" />
        <div className="pt-4" />
        <Bar w="w-2/5" h="h-7" />
        <Bar w="w-11/12" />
        <Bar w="w-9/12" />
      </div>
    </div>
  )
}
