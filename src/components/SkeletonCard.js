"use client";

export default function SkeletonCard() {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Aspect Ratio 3:4 Image block shimmer */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3/4",
          backgroundColor: "rgba(158,139,124,0.06)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "1.2rem",
        }}
      >
        <div
          className="skeleton-shimmer"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            transform: "translateX(-100%)",
            animation: "shimmer 1.8s infinite",
          }}
        />
      </div>

      {/* Title Shimmer */}
      <div
        style={{
          width: "60%",
          height: "14px",
          backgroundColor: "rgba(158,139,124,0.1)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "0.6rem",
        }}
      >
        <div
          className="skeleton-shimmer"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            transform: "translateX(-100%)",
            animation: "shimmer 1.8s infinite",
          }}
        />
      </div>

      {/* Meta row Shimmer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Material placeholder */}
        <div
          style={{
            width: "35%",
            height: "10px",
            backgroundColor: "rgba(158,139,124,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="skeleton-shimmer"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              transform: "translateX(-100%)",
              animation: "shimmer 1.8s infinite",
            }}
          />
        </div>

        {/* Price placeholder */}
        <div
          style={{
            width: "20%",
            height: "12px",
            backgroundColor: "rgba(158,139,124,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="skeleton-shimmer"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              transform: "translateX(-100%)",
              animation: "shimmer 1.8s infinite",
            }}
          />
        </div>
      </div>
    </div>
  );
}
