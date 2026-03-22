import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const errors = [];

const findFiles = (dir, ext) => {
  const files = [];
  const items = readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      if (!item.name.startsWith('.')) {
        files.push(...findFiles(fullPath, ext));
      }
    } else if (item.name.endsWith(ext)) {
      files.push(fullPath);
    }
  });

  return files;
};

const validateAstroFiles = () => {
  const astroFiles = findFiles(resolve('src'), '.astro');

  astroFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inFrontmatter = false;
    let hasStyle = false;

    lines.forEach(line => {
      if (line.startsWith('---')) {
        inFrontmatter = !inFrontmatter;
      }

      if (!inFrontmatter && line.includes('<style')) {
        hasStyle = true;
      }

      if (line.includes('style=')) {
        errors.push(`${file}: Inline styles found in Astro file`);
      }
    });

    if (hasStyle) {
      errors.push(`${file}: CSS block found in Astro file`);
    }
  });
};

const validateVueFiles = () => {
  const vueFiles = findFiles(resolve('src'), '.vue');

  vueFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8');

    if (content.includes('style=')) {
      errors.push(`${file}: Inline styles found in Vue file`);
    }
  });
};

const validateCssFiles = () => {
  const cssFiles = findFiles(resolve('src'), '.css');

  cssFiles.forEach(file => {
    if (file.includes('theme.css')) {
      return;
    }

    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (/:\s*#[0-9a-fA-F]{3,8}|:\s*rgb\(|:\s*hsl\(/.test(line)) {
        errors.push(`${file}:${index + 1}: Hardcoded colors found outside theme.css`);
      }

      if (/font-family\s*:\s*(?!var\()/.test(line) && line.includes('font-family')) {
        if (!/var\(--font-family/.test(line)) {
          errors.push(`${file}:${index + 1}: font-family found outside theme.css`);
        }
      }
    });
  });
};

const validateNoComments = () => {
  const allFiles = [
    ...findFiles(resolve('src'), '.astro'),
    ...findFiles(resolve('src'), '.vue'),
    ...findFiles(resolve('src'), '.ts'),
    ...findFiles(resolve('src'), '.tsx'),
  ];

  allFiles.forEach(file => {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
        errors.push(`${file}:${index + 1}: Comments found in file`);
      }
    });
  });
};

validateAstroFiles();
validateVueFiles();
validateCssFiles();
validateNoComments();

if (errors.length > 0) {
  console.error('Validation errors found:');
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
} else {
  console.log('All custom validations passed');
  process.exit(0);
}
