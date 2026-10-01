export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
import { Asset, CharacterAsset, LocationAsset, PropAsset } from '../types';
/**
 * An asset is "empty" if it has no user/AI-generated content:
 * - No autofilled descriptions (physicalCharacteristics, clothing, backstory, timeOfDay)
 * - No generated or imported images
 * - No user-written description
 * - No inspiration image
 */
export function isAssetEmpty(asset: Asset): boolean {
  const hasNoImages = asset.supportingImages.length === 0;
  const hasNoInspiration = !asset.inspirationImage;
  const hasNoDescription = !asset.description;
  const hasNoTypeFields = (() => {
    if (asset.type === 'character') {
      const a = asset as CharacterAsset;
      return !a.physicalCharacteristics && !a.clothingAccessories && !a.backstory;
    }
    if (asset.type === 'location') {
      const a = asset as LocationAsset;
      return !a.physicalCharacteristics && !a.timeOfDay;
    }
    return !(asset as PropAsset).physicalCharacteristics;
  })();
  return hasNoImages && hasNoTypeFields && hasNoDescription && hasNoInspiration;
}
/**
 * Find assets whose names no longer appear anywhere in the script text.
 * Uses conservative case-insensitive substring matching to avoid false positives.
 */
export function findOrphanedAssets(assets: Asset[], script: string): Asset[] {
  const lowerScript = script.toLowerCase();
  return assets.filter(asset => !lowerScript.includes(asset.name.toLowerCase()));
}