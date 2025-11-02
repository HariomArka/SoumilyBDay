// src/components/useImageMaps.ts
export function useImageMaps() {
  // Eagerly import all images from each folder. Adjust extensions as needed.
  const second = import.meta.glob('../assets/2ndsem/*.{png,jpg,jpeg,webp,gif}', { eager: true, import: 'default' }) as Record<string, string>;
  const third  = import.meta.glob('../assets/3rdsem/*.{png,jpg,jpeg,webp,gif}', { eager: true, import: 'default' }) as Record<string, string>;
  const fourth = import.meta.glob('../assets/4thsem/*.{png,jpg,jpeg,webp,gif}', { eager: true, import: 'default' }) as Record<string, string>;
  const fifth  = import.meta.glob('../assets/5thsem/*.{png,jpg,jpeg,webp,gif}', { eager: true, import: 'default' }) as Record<string, string>;
  const summer = import.meta.glob('../assets/summer/*.{png,jpg,jpeg,webp,gif}',  { eager: true, import: 'default' }) as Record<string, string>;

  const toSortedArray = (map: Record<string, string>) =>
    Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([, url]) => url);

  return {
    '2nd': toSortedArray(second),
    '3rd': toSortedArray(third),
    '4th': toSortedArray(fourth),
    '5th': toSortedArray(fifth),
    'summer': toSortedArray(summer),
  };
}
