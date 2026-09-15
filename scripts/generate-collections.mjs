import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const COLLECTIONS_DIR = path.join(rootDir, 'public', 'collections');
const OUTPUT_TS_FILE = path.join(rootDir, 'src', 'lib', 'collections.generated.ts');
const OUTPUT_JSON_FILE = path.join(rootDir, 'src', 'lib', 'collections.generated.json');

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const BRAND_PREFIX = 'NLX';

function isImageFile(filename) {
  if (filename.startsWith('.')) return false;
  if (filename === '.gitkeep') return false;
  const ext = path.extname(filename).toLowerCase();
  return VALID_EXTENSIONS.has(ext);
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function slugToName(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function generatePrefix(slug) {
  const parts = slug.split(/[-_]/).filter(Boolean);
  if (parts.length === 1) {
    const word = parts[0].toUpperCase();
    if (word.length <= 3) return word;
    // e.g. "OSHAPE" -> "OSH" or vowels removal / first 3 chars
    return word.slice(0, 3);
  }
  return parts.map(p => p.charAt(0).toUpperCase()).join('');
}

function readJsonFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      console.warn(`Warning: Could not parse JSON at ${filePath}`, e.message);
    }
  }
  return {};
}

function getCoverImage(dirPath, publicPrefix) {
  if (!fs.existsSync(dirPath)) return null;
  const files = fs.readdirSync(dirPath);
  const coverFile = files.find(f => {
    if (!isImageFile(f)) return false;
    const nameWithoutExt = path.parse(f).name.toLowerCase();
    return nameWithoutExt === 'cover';
  });
  if (coverFile) {
    return `${publicPrefix}/${coverFile}`;
  }
  return null;
}

function formatNumber(num, length = 3) {
  return String(num).padStart(length, '0');
}

