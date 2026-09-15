export interface BaseImage {
  id: string;
  src: string;
  alt: string;
  fileName: string;
  collectionSlug: string;
  subcollectionSlug: string | null;
  collectionPrefix: string;
  subcollectionPrefix: string | null;
  order: number;
}

export interface CollectionImage extends BaseImage {
  subcollectionSlug: null;
  subcollectionPrefix: null;
}

export interface SubcollectionImage extends BaseImage {
  subcollectionSlug: string;
  subcollectionPrefix: string;
}

export interface Subcollection {
  slug: string;
  name: string;
  prefix: string;
  collectionSlug: string;
  description?: string;
  order: number;
  coverImage?: string | null;
  images: SubcollectionImage[];
}

export interface Collection {
  slug: string;
  name: string;
  prefix: string;
  description?: string;
  order: number;
  coverImage: string | null;
  images: CollectionImage[];
  subcollections: Subcollection[];
}

export interface GeneratedCollections {
  collections: Collection[];
  generatedAt: string;
  totalCollections: number;
  totalSubcollections: number;
  totalImages: number;
}
