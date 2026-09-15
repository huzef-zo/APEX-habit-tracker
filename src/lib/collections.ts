import { collectionsData } from './collections.generated';
import { Collection, Subcollection, BaseImage } from './collections.types';

export function getAllCollections(): Collection[] {
  return collectionsData.collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collectionsData.collections.find(c => c.slug === slug);
}

export function getAllSubcollectionsForCollection(collectionSlug: string): Subcollection[] {
  const collection = getCollectionBySlug(collectionSlug);
  return collection ? collection.subcollections : [];
}

export function getSubcollectionBySlug(
  collectionSlug: string,
  subcollectionSlug: string
): Subcollection | undefined {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return undefined;
  return collection.subcollections.find(s => s.slug === subcollectionSlug);
}

export function getImageById(id: string): BaseImage | undefined {
  for (const collection of collectionsData.collections) {
    for (const img of collection.images) {
      if (img.id === id) return img;
    }
    for (const sub of collection.subcollections) {
      for (const img of sub.images) {
        if (img.id === id) return img;
      }
    }
  }
  return undefined;
}

export function getCollectionCoverImage(collectionSlug: string): string | null {
  const collection = getCollectionBySlug(collectionSlug);
  return collection ? collection.coverImage : null;
}

export function getSubcollectionCoverImage(
  collectionSlug: string,
  subcollectionSlug: string
): string | null {
  const subcollection = getSubcollectionBySlug(collectionSlug, subcollectionSlug);
  return subcollection ? (subcollection.coverImage || null) : null;
}
