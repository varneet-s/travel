/**
 * Zero-dependency HTML and CSS extraction utilities for opaque-box inspection.
 */

export function getMetaTags(html) {
  const metaRegex = /<meta\s+([^>]+)>/gi;
  const metas = [];
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrsStr = match[1];
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9_\-:]+)\s*=\s*["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    metas.push(attrs);
  }
  return metas;
}

export function getLinks(html) {
  const linkRegex = /<link\s+([^>]+)>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrsStr = match[1];
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9_\-:]+)\s*=\s*["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    links.push(attrs);
  }
  return links;
}

export function getAnchorTags(html) {
  const aRegex = /<a\s+([^>]+)>([\s\S]*?)<\/a>/gi;
  const anchors = [];
  let match;
  while ((match = aRegex.exec(html)) !== null) {
    const attrsStr = match[1];
    const innerHtml = match[2];
    const attrs = {
      href: '',
      target: '',
      rel: '',
      class: '',
      text: innerHtml.replace(/<[^>]+>/g, '').trim(),
      raw: match[0],
    };
    const attrRegex = /([a-zA-Z0-9_\-:]+)\s*=\s*["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    anchors.push(attrs);
  }
  return anchors;
}

export function extractCssVariables(css) {
  const vars = new Map();
  const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(css)) !== null) {
    vars.set(match[1].trim(), match[2].trim());
  }
  return vars;
}

export function extractJsonLd(html) {
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const results = [];
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      results.push(parsed);
    } catch (e) {
      results.push({ parseError: e.message, raw: match[1] });
    }
  }
  return results;
}

export function findMatches(text, regex) {
  const matches = [];
  let match;
  const r = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((match = r.exec(text)) !== null) {
    matches.push(match);
  }
  return matches;
}
