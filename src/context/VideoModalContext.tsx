"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type VideoPayload = {
  youtubeId: string;
  title: string;
};

type VideoModalContextValue = {
  openVideo: (payload: VideoPayload) => void;
  closeVideo: () => void;
  active: VideoPayload | null;
};

const VideoModalContext = createContext<VideoModalContextValue | null>(null);

export function VideoModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<VideoPayload | null>(null);

  const openVideo = useCallback((payload: VideoPayload) => {
    setActive(payload);
  }, []);

  const closeVideo = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, closeVideo]);

  const value = useMemo(
    () => ({ openVideo, closeVideo, active }),
    [openVideo, closeVideo, active]
  );

  return (
    <VideoModalContext.Provider value={value}>
      {children}
      {active ? (
        <div
          className="kh-video-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={closeVideo}
        >
          <div
            className="kh-video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="kh-video-modal-bar">
              <h3 className="kh-video-modal-title">{active.title}</h3>
              <button
                type="button"
                className="kh-video-modal-close"
                onClick={closeVideo}
                aria-label="Bağla"
              >
                ×
              </button>
            </div>
            <div className="kh-video-modal-player">
              <iframe
                key={active.youtubeId}
                src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="kh-video-modal-iframe"
              />
            </div>
          </div>
        </div>
      ) : null}
    </VideoModalContext.Provider>
  );
}

export function useVideoModal() {
  const ctx = useContext(VideoModalContext);
  if (!ctx) {
    throw new Error("useVideoModal must be used within VideoModalProvider");
  }
  return ctx;
}
