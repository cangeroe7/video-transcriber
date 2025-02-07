interface Video {
  id: string;
  name: string;
  url: string;
}

interface MockUIProps {
  folders?: { name: string; files: string[] }[];
  videos?: Video[];
}
export default function MockUI({ videos = [] }: MockUIProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {videos.map((video, index) => (
        <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">{video.name}</h3>
          <ul className="mt-2 list-disc list-inside">
            {videos.map((video, videoIndex) => (
              <li key={videoIndex} className="text-gray-600">
                {video.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {videos.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">Videos</h3>
          <ul className="mt-2 list-disc list-inside">
            {videos.map((video) => (
              <li key={video.id} className="text-gray-600">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  {video.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
