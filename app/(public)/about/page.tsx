export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Marketing Assistant
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're revolutionizing how businesses create marketing content with the power of artificial intelligence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              To democratize professional marketing content creation by making AI-powered tools accessible to businesses of all sizes.
            </p>
            <p className="text-gray-300">
              We believe that great marketing shouldn't be limited by budget or technical expertise. Our platform empowers everyone to create stunning, effective marketing materials.
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white border border-purple-500/20">
            <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
            <ul className="space-y-3">
              <li>• AI-powered content generation</li>
              <li>• Professional quality results</li>
              <li>• Easy-to-use interface</li>
              <li>• Multiple content formats</li>
              <li>• Brand consistency tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
