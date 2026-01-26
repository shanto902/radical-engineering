import PaddingContainer from '@/components/common/PaddingContainer';
import { fetchDownloads } from '@/helper/fetchFromDirectus';
import React from 'react';

export const metadata = {
  title: 'Downloads | Radical Engineering',
  description: 'Access and download our latest resources, catalogs, and technical documents.',
};

const DownloadsPage = async () => {
  const downloads = await fetchDownloads();

  return (
    <main className="min-h-screen bg-background ">
      {/* Hero Section */}
      {/* <section className="bg-primary text-background py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-background/10"></div>
        <PaddingContainer className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold  tracking-tight">
            Downloads
          </h1>
          
        </PaddingContainer>
      </section> */}

      {/* Downloads Grid */}
      <PaddingContainer className=" mx-auto px-4 py-16">
        {downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="bg-background group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border  flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 rounded-xl bg-background text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.name}
                  </h2>
                  {item.description && (
                    <p className="text-foreground leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <a
                    href={`${process.env.NEXT_PUBLIC_ASSETS_URL}/${item.file}?download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--secondary)] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-[var(--secondary)]/25"
                  >
                    <span>Download File</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l-3 3m3-3v-7.5"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No downloads found
            </h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any resources available for download at this time. Please check back later.
            </p>
          </div>
        )}
      </PaddingContainer>
    </main>
  );
};

export default DownloadsPage;