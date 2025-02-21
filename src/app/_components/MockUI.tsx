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
    <div className="rounded-lg bg-gray-100 p-4 shadow-md">
      {videos.map((video, index) => (
        <div
          key={index}
          className="mb-4 rounded-lg border border-gray-300 bg-white p-4"
        >
          <h3 className="text-lg font-semibold text-gray-800">{video.name}</h3>
          <ul className="mt-2 list-inside list-disc">
            {videos.map((video, videoIndex) => (
              <li key={videoIndex} className="text-gray-600">
                {video.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {videos.length > 0 && (
        <div className="mt-4 rounded-lg border border-gray-300 bg-white p-4">
          <h3 className="text-lg font-semibold text-gray-800">Videos</h3>
          <ul className="mt-2 list-inside list-disc">
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
