export function getWeaveSpecs(material) {
  if (!material) return null;
  const m = material.toLowerCase();

  if (m.includes("linen")) {
    return {
      type: "linen",
      construction: "Plain Weave with Organic Slubs",
      yarnWeight: "60 Lea Long-Staple flax yarn",
      provenance: "Courtrai, Flanders (Belgium)",
      certification: "Masters of Linen® certified organic Belgian flax",
      breathability: 98,
      drape: 65,
      softness: 72,
      warpDensity: "45 threads/inch",
      weftDensity: "40 threads/inch",
      details:
        "Hand-harvested flax fibers woven with traditional plain cross-structures. Showcases authentic irregular slub nodes for natural, airy ventilation.",
    };
  } else if (m.includes("silk") || m.includes("satin")) {
    return {
      type: "silk",
      construction: "Satin Float Weave",
      yarnWeight: "22 Momme heavy-weight silk charmeuse",
      provenance: "Lake Como, Lombardy (Italy)",
      certification: "OEKO-TEX® Standard 100 organic mulberry silk",
      breathability: 88,
      drape: 98,
      softness: 96,
      warpDensity: "120 threads/inch",
      weftDensity: "110 threads/inch",
      details:
        "Concealed floating warp lines cross over four weft threads, creating a highly lustrous, liquid-drape reflection that floats organically over the skin.",
    };
  } else if (m.includes("cashmere") || m.includes("wool")) {
    return {
      type: "wool",
      construction: "Ribbed Knit / 2x2 Twill",
      yarnWeight: "12 Gauge Grade-A double-ply cashmere",
      provenance: "Alashan Highlands, Gobi Desert (Inner Mongolia)",
      certification: "GOTS certified organic, Sustainable Cashmere Union",
      breathability: 82,
      drape: 78,
      softness: 98,
      warpDensity: "N/A (Weft-Knit loops)",
      weftDensity: "N/A (Weft-Knit loops)",
      details:
        "Crafted from ultra-fine undercoat cashmere fibers (under 15 microns) loop-interlocked for maximum thermal loft and luxurious softness.",
    };
  } else if (m.includes("leather")) {
    return {
      type: "leather",
      construction: "Interlocking Protein Fiber Matrix",
      yarnWeight: "1.2mm buttery-soft full-grain hide",
      provenance: "Santa Croce sull’Arno, Tuscany (Italy)",
      certification: "Leather Working Group (LWG) Gold-Rated Tannery",
      breathability: 45,
      drape: 50,
      softness: 85,
      warpDensity: "N/A (Full-Grain Pebble)",
      weftDensity: "N/A (Full-Grain Pebble)",
      details:
        "Unaltered full-grain calf leather utilizing organic vegetable dyes. Displays natural grain patterns with self-healing properties.",
    };
  } else if (m.includes("tencel") || m.includes("viscose")) {
    return {
      type: "tencel",
      construction: "Micro-Fine Plain Weave",
      yarnWeight: "150 GSM ultra-fluid spun yarn",
      provenance: "Heiligenkreuz (Austria)",
      certification: "Lenzing™ certified sustainable closed-loop Viscose",
      breathability: 90,
      drape: 92,
      softness: 88,
      warpDensity: "85 threads/inch",
      weftDensity: "80 threads/inch",
      details:
        "Regenerated cellulose fibers derived from sustainably harvested wood pulp. Woven into a micro-fine weave for a cooling skin touch.",
    };
  } else {
    // Default to Cotton / Cotton Canvas / Denim / Gabardine
    return {
      type: "cotton",
      construction: "Plain/Twill Weave Combo",
      yarnWeight: "40s Combed Long-Staple Egyptian Giza",
      provenance: "Damiette, Nile Delta (Egypt)",
      certification: "GOTS and BCI certified organic combed cotton",
      breathability: 85,
      drape: 72,
      softness: 80,
      warpDensity: "72 threads/inch",
      weftDensity: "68 threads/inch",
      details:
        "Premium long-staple organic cotton fibers combed to remove short fly fibers and spun tightly for durable, structured, and soft luxury drapes.",
    };
  }
}
