/**
 * SEO Calculator & Audit Engine
 * Evaluates on-page SEO metrics and calculates a real-time SEO Level & Score (0-100)
 */

export function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(text) {
  if (!text) return 0;
  const clean = text.trim();
  if (!clean) return 0;
  return clean.split(/\s+/).filter(Boolean).length;
}

export function calculateSeoScore(data = {}) {
  const title = (data.title || '').trim();
  const metaTitle = (data.metaTitle || title).trim();
  const metaDescription = (data.metaDescription || data.excerpt || '').trim();
  const focusKeyword = (data.focusKeyword || '').trim().toLowerCase();
  const slug = (data.slug || '').trim().toLowerCase();
  const rawContent = data.content || '';
  const plainContent = stripHtml(rawContent);
  const wordCount = countWords(plainContent);
  const excerpt = (data.excerpt || '').trim();
  const imageAlt = (data.imageAlt || '').trim().toLowerCase();
  const hasImage = Boolean(
    data.coverImage ||
    data.featuredImageUrl ||
    (data.coverImage && typeof data.coverImage === 'object' && data.coverImage.url)
  );

  let totalScore = 0;
  const checks = [];

  // Helper for keyword word tokens
  const keywordTokens = focusKeyword
    ? focusKeyword.split(/\s+/).filter((w) => w.length > 2)
    : [];

  // 1. Focus Keyword Defined (10 pts)
  if (focusKeyword.length >= 3) {
    totalScore += 10;
    checks.push({
      id: 'keyword_defined',
      title: 'Focus Keyword Defined',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `Focus keyword "${data.focusKeyword}" is set.`,
    });
  } else {
    checks.push({
      id: 'keyword_defined',
      title: 'Focus Keyword Defined',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: 'Add a primary focus keyword to target specific search intent.',
    });
  }

  // 2. Focus Keyword in SEO Title (15 pts)
  const titleLower = metaTitle.toLowerCase();
  if (focusKeyword && titleLower.includes(focusKeyword)) {
    totalScore += 15;
    checks.push({
      id: 'keyword_in_title',
      title: 'Focus Keyword in Title',
      status: 'pass',
      score: 15,
      maxScore: 15,
      message: 'Focus keyword appears prominently in the SEO Title.',
    });
  } else if (
    focusKeyword &&
    keywordTokens.length > 1 &&
    keywordTokens.every((token) => titleLower.includes(token))
  ) {
    totalScore += 10;
    checks.push({
      id: 'keyword_in_title',
      title: 'Focus Keyword in Title',
      status: 'warn',
      score: 10,
      maxScore: 15,
      message: 'Keywords appear in title, but not as an exact phrase.',
    });
  } else {
    checks.push({
      id: 'keyword_in_title',
      title: 'Focus Keyword in Title',
      status: 'fail',
      score: 0,
      maxScore: 15,
      message: 'Include your exact focus keyword in the blog / meta title.',
    });
  }

  // 3. Focus Keyword in Meta Description (10 pts)
  const descLower = metaDescription.toLowerCase();
  if (focusKeyword && descLower.includes(focusKeyword)) {
    totalScore += 10;
    checks.push({
      id: 'keyword_in_desc',
      title: 'Keyword in Meta Description',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: 'Focus keyword is included in the meta description.',
    });
  } else if (
    focusKeyword &&
    keywordTokens.length > 1 &&
    keywordTokens.every((token) => descLower.includes(token))
  ) {
    totalScore += 6;
    checks.push({
      id: 'keyword_in_desc',
      title: 'Keyword in Meta Description',
      status: 'warn',
      score: 6,
      maxScore: 10,
      message: 'Keyword words appear in meta description, but not as an exact phrase.',
    });
  } else {
    checks.push({
      id: 'keyword_in_desc',
      title: 'Keyword in Meta Description',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: 'Add the focus keyword inside your meta description for higher CTR.',
    });
  }

  // 4. Focus Keyword in URL Slug (10 pts)
  const cleanKeywordSlug = focusKeyword.replace(/[^a-z0-9]/g, '');
  const cleanSlug = slug.replace(/[^a-z0-9]/g, '');
  if (
    focusKeyword &&
    slug &&
    (cleanSlug.includes(cleanKeywordSlug) ||
      (keywordTokens.length > 0 &&
        keywordTokens.every((t) => slug.includes(t.replace(/[^a-z0-9]/g, '')))))
  ) {
    totalScore += 10;
    checks.push({
      id: 'keyword_in_slug',
      title: 'Keyword in URL Slug',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: 'URL slug includes the focus keyword.',
    });
  } else {
    checks.push({
      id: 'keyword_in_slug',
      title: 'Keyword in URL Slug',
      status: slug ? 'warn' : 'fail',
      score: slug ? 4 : 0,
      maxScore: 10,
      message: 'Include focus keyword terms in your clean URL slug.',
    });
    if (slug) totalScore += 4;
  }

  // 5. Keyword in Content Introduction (first 150 words / 10%) (10 pts)
  const introWords = plainContent.slice(0, 800).toLowerCase();
  if (focusKeyword && introWords.includes(focusKeyword)) {
    totalScore += 10;
    checks.push({
      id: 'keyword_in_intro',
      title: 'Keyword in Introduction',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: 'Focus keyword appears in the first paragraph/intro of content.',
    });
  } else if (
    focusKeyword &&
    keywordTokens.length > 1 &&
    keywordTokens.every((t) => introWords.includes(t))
  ) {
    totalScore += 6;
    checks.push({
      id: 'keyword_in_intro',
      title: 'Keyword in Introduction',
      status: 'warn',
      score: 6,
      maxScore: 10,
      message: 'Keyword terms appear in the introduction.',
    });
  } else {
    checks.push({
      id: 'keyword_in_intro',
      title: 'Keyword in Introduction',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: 'Mention your focus keyword early in the first 1-2 sentences.',
    });
  }

  // 6. Keyword Frequency & Density (10 pts)
  let occurrences = 0;
  if (focusKeyword) {
    try {
      const escaped = focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = plainContent.toLowerCase().match(new RegExp(escaped, 'gi'));
      occurrences = matches ? matches.length : 0;
    } catch {
      occurrences = 0;
    }
  }

  const keywordWordCount = keywordTokens.length || 1;
  const density =
    wordCount > 0 ? ((occurrences * keywordWordCount) / wordCount) * 100 : 0;
  const formattedDensity = density.toFixed(2);

  if (occurrences >= 3 && density <= 3.5) {
    totalScore += 10;
    checks.push({
      id: 'keyword_density',
      title: 'Keyword Density & Frequency',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `Keyword appears ${occurrences} times (Density: ${formattedDensity}% - Optimal range 0.5%-2.5%).`,
    });
  } else if (occurrences >= 1) {
    totalScore += 6;
    checks.push({
      id: 'keyword_density',
      title: 'Keyword Density & Frequency',
      status: 'warn',
      score: 6,
      maxScore: 10,
      message: `Keyword appears ${occurrences} time(s). Aim for 3+ occurrences for competitive queries.`,
    });
  } else {
    checks.push({
      id: 'keyword_density',
      title: 'Keyword Density & Frequency',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: 'Focus keyword not found in content body.',
    });
  }

  // 7. Title Length Optimization (10 pts)
  const titleLen = metaTitle.length;
  if (titleLen >= 40 && titleLen <= 70) {
    totalScore += 10;
    checks.push({
      id: 'title_length',
      title: 'SEO Title Length',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `Title length is ${titleLen} characters (Ideal: 40-70 characters).`,
    });
  } else if (titleLen >= 25 && titleLen <= 85) {
    totalScore += 5;
    checks.push({
      id: 'title_length',
      title: 'SEO Title Length',
      status: 'warn',
      score: 5,
      maxScore: 10,
      message: `Title length is ${titleLen} characters. Optimal range is 40-70 characters.`,
    });
  } else {
    checks.push({
      id: 'title_length',
      title: 'SEO Title Length',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: titleLen === 0 ? 'Title is missing.' : `Title is ${titleLen < 25 ? 'too short' : 'too long'} (${titleLen} chars).`,
    });
  }

  // 8. Meta Description Length (10 pts)
  const descLen = metaDescription.length;
  if (descLen >= 120 && descLen <= 165) {
    totalScore += 10;
    checks.push({
      id: 'desc_length',
      title: 'Meta Description Length',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `Meta description is ${descLen} characters (Ideal: 120-165 characters).`,
    });
  } else if (descLen >= 80 && descLen <= 220) {
    totalScore += 6;
    checks.push({
      id: 'desc_length',
      title: 'Meta Description Length',
      status: 'warn',
      score: 6,
      maxScore: 10,
      message: `Meta description is ${descLen} characters. Aim for 120-165 characters to prevent snippet truncation.`,
    });
  } else {
    checks.push({
      id: 'desc_length',
      title: 'Meta Description Length',
      status: 'fail',
      score: descLen > 0 ? 2 : 0,
      maxScore: 10,
      message: descLen === 0 ? 'Meta description is missing.' : `Description length (${descLen} chars) is outside optimal range.`,
    });
    if (descLen > 0) totalScore += 2;
  }

  // 9. Content Word Count (10 pts)
  if (wordCount >= 1000) {
    totalScore += 10;
    checks.push({
      id: 'word_count',
      title: 'Content Depth & Word Count',
      status: 'pass',
      score: 10,
      maxScore: 10,
      message: `Comprehensive in-depth content: ${wordCount} words (Recommended: 1000+ words).`,
    });
  } else if (wordCount >= 600) {
    totalScore += 8;
    checks.push({
      id: 'word_count',
      title: 'Content Depth & Word Count',
      status: 'pass',
      score: 8,
      maxScore: 10,
      message: `Good content volume: ${wordCount} words (Standard: 600-1000 words).`,
    });
  } else if (wordCount >= 300) {
    totalScore += 4;
    checks.push({
      id: 'word_count',
      title: 'Content Depth & Word Count',
      status: 'warn',
      score: 4,
      maxScore: 10,
      message: `Moderate word count: ${wordCount} words. Consider expanding to 600+ words for better rankings.`,
    });
  } else {
    checks.push({
      id: 'word_count',
      title: 'Content Depth & Word Count',
      status: 'fail',
      score: 0,
      maxScore: 10,
      message: `Thin content warning: only ${wordCount} words found. Aim for at least 300-600 words.`,
    });
  }

  // 10. Headings Structure (H2 / H3) (5 pts)
  const hasH2 = /<h2[^>]*>/i.test(rawContent);
  const hasH3 = /<h3[^>]*>/i.test(rawContent);
  if (hasH2 && hasH3) {
    totalScore += 5;
    checks.push({
      id: 'headings_structure',
      title: 'Heading Hierarchy (H2 & H3)',
      status: 'pass',
      score: 5,
      maxScore: 5,
      message: 'Well-structured content containing both H2 and H3 subheadings.',
    });
  } else if (hasH2 || hasH3) {
    totalScore += 3;
    checks.push({
      id: 'headings_structure',
      title: 'Heading Hierarchy (H2 & H3)',
      status: 'warn',
      score: 3,
      maxScore: 5,
      message: 'Add both H2 main sections and H3 sub-sections for better readability.',
    });
  } else {
    checks.push({
      id: 'headings_structure',
      title: 'Heading Hierarchy (H2 & H3)',
      status: 'fail',
      score: 0,
      maxScore: 5,
      message: 'No H2 or H3 subheadings detected. Organize content with clear headings.',
    });
  }

  // 11. Featured Image & Alt Text (5 pts)
  const hasAlt = Boolean(imageAlt && imageAlt.length >= 3);
  const altHasKeyword = focusKeyword && hasAlt && imageAlt.includes(focusKeyword);

  if (hasImage && altHasKeyword) {
    totalScore += 5;
    checks.push({
      id: 'featured_image',
      title: 'Featured Image & Alt Text',
      status: 'pass',
      score: 5,
      maxScore: 5,
      message: 'Featured image is set and includes focus keyword in ALT attribute.',
    });
  } else if (hasImage && hasAlt) {
    totalScore += 4;
    checks.push({
      id: 'featured_image',
      title: 'Featured Image & Alt Text',
      status: 'pass',
      score: 4,
      maxScore: 5,
      message: 'Featured image and Alt text are configured.',
    });
  } else if (hasImage) {
    totalScore += 2;
    checks.push({
      id: 'featured_image',
      title: 'Featured Image & Alt Text',
      status: 'warn',
      score: 2,
      maxScore: 5,
      message: 'Featured image added, but SEO Alt text is missing.',
    });
  } else if (hasAlt) {
    totalScore += 2;
    checks.push({
      id: 'featured_image',
      title: 'Featured Image & Alt Text',
      status: 'warn',
      score: 2,
      maxScore: 5,
      message: 'Alt text specified, but no featured image attached.',
    });
  } else {
    checks.push({
      id: 'featured_image',
      title: 'Featured Image & Alt Text',
      status: 'fail',
      score: 0,
      maxScore: 5,
      message: 'Add a cover image and descriptive Alt text to appear in Google Images.',
    });
  }

  // Clamp totalScore
  const finalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

  // Determine Level Classification
  let level = 'Poor';
  let grade = 'D';
  let badgeColor = '#ef4444';
  let badgeBg = '#fee2e2';
  let badgeBorder = '#fca5a5';
  let icon = '🔴';
  let summary = 'Needs significant optimization before publishing.';

  if (finalScore >= 80) {
    level = 'Excellent';
    grade = 'A+';
    badgeColor = '#15803d';
    badgeBg = '#dcfce7';
    badgeBorder = '#86efac';
    icon = '🟢';
    summary = 'Top-tier SEO level! Ready to rank strongly on Google SERPs.';
  } else if (finalScore >= 65) {
    level = 'Good';
    grade = 'A';
    badgeColor = '#0369a1';
    badgeBg = '#e0f2fe';
    badgeBorder = '#7dd3fc';
    icon = '🔵';
    summary = 'Solid SEO foundation. A few minor tweaks will push it to Excellent.';
  } else if (finalScore >= 45) {
    level = 'Moderate';
    grade = 'B';
    badgeColor = '#b45309';
    badgeBg = '#fef3c7';
    badgeBorder = '#fcd34d';
    icon = '🟡';
    summary = 'Moderate SEO level. Address keyword placements & length recommendations.';
  }

  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const warnedCount = checks.filter((c) => c.status === 'warn').length;
  const failedCount = checks.filter((c) => c.status === 'fail').length;

  return {
    score: finalScore,
    level,
    grade,
    badgeColor,
    badgeBg,
    badgeBorder,
    icon,
    summary,
    wordCount,
    readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    occurrences,
    density: formattedDensity,
    passedCount,
    warnedCount,
    failedCount,
    totalChecks: checks.length,
    checks,
  };
}
