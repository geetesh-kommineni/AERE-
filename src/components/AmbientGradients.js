'use client';

export default function AmbientGradients() {
  return (
    <div className="ambient-gradients-container">
      {/* Drifting warm rose-gold blob */}
      <div className="ambient-mesh-blob blob-rose" />
      
      {/* Drifting warm sand blob */}
      <div className="ambient-mesh-blob blob-sand" />
      
      {/* Center-drifting ivory/cream blob */}
      <div className="ambient-mesh-blob blob-cream" />
    </div>
  );
}