function generateCollectionsData() {
  if (!fs.existsSync(COLLECTIONS_DIR)) {
    console.warn(`Collections directory does not exist at ${COLLECTIONS_DIR}. Creating...`);
    fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });
  }

  const collectionFolderNames = fs.readdirSync(COLLECTIONS_DIR).filter(item => {
    if (item.startsWith('.')) return false;
    const itemPath = path.join(COLLECTIONS_DIR, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const rawCollections = [];
  let totalSubcollections = 0;
  let totalImages = 0;

  for (const collectionFolder of collectionFolderNames) {
    const collectionPath = path.join(COLLECTIONS_DIR, collectionFolder);
    const metaPath = path.join(collectionPath, 'meta.json');
    const meta = readJsonFile(metaPath);

    const slug = meta.slug || collectionFolder;
    const name = meta.name || slugToName(collectionFolder);
    const prefix = (meta.prefix || generatePrefix(slug)).toUpperCase();
    const description = meta.description;
    const order = typeof meta.order === 'number' ? meta.order : Infinity;

    // Collection level images
    const imagesDir = path.join(collectionPath, 'images');
    const collectionImages = [];
    if (fs.existsSync(imagesDir)) {
      const imageFiles = fs.readdirSync(imagesDir).filter(isImageFile).sort(naturalCompare);
      imageFiles.forEach((fileName, index) => {
        const seqNum = formatNumber(index + 1);
        const id = `${BRAND_PREFIX}-${prefix}-MAIN-${seqNum}`;
        const src = `/collections/${slug}/images/${fileName}`;
        const alt = `${name} - Image ${index + 1}`;
        collectionImages.push({
          id,
          src,
          alt,
          fileName,
          collectionSlug: slug,
          subcollectionSlug: null,
          collectionPrefix: prefix,
          subcollectionPrefix: null,
          order: index + 1
        });
      });
    }

    // Collection cover image
    let coverImage = getCoverImage(collectionPath, `/collections/${slug}`);
    if (!coverImage && collectionImages.length > 0) {
      coverImage = collectionImages[0].src;
    }

    // Subcollections
    const subcollectionsDir = path.join(collectionPath, 'subcollections');
    const subcollections = [];

    if (fs.existsSync(subcollectionsDir)) {
      const subFolderNames = fs.readdirSync(subcollectionsDir).filter(item => {
        if (item.startsWith('.')) return false;
        const itemPath = path.join(subcollectionsDir, item);
        return fs.statSync(itemPath).isDirectory();
      });

      for (const subFolder of subFolderNames) {
        const subPath = path.join(subcollectionsDir, subFolder);
        const subMetaPath = path.join(subPath, 'meta.json');
        const subMeta = readJsonFile(subMetaPath);

        const subSlug = subMeta.slug || subFolder;
        const subName = subMeta.name || slugToName(subFolder);
        const subPrefix = (subMeta.prefix || generatePrefix(subSlug)).toUpperCase();
        const subDescription = subMeta.description;
        const subOrder = typeof subMeta.order === 'number' ? subMeta.order : Infinity;

        const subImagesDir = path.join(subPath, 'images');
        const subImages = [];
        if (fs.existsSync(subImagesDir)) {
          const subImageFiles = fs.readdirSync(subImagesDir).filter(isImageFile).sort(naturalCompare);
          subImageFiles.forEach((fileName, index) => {
            const seqNum = formatNumber(index + 1);
            const id = `${BRAND_PREFIX}-${prefix}-${subPrefix}-${seqNum}`;
            const src = `/collections/${slug}/subcollections/${subSlug}/images/${fileName}`;
            const alt = `${name} - ${subName} - Image ${index + 1}`;
            subImages.push({
              id,
              src,
              alt,
              fileName,
              collectionSlug: slug,
              subcollectionSlug: subSlug,
              collectionPrefix: prefix,
              subcollectionPrefix: subPrefix,
              order: index + 1
            });
          });
        }

        let subCoverImage = getCoverImage(subPath, `/collections/${slug}/subcollections/${subSlug}`);
        if (!subCoverImage && subImages.length > 0) {
          subCoverImage = subImages[0].src;
        }

        totalSubcollections++;
        totalImages += subImages.length;

        subcollections.push({
          slug: subSlug,
          name: subName,
          prefix: subPrefix,
          collectionSlug: slug,
          ...(subDescription ? { description: subDescription } : {}),
          order: subOrder,
          coverImage: subCoverImage,
          images: subImages
        });
      }
    }

    // Sort subcollections
    subcollections.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return naturalCompare(a.name, b.name);
    });

    // Reset order value if Infinity so it's clean in JSON
    subcollections.forEach((sc, idx) => {
      if (sc.order === Infinity) {
        sc.order = (idx + 1) * 10;
      }
    });

    if (!coverImage && subcollections.length > 0 && subcollections[0].coverImage) {
      coverImage = subcollections[0].coverImage;
    }

    totalImages += collectionImages.length;

    rawCollections.push({
      slug,
      name,
      prefix,
      ...(description ? { description } : {}),
      order,
      coverImage: coverImage || null,
      images: collectionImages,
      subcollections
    });
  }

  // Sort collections
  rawCollections.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return naturalCompare(a.name, b.name);
  });

  rawCollections.forEach((c, idx) => {
    if (c.order === Infinity) {
      c.order = (idx + 1) * 10;
    }
  });

  const generatedData = {
    collections: rawCollections,
    generatedAt: new Date().toISOString(),
    totalCollections: rawCollections.length,
    totalSubcollections,
    totalImages
  };

  const outputDir = path.dirname(OUTPUT_TS_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write TS file
  const tsContent = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Generated by scripts/generate-collections.mjs at ${generatedData.generatedAt}

import { GeneratedCollections } from './collections.types';

export const collectionsData: GeneratedCollections = ${JSON.stringify(generatedData, null, 2)};
`;

  fs.writeFileSync(OUTPUT_TS_FILE, tsContent, 'utf8');
  console.log(`Generated TS collection data at: ${OUTPUT_TS_FILE}`);

  // Write JSON file for debug
  fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(generatedData, null, 2), 'utf8');
  console.log(`Generated JSON collection data at: ${OUTPUT_JSON_FILE}`);
}

generateCollectionsData();
