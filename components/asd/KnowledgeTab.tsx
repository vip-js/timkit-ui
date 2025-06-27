export default function KnowledgeTab() {
  return (
    <div className="space-y-4 px-4">
      <h1 className="text-xl font-semibold text-gray-900">Knowledge Center</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <img
          src="https://readdy.ai/api/search-image?query=professional%20educational%20content%20about%20autism%20spectrum%20disorder%2C%20clean%20modern%20design%2C%20educational%20illustrations%2C%20high%20quality&width=640&height=360&seq=30&orientation=landscape"
          alt="ASD Guide"
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold">Understanding ASD</h2>
          <p className="text-sm text-gray-600">
            Comprehensive guide to autism spectrum disorder, its signs, and early
            intervention strategies.
          </p>
        </div>
      </div>
    </div>
  )
}
