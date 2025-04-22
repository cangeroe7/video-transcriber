import YouTubeFolder from "./youtube-folder"

export default function Page() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <YouTubeFolder
          imageUrl="/placeholder.svg?height=144&width=256"
          title="Favorite Music Videos"
          lastUpdated="2 days ago"
        />
        <YouTubeFolder
          imageUrl="/placeholder.svg?height=144&width=256"
          title="Cooking Tutorials"
          lastUpdated="1 week ago"
        />
        <YouTubeFolder
          imageUrl="/placeholder.svg?height=144&width=256"
          title="Travel Vlogs"
          lastUpdated="3 weeks ago"
        />
        <YouTubeFolder
          imageUrl="/placeholder.svg?height=144&width=256"
          title="Tech Reviews"
          lastUpdated="1 month ago"
        />
      </div>
    </div>
  )
}

