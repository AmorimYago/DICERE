"use client";

import React from "react";

type Props = {
  imageUrl?: string | null;
  icon?: string | null;
  alt?: string;
  className?: string;
  size?: number;
};

export default function CategoryIcon({
  imageUrl,
  icon,
  alt = "",
  className = "",
  size = 64,
}: Props) {
  const [erro, setErro] = React.useState(false);
  const hasImage = !!imageUrl && !erro;

  if (hasImage) {
    return (
      <img
        src={imageUrl as string}
        alt={alt}
        width={size}
        height={size}
        className={`${className} object-cover rounded-md`}
        onError={() => setErro(true)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center text-3xl`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {icon ?? "❓"}
    </div>
  );
}