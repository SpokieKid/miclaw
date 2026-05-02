#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import re
import shutil
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path


SOURCE_NOTE = Path("/Users/affe/obsidian-affe/3. Input, Output & Views/0410_course/01.md")
DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parent / "01"
DEFAULT_BRAND = "OPC AI / 一核学院"
YIHE_TEXT = "一核学院"
YIHE_LOGO_SOURCE = Path(__file__).resolve().parent.parent / "bp" / "yihe.png"
YIHE_LOGO_KEY = "__yihe_logo__"


@dataclass
class Slide:
    title: str
    style: str
    bullets: list[str] = field(default_factory=list)
    paragraphs: list[str] = field(default_factory=list)
    images: list[str] = field(default_factory=list)
    speaker: str | None = None
    subtitle: str | None = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Render an Obsidian markdown note into a warm editorial HTML slide deck."
    )
    parser.add_argument("source", nargs="?", type=Path, default=SOURCE_NOTE)
    parser.add_argument("output", nargs="?", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--brand", default=DEFAULT_BRAND)
    return parser.parse_args()


def strip_markdown(text: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"\1", text).strip()


def inline_markdown(text: str) -> str:
    parts = re.split(r"(\*\*.+?\*\*)", text)
    rendered: list[str] = []
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            rendered.append(f"<strong>{html.escape(part[2:-2])}</strong>")
        else:
            rendered.append(html.escape(part))
    return "".join(rendered)


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_text).strip("-").lower()
    return slug or "asset"


def normalize_style(style: str) -> str:
    normalized = re.sub(r"\s+", " ", style).strip()
    alias_map = {
        "中心金句(两行)": "中心金句",
        "左上标题 + 左边内容 + 右边图片": "左上标题 + 左侧内容 + 右侧图片",
        "左上标题 + 左边内容 + 右侧图片": "左上标题 + 左侧内容 + 右侧图片",
        "左上标题 + 左侧内容 + 右边图片": "左上标题 + 左侧内容 + 右侧图片",
        "左上标题 + 图文": "左上标题 + 左侧内容 + 右侧图片",
        "左上标题 + 正文中心金句": "左上标题 + 中心金句",
        "左上标题 + 正文中心内容": "左上标题 + 中心金句",
        "左上标题 + 正文金句": "左上标题 + 中心金句",
        "左上标题 + 中心内容": "左上标题 + 中心金句",
        "左上标题 + 中心正文": "左上标题 + 中心金句",
        "正文中心内容": "中心金句",
    }
    return alias_map.get(normalized, normalized)


def parse_note(source: Path) -> list[Slide]:
    text = source.read_text(encoding="utf-8")
    chunks = re.split(r"(?m)^#\s+", text)
    slides: list[Slide] = []

    for chunk in chunks[1:]:
        lines = [line.rstrip() for line in chunk.splitlines()]
        title = lines[0].strip()
        slide = Slide(title=title, style="中心金句")

        for raw_line in lines[1:]:
            line = raw_line.strip()
            if not line:
                continue
            if line.startswith("样式:"):
                slide.style = normalize_style(line.split(":", 1)[1])
            elif line.startswith("主讲人:"):
                slide.speaker = line.split(":", 1)[1].strip()
            elif line.startswith("下标:"):
                slide.subtitle = line.split(":", 1)[1].strip()
            elif line.startswith("- "):
                slide.bullets.append(line[2:].strip())
            else:
                image_matches = re.findall(r"!\[\[(.+?)\]\]", line)
                if image_matches:
                    slide.images.extend(match.split("|", 1)[0].strip() for match in image_matches)
                    text_only = re.sub(r"!\[\[(.+?)\]\]", "", line).strip()
                    if text_only:
                        slide.paragraphs.append(text_only)
                else:
                    slide.paragraphs.append(line)

        slides.append(slide)

    return slides


def resolve_image(source_note: Path, image_name: str) -> Path:
    direct = source_note.parent / "attachments" / image_name
    if direct.exists():
        return direct

    matches = sorted(source_note.parent.rglob(image_name))
    if matches:
        return matches[0]

    raise FileNotFoundError(f"Unable to resolve image: {image_name}")


def copy_assets(source_note: Path, slides: list[Slide], output_dir: Path) -> dict[str, str]:
    assets_dir = output_dir / "assets"
    if assets_dir.exists():
        shutil.rmtree(assets_dir)
    assets_dir.mkdir(parents=True, exist_ok=True)
    mapping: dict[str, str] = {}
    used_names: set[str] = set()

    for slide in slides:
        for image_name in slide.images:
            if image_name in mapping:
                continue

            source_path = resolve_image(source_note, image_name)
            stem = slugify(source_path.stem)
            suffix = source_path.suffix.lower()
            candidate = f"{stem}{suffix}"
            dedupe = 2
            while candidate in used_names:
                candidate = f"{stem}-{dedupe}{suffix}"
                dedupe += 1

            destination = assets_dir / candidate
            shutil.copy2(source_path, destination)
            mapping[image_name] = f"assets/{candidate}"
            used_names.add(candidate)

    if YIHE_LOGO_SOURCE.exists():
        logo_name = "yihe.png"
        destination = assets_dir / logo_name
        shutil.copy2(YIHE_LOGO_SOURCE, destination)
        mapping[YIHE_LOGO_KEY] = f"assets/{logo_name}"

    return mapping


def render_brand_markup(brand: str, asset_map: dict[str, str]) -> str:
    logo_asset = asset_map.get(YIHE_LOGO_KEY)
    if not logo_asset or YIHE_TEXT not in brand:
        return html.escape(brand)

    parts = brand.split(YIHE_TEXT)
    chunks: list[str] = []
    for idx, part in enumerate(parts):
        if part:
            chunks.append(f'<span class="brand-text">{html.escape(part)}</span>')
        if idx < len(parts) - 1:
            chunks.append(
                f'<img class="brand-logo" src="{html.escape(logo_asset)}" alt="{html.escape(YIHE_TEXT)}">'
            )
    return "".join(chunks)


def render_text_with_logo(
    value: str,
    asset_map: dict[str, str],
    text_class: str = "inline-brand-text",
    logo_class: str = "inline-brand-logo",
) -> str:
    logo_asset = asset_map.get(YIHE_LOGO_KEY)
    if not logo_asset or YIHE_TEXT not in value:
        return inline_markdown(value)

    parts = value.split(YIHE_TEXT)
    chunks: list[str] = []
    for idx, part in enumerate(parts):
        if part:
            chunks.append(f'<span class="{text_class}">{inline_markdown(part)}</span>')
        if idx < len(parts) - 1:
            chunks.append(
                f'<img class="{logo_class}" src="{html.escape(logo_asset)}" alt="{html.escape(YIHE_TEXT)}">'
            )
    return "".join(chunks)


def render_meta_item(value: str, asset_map: dict[str, str]) -> str:
    if value == YIHE_TEXT and asset_map.get(YIHE_LOGO_KEY):
        return (
            '<div class="meta-chip meta-logo-chip reveal">'
            f'<img class="meta-logo" src="{html.escape(asset_map[YIHE_LOGO_KEY])}" alt="{html.escape(YIHE_TEXT)}">'
            "</div>"
        )
    if YIHE_TEXT in value and asset_map.get(YIHE_LOGO_KEY):
        return (
            '<div class="meta-chip meta-chip-inline-brand reveal">'
            '<span class="inline-brand inline-brand-meta">'
            f'{render_text_with_logo(value, asset_map, "inline-brand-text", "inline-brand-logo inline-brand-logo-meta")}'
            "</span></div>"
        )
    return f'<div class="meta-chip reveal"><span>{inline_markdown(value)}</span></div>'


def frame_meta(index: int, total: int, brand: str, asset_map: dict[str, str]) -> str:
    return f"""
  <div class="slide-line"></div>
  <div class="brand">{render_brand_markup(brand, asset_map)}</div>
  <div class="slide-number">{index:02d} / {total:02d}</div>
"""


def render_images(image_names: list[str], asset_map: dict[str, str], large: bool = True) -> str:
    if not image_names:
        return ""

    if len(image_names) == 1:
        asset = html.escape(asset_map[image_names[0]])
        alt = html.escape(strip_markdown(image_names[0]))
        klass = "image-shell image-shell-large" if large else "image-shell"
        return f"""
    <div class="{klass} reveal-scale">
      <img src="{asset}" alt="{alt}" loading="lazy">
    </div>
"""

    figures: list[str] = []
    for image_name in image_names:
        asset = html.escape(asset_map[image_name])
        alt = html.escape(strip_markdown(image_name))
        figures.append(
            f"""
      <figure class="image-tile reveal-scale">
        <img src="{asset}" alt="{alt}" loading="lazy">
      </figure>
"""
        )

    return f"""
    <div class="image-grid image-grid-{len(image_names)}">
{''.join(figures)}    </div>
"""


def render_title_slide(slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]) -> str:
    plain_title = strip_markdown(slide.title)
    meta_items: list[str] = []
    subtitle_in_lead = bool(slide.subtitle and not slide.speaker and slide.subtitle != YIHE_TEXT)
    if slide.speaker:
        meta_items.append(render_meta_item(slide.speaker, asset_map))
    if slide.subtitle and not subtitle_in_lead:
        meta_items.append(render_meta_item(slide.subtitle, asset_map))
    meta_html = "".join(meta_items)

    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide cover-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <div class="cover-grid">
      <div class="ornament reveal">
        <span class="ornament-line"></span>
        <span class="ornament-dot"></span>
        <span class="ornament-line"></span>
      </div>
      <h1 class="display-title reveal">{inline_markdown(slide.title)}</h1>
      {f'<p class="lead-copy reveal"><span class="inline-brand inline-brand-lead">{render_text_with_logo(slide.subtitle, asset_map, "inline-brand-text", "inline-brand-logo inline-brand-logo-lead")}</span></p>' if subtitle_in_lead else ''}
      {f'<div class="meta-row">{meta_html}</div>' if meta_html else ''}
    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_quote_slide(slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]) -> str:
    plain_title = strip_markdown(slide.title)
    subtitle = slide.subtitle or ("<br>".join(inline_markdown(item) for item in slide.bullets) if slide.bullets else "")
    media = render_images(slide.images, asset_map, large=False) if slide.images else ""
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide quote-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <div class="quote-shell{' quote-shell-media' if media else ''}">
      <h2 class="quote-title reveal">{inline_markdown(slide.title)}</h2>
      {f'<p class="quote-subtitle reveal">{subtitle}</p>' if subtitle else ''}
      {f'<div class="quote-media">{media}</div>' if media else ''}
    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_bullets_slide(slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]) -> str:
    plain_title = strip_markdown(slide.title)
    list_class = "bullet-list bullet-list-columns" if len(slide.bullets) > 6 else "bullet-list"
    list_markup = ""
    bullet_items = "".join(
        f'          <li class="reveal">{inline_markdown(item)}</li>\n' for item in slide.bullets
    )
    paragraphs = "".join(
        f'          <p class="content-paragraph reveal">{inline_markdown(item)}</p>\n'
        for item in slide.paragraphs
    )
    if bullet_items:
        list_markup = f'        <ul class="{list_class}">{bullet_items}        </ul>\n'
    body_markup = ""
    if bullet_items or paragraphs:
        body_markup = (
            f'      <div class="bullet-card">\n'
            f"{list_markup}"
            f"{paragraphs}"
            f"      </div>\n"
        )
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide content-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <header class="top-header">
      <h2 class="page-title reveal">{inline_markdown(slide.title)}</h2>
    </header>
    <div class="content-panel">
{body_markup}    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_image_content_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    media = render_images(slide.images, asset_map, large=True)
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide content-slide media-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <header class="top-header">
      <h2 class="page-title reveal">{inline_markdown(slide.title)}</h2>
    </header>
    <div class="content-panel media-panel">
{media}    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_side_content_image_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    bullet_items = "".join(
        f'            <li class="reveal">{inline_markdown(item)}</li>\n' for item in slide.bullets
    )
    paragraphs = "".join(
        f'            <p class="content-paragraph reveal">{inline_markdown(item)}</p>\n'
        for item in slide.paragraphs
    )
    media = render_images(slide.images, asset_map, large=False)
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide content-slide media-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <header class="top-header">
      <h2 class="page-title reveal">{inline_markdown(slide.title)}</h2>
    </header>
    <div class="content-split-layout">
      <div class="content-split-copy">
        <div class="bullet-card bullet-card-side">
          {f'<ul class="bullet-list">{bullet_items}          </ul>' if bullet_items else ''}
          {paragraphs}
        </div>
      </div>
      <div class="content-split-media">
{media}      </div>
    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_split_slide(slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]) -> str:
    plain_title = strip_markdown(slide.title)
    media = render_images(slide.images, asset_map, large=False)
    paragraphs = "".join(
        f'        <p class="split-note reveal">{inline_markdown(item)}</p>\n' for item in slide.paragraphs
    )
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide split-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <div class="split-layout">
      <div class="split-copy">
        <h2 class="split-title reveal">{inline_markdown(slide.title)}</h2>
        {f'<div class="divider reveal"></div>' if paragraphs else ''}
{paragraphs}      </div>
      <div class="split-media">
{media}      </div>
    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_image_only_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    media = render_images(slide.images, asset_map, large=True)
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide image-only-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <div class="image-only-panel">
{media}    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_multiline_quote_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    lines = "".join(
        f'      <div class="quote-line reveal">{inline_markdown(item)}</div>\n' for item in slide.bullets
    )
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide quote-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <div class="quote-shell quote-shell-lines">
{lines}    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_quote_explained_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    explanation = "<br>".join(inline_markdown(item) for item in slide.bullets)
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide quote-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <div class="quote-shell quote-shell-explained">
      <h2 class="quote-title quote-title-compact reveal">{inline_markdown(slide.title)}</h2>
      {f'<p class="quote-subtitle quote-subtitle-compact reveal">{explanation}</p>' if explanation else ''}
    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_top_title_center_quote_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    statements = slide.bullets or slide.paragraphs
    if len(statements) > 1:
        content = "".join(
            f'          <div class="quote-line reveal">{inline_markdown(item)}</div>\n' for item in statements
        )
        body = (
            '      <div class="quote-shell quote-shell-lines quote-shell-top-title">\n'
            f"{content}"
            "      </div>\n"
        )
    else:
        statement = inline_markdown(statements[0]) if statements else ""
        body = (
            '      <div class="quote-shell quote-shell-explained quote-shell-top-title">\n'
            f'        <h3 class="quote-title quote-title-compact reveal">{statement}</h3>\n'
            "      </div>\n"
        )

    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide content-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <header class="top-header">
      <h2 class="page-title reveal">{inline_markdown(slide.title)}</h2>
    </header>
    <div class="content-panel">
{body}    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_business_model_canvas_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    bullet_items = "".join(
        f'            <li class="reveal">{inline_markdown(item)}</li>\n' for item in slide.bullets
    )
    paragraphs = "".join(
        f'            <p class="content-paragraph reveal">{inline_markdown(item)}</p>\n'
        for item in slide.paragraphs
    )
    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide content-slide business-canvas-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <header class="top-header">
      <h2 class="page-title reveal">{inline_markdown(slide.title)}</h2>
    </header>
    <div class="business-canvas-layout">
      <div class="business-canvas-copy">
        <div class="bullet-card bullet-card-side">
          {f'<ul class="bullet-list">{bullet_items}          </ul>' if bullet_items else ''}
          {paragraphs}
        </div>
      </div>
      <div class="business-canvas-diagram reveal-scale" aria-label="商业逻辑画布九宫格">
        <div class="bmc-cell bmc-partners"><span class="bmc-label">关键伙伴</span></div>
        <div class="bmc-cell bmc-activities"><span class="bmc-label">关键活动</span></div>
        <div class="bmc-cell bmc-resources"><span class="bmc-label">核心资源</span></div>
        <div class="bmc-cell bmc-value"><span class="bmc-label">价值主张</span></div>
        <div class="bmc-cell bmc-relationships"><span class="bmc-label">客户关系</span></div>
        <div class="bmc-cell bmc-channels"><span class="bmc-label">渠道通路</span></div>
        <div class="bmc-cell bmc-segments"><span class="bmc-label">客户细分</span></div>
        <div class="bmc-cell bmc-cost"><span class="bmc-label">成本结构</span></div>
        <div class="bmc-cell bmc-revenue"><span class="bmc-label">收入来源</span></div>
      </div>
    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_described_diagram_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    plain_title = strip_markdown(slide.title)
    text_blocks = slide.bullets + slide.paragraphs
    flow_source = text_blocks[0] if text_blocks else ""
    steps = [part.strip() for part in re.split(r"\s*->\s*", flow_source) if part.strip()]
    if len(steps) < 2:
        steps = text_blocks or [slide.title]

    nodes: list[str] = []
    for idx, step in enumerate(steps):
        nodes.append(
            f'        <div class="flow-step reveal-scale"><span>{inline_markdown(step)}</span></div>\n'
        )
        if idx < len(steps) - 1:
            nodes.append('        <div class="flow-arrow reveal" aria-hidden="true">→</div>\n')

    notes = text_blocks[1:] if len(text_blocks) > 1 else []
    notes_markup = ""
    if notes:
        note_items = "".join(
            f'            <li class="reveal">{inline_markdown(item)}</li>\n' for item in notes
        )
        notes_markup = (
            '      <div class="bullet-card diagram-notes">\n'
            f'        <ul class="bullet-list">{note_items}        </ul>\n'
            "      </div>\n"
        )

    return f"""
<!-- ==================== SLIDE {index}: {html.escape(plain_title)} ==================== -->
<section class="slide content-slide diagram-slide" data-slide-index="{index}" id="slide-{index:02d}">
  <div class="slide-content">
    <header class="top-header">
      <h2 class="page-title reveal">{inline_markdown(slide.title)}</h2>
    </header>
    <div class="diagram-layout">
      <div class="diagram-flow">
{''.join(nodes)}      </div>
{notes_markup}    </div>
  </div>
{frame_meta(index, total, brand, asset_map)}</section>
"""


def render_slide(
    slide: Slide, index: int, total: int, brand: str, asset_map: dict[str, str]
) -> str:
    if slide.style == "标题页":
        return render_title_slide(slide, index, total, brand, asset_map)
    if slide.style == "中心金句":
        return render_quote_slide(slide, index, total, brand, asset_map)
    if slide.style == "中心金句 + 副标题":
        return render_quote_slide(slide, index, total, brand, asset_map)
    if slide.style == "中心金句(三行)":
        return render_multiline_quote_slide(slide, index, total, brand, asset_map)
    if slide.style == "中心金句 + 稍小字号解释":
        return render_quote_explained_slide(slide, index, total, brand, asset_map)
    if slide.style == "根据描述画图":
        return render_described_diagram_slide(slide, index, total, brand, asset_map)
    if slide.style == "左上标题 + 商业逻辑画布":
        return render_business_model_canvas_slide(slide, index, total, brand, asset_map)
    if slide.style == "左上标题 + 中心金句":
        return render_top_title_center_quote_slide(slide, index, total, brand, asset_map)
    if slide.style == "左上标题 + 正文内容":
        if slide.images and (slide.bullets or slide.paragraphs):
            return render_side_content_image_slide(slide, index, total, brand, asset_map)
        if slide.images:
            return render_image_content_slide(slide, index, total, brand, asset_map)
        return render_bullets_slide(slide, index, total, brand, asset_map)
    if slide.style == "左上标题 + 正文图片":
        if slide.bullets or slide.paragraphs:
            return render_side_content_image_slide(slide, index, total, brand, asset_map)
        return render_image_content_slide(slide, index, total, brand, asset_map)
    if slide.style == "左上标题 + 左侧内容 + 右侧图片":
        return render_side_content_image_slide(slide, index, total, brand, asset_map)
    if slide.style == "左侧文字说明 + 图片":
        return render_split_slide(slide, index, total, brand, asset_map)
    if slide.style == "纯图片页":
        return render_image_only_slide(slide, index, total, brand, asset_map)
    return render_quote_slide(slide, index, total, brand, asset_map)


def build_html(slides: list[Slide], asset_map: dict[str, str], brand: str) -> str:
    title = strip_markdown(slides[0].title) if slides else "Slides"
    sections = "".join(
        render_slide(slide, index, len(slides), brand, asset_map)
        for index, slide in enumerate(slides, start=1)
    )
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Noto+Serif+SC:wght@400;500;600;700;900&family=Source+Sans+3:wght@400;500;600;700&display=swap');

    /* === VIEWPORT BASE === */
    html, body {{
      height: 100%;
      overflow-x: hidden;
    }}

    html {{
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
    }}

    .slide {{
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      position: relative;
    }}

    .slide-content {{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-height: 100%;
      overflow: hidden;
      padding: var(--slide-padding-x);
      padding-top: var(--slide-padding-y);
      padding-bottom: calc(var(--slide-padding-y) + clamp(2.75rem, 4vh, 3.5rem));
    }}

    :root {{
      --body-scale: 1.3;
      --title-size: clamp(1.8rem, 5vw, 4.8rem);
      --h2-size: clamp(1.35rem, 3.25vw, 2.4rem);
      --body-size: clamp(0.85rem, 1.4vw, 1.12rem);
      --small-size: clamp(0.7rem, 0.95vw, 0.9rem);
      --slide-padding-x: clamp(1.15rem, 4vw, 4rem);
      --slide-padding-y: clamp(1rem, 4vh, 3rem);
      --content-gap: clamp(0.6rem, 1.8vw, 1.8rem);

      --bg-cream: #fffbf0;
      --bg-cream-deep: #fff6de;
      --bg-cream-accent: #fef3c7;
      --bg-white: rgba(255, 255, 255, 0.82);
      --bg-white-solid: #ffffff;
      --amber: #d97706;
      --amber-deep: #b45309;
      --terracotta: #c2410c;
      --sage: #65a30d;
      --sage-deep: #4d7c0f;
      --text-primary: #1c1917;
      --text-secondary: #57534e;
      --text-muted: #78716c;
      --text-light: #a8a29e;
      --border: rgba(231, 229, 228, 0.9);
      --shadow-soft: 0 18px 44px rgba(28, 25, 23, 0.08);
      --shadow-card: 0 10px 30px rgba(28, 25, 23, 0.08);
      --gradient-warm: linear-gradient(180deg, #fffbf0 0%, #fff6de 100%);
      --gradient-cover: radial-gradient(circle at top right, rgba(217, 119, 6, 0.12), transparent 34%),
        radial-gradient(circle at bottom left, rgba(101, 163, 13, 0.08), transparent 30%),
        linear-gradient(180deg, #fffbf0 0%, #fff6de 48%, #fffbf0 100%);
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    }}

    .card, .container, .content-box {{
      max-width: min(90vw, 1000px);
      max-height: min(80vh, 700px);
    }}

    .feature-list, .bullet-list {{
      gap: clamp(0.4rem, 1vh, 1rem);
    }}

    .feature-list li, .bullet-list li {{
      font-size: calc(var(--body-size) * var(--body-scale));
      line-height: 1.4;
    }}

    .grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
      gap: clamp(0.5rem, 1.5vw, 1rem);
    }}

    img, .image-container {{
      max-width: 100%;
      max-height: min(50vh, 400px);
      object-fit: contain;
    }}

    @media (max-height: 700px) {{
      :root {{
        --slide-padding-x: clamp(0.8rem, 3vw, 2rem);
        --slide-padding-y: clamp(0.75rem, 3vh, 1.8rem);
        --title-size: clamp(1.4rem, 4.5vw, 2.8rem);
        --h2-size: clamp(1.1rem, 3vw, 1.8rem);
      }}
    }}

    @media (max-height: 600px) {{
      :root {{
        --slide-padding-x: clamp(0.7rem, 2.5vw, 1.5rem);
        --slide-padding-y: clamp(0.65rem, 2.5vh, 1.2rem);
        --title-size: clamp(1.2rem, 4vw, 2.2rem);
        --body-size: clamp(0.72rem, 1.2vw, 0.95rem);
      }}

      .nav-dots, .keyboard-hint {{
        display: none;
      }}
    }}

    @media (max-height: 500px) {{
      :root {{
        --slide-padding-x: clamp(0.5rem, 2vw, 1rem);
        --slide-padding-y: clamp(0.45rem, 2vh, 0.8rem);
        --title-size: clamp(1.1rem, 3.5vw, 1.7rem);
        --h2-size: clamp(0.95rem, 2.5vw, 1.3rem);
        --body-size: clamp(0.68rem, 1vw, 0.85rem);
      }}
    }}

    @media (max-width: 600px) {{
      :root {{
        --title-size: clamp(1.4rem, 7vw, 2.8rem);
      }}

      .grid {{
        grid-template-columns: 1fr;
      }}
    }}

    @media (prefers-reduced-motion: reduce) {{
      *, *::before, *::after {{
        animation-duration: 0.01ms !important;
        transition-duration: 0.2s !important;
      }}

      html {{
        scroll-behavior: auto;
      }}
    }}

    /* === RESET AND GLOBALS === */
    * {{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Source Sans 3', sans-serif;
      color: var(--text-primary);
      background: var(--gradient-warm);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }}

    strong {{
      color: var(--amber-deep);
      font-weight: 700;
    }}

    .slide::before {{
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 84% 14%, rgba(217, 119, 6, 0.1), transparent 24%),
        radial-gradient(circle at 18% 84%, rgba(101, 163, 13, 0.08), transparent 20%);
      pointer-events: none;
    }}

    .slide::after {{
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(28, 25, 23, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(28, 25, 23, 0.025) 1px, transparent 1px);
      background-size: clamp(22px, 3vw, 36px) clamp(22px, 3vw, 36px);
      mask-image: radial-gradient(circle at center, black 45%, transparent 85%);
      opacity: 0.22;
      pointer-events: none;
    }}

    .slide > * {{
      position: relative;
      z-index: 1;
    }}

    .cover-slide {{
      background: var(--gradient-cover);
    }}

    .content-slide,
    .quote-slide,
    .split-slide,
    .image-only-slide {{
      background: var(--gradient-warm);
    }}

    .eyebrow {{
      font-size: clamp(0.65rem, 0.9vw, 0.82rem);
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: var(--amber);
      font-weight: 700;
    }}

    .top-header {{
      display: flex;
      flex-direction: column;
      gap: clamp(0.35rem, 0.8vh, 0.6rem);
      margin-bottom: clamp(1rem, 2vh, 1.8rem);
      max-width: min(70rem, 100%);
    }}

    .display-title,
    .page-title,
    .quote-title,
    .split-title {{
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      line-height: 1.08;
      letter-spacing: -0.04em;
      color: var(--text-primary);
    }}

    .display-title {{
      font-size: var(--title-size);
      max-width: min(12ch, 92vw);
      text-wrap: balance;
      word-spacing: 0.12em;
    }}

    .display-title strong + strong {{
      margin-left: 0.18em;
    }}

    .page-title,
    .split-title {{
      font-size: var(--h2-size);
      max-width: min(20ch, 100%);
      text-wrap: balance;
    }}

    .lead-copy,
    .quote-subtitle,
    .split-note,
    .content-paragraph {{
      font-size: calc(clamp(0.95rem, 1.55vw, 1.2rem) * var(--body-scale));
      line-height: 1.65;
      color: var(--text-secondary);
    }}

    .cover-grid {{
      max-width: min(68rem, 100%);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: clamp(0.85rem, 2vh, 1.35rem);
    }}

    .inline-brand {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.35rem, 0.8vw, 0.55rem);
      flex-wrap: wrap;
      vertical-align: middle;
    }}

    .inline-brand-text {{
      white-space: pre-wrap;
    }}

    .inline-brand-logo {{
      display: inline-block;
      width: auto;
      object-fit: contain;
      vertical-align: middle;
    }}

    .inline-brand-lead {{
      gap: clamp(0.42rem, 1vw, 0.65rem);
    }}

    .inline-brand-logo-lead {{
      height: clamp(1.35rem, 2.6vh, 1.95rem);
    }}

    .inline-brand-meta {{
      gap: clamp(0.3rem, 0.7vw, 0.45rem);
    }}

    .inline-brand-logo-meta {{
      height: clamp(0.95rem, 1.8vh, 1.2rem);
    }}

    .meta-row {{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: clamp(0.55rem, 1vw, 0.85rem);
      margin-top: clamp(0.25rem, 0.8vh, 0.6rem);
    }}

    .meta-chip {{
      padding: clamp(0.45rem, 0.85vh, 0.62rem) clamp(0.9rem, 1.5vw, 1.2rem);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.75);
      border: 1px solid rgba(217, 119, 6, 0.16);
      box-shadow: var(--shadow-card);
      color: var(--text-secondary);
      font-size: var(--small-size);
      font-weight: 600;
    }}

    .meta-chip-inline-brand {{
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .meta-logo-chip {{
      padding: clamp(0.42rem, 0.7vh, 0.56rem) clamp(0.82rem, 1.3vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .meta-logo {{
      display: block;
      height: clamp(1.1rem, 2vh, 1.4rem);
      width: auto;
      object-fit: contain;
    }}

    .ornament {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.85rem;
      width: min(16rem, 50vw);
      margin-bottom: clamp(0.2rem, 1vh, 0.4rem);
    }}

    .ornament-line {{
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.45), transparent);
    }}

    .ornament-dot {{
      width: 0.38rem;
      height: 0.38rem;
      border-radius: 999px;
      background: var(--amber);
      box-shadow: 0 0 0 0.35rem rgba(217, 119, 6, 0.09);
    }}

    .quote-shell {{
      width: min(70vw, 72rem);
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
      border-radius: 0;
      background: transparent;
      border: none;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: clamp(0.75rem, 1.4vh, 1rem);
    }}

    .quote-title {{
      font-size: clamp(1.7rem, 4.3vw, 3.4rem);
      width: 100%;
      max-width: none;
      text-wrap: balance;
    }}

    .quote-subtitle {{
      max-width: min(42rem, 100%);
      text-wrap: balance;
    }}

    .quote-shell-media {{
      max-width: min(78rem, 100%);
    }}

    .quote-media {{
      width: min(62rem, 100%);
      margin-top: clamp(0.25rem, 1vh, 0.6rem);
    }}

    .quote-shell-lines {{
      gap: clamp(0.9rem, 1.8vh, 1.3rem);
      max-width: min(76rem, 100%);
      padding: 0;
    }}

    .quote-line {{
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(1.35rem, 3.25vw, 2.7rem);
      line-height: 1.26;
      color: var(--text-primary);
      text-wrap: balance;
    }}

    .quote-shell-explained {{
      gap: clamp(0.85rem, 1.5vh, 1.1rem);
    }}

    .quote-title-compact {{
      font-size: clamp(1.45rem, 3.55vw, 2.9rem);
      max-width: min(17ch, 100%);
    }}

    .quote-subtitle-compact {{
      font-size: calc(clamp(0.95rem, 1.5vw, 1.16rem) * var(--body-scale));
      line-height: 1.6;
      max-width: min(46rem, 100%);
    }}

    .content-panel {{
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .bullet-card {{
      width: min(68rem, 100%);
      max-height: 100%;
      overflow: hidden;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(255, 249, 235, 0.72));
      border: 1px solid rgba(217, 119, 6, 0.15);
      border-radius: clamp(1.25rem, 2.4vw, 1.8rem);
      box-shadow: var(--shadow-soft);
      padding: clamp(1.1rem, 2.8vw, 2rem);
    }}

    .bullet-list {{
      list-style: none;
      display: grid;
      gap: clamp(0.75rem, 1.4vh, 1rem);
    }}

    .bullet-list li {{
      position: relative;
      padding-left: clamp(1.3rem, 1.8vw, 1.65rem);
      color: var(--text-secondary);
      line-height: 1.58;
      font-size: calc(clamp(1.12rem, 1.78vw, 1.42rem) * var(--body-scale));
    }}

    .bullet-card .content-paragraph {{
      font-size: calc(clamp(1.08rem, 1.72vw, 1.34rem) * var(--body-scale));
      line-height: 1.68;
    }}

    .bullet-list li::before {{
      content: '';
      position: absolute;
      left: 0;
      top: 0.58em;
      width: 0.46rem;
      height: 0.46rem;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--amber), var(--terracotta));
      box-shadow: 0 0 0 0.33rem rgba(217, 119, 6, 0.08);
    }}

    .media-panel {{
      align-items: stretch;
    }}

    .content-split-layout {{
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(18rem, 28rem) minmax(0, 1fr);
      gap: clamp(1rem, 2.2vw, 2rem);
      align-items: center;
    }}

    .content-split-copy,
    .content-split-media {{
      min-width: 0;
    }}

    .business-canvas-layout {{
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(18rem, 27rem) minmax(0, 1fr);
      gap: clamp(1rem, 2.2vw, 2rem);
      align-items: center;
    }}

    .business-canvas-copy {{
      min-width: 0;
    }}

    .diagram-layout {{
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: clamp(0.9rem, 1.8vh, 1.4rem);
    }}

    .diagram-flow {{
      width: min(74rem, 100%);
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: clamp(0.55rem, 1vw, 0.9rem);
    }}

    .flow-step {{
      min-width: min(11rem, 100%);
      max-width: min(15rem, 100%);
      min-height: clamp(4.8rem, 10vh, 6rem);
      padding: clamp(0.8rem, 1.2vw, 1rem) clamp(0.95rem, 1.5vw, 1.2rem);
      border-radius: clamp(1rem, 1.8vw, 1.35rem);
      border: 1px solid rgba(217, 119, 6, 0.14);
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 248, 240, 0.76));
      box-shadow: var(--shadow-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }}

    .flow-step span {{
      font-family: 'Noto Serif SC', serif;
      font-size: calc(clamp(0.95rem, 1.35vw, 1.18rem) * var(--body-scale));
      line-height: 1.35;
      color: var(--text-primary);
      font-weight: 600;
      text-wrap: balance;
    }}

    .flow-arrow {{
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.45rem, 2.8vw, 2.2rem);
      line-height: 1;
      color: var(--amber-deep);
      opacity: 0.82;
    }}

    .diagram-notes {{
      width: min(58rem, 100%);
      margin: 0 auto;
    }}

    .business-canvas-diagram {{
      width: min(56rem, 100%);
      max-width: 100%;
      max-height: min(56vh, 34rem);
      margin: 0 auto;
      padding: clamp(0.65rem, 1vw, 0.95rem);
      border-radius: clamp(1rem, 2vw, 1.5rem);
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(255, 247, 235, 0.72));
      border: 1px solid rgba(217, 119, 6, 0.14);
      box-shadow: var(--shadow-soft);
      display: grid;
      grid-template-columns: 1.08fr 1fr 1.1fr 1fr 1.08fr;
      grid-template-rows: 1fr 1fr 0.78fr;
      gap: clamp(0.45rem, 0.9vw, 0.72rem);
      align-items: stretch;
    }}

    .bmc-cell {{
      min-width: 0;
      min-height: 0;
      border-radius: clamp(0.85rem, 1.4vw, 1.1rem);
      padding: clamp(0.55rem, 0.9vw, 0.85rem);
      border: 1px solid rgba(217, 119, 6, 0.12);
      background: rgba(255, 255, 255, 0.88);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }}

    .bmc-label {{
      font-family: 'Noto Serif SC', serif;
      font-size: calc(clamp(0.76rem, 1vw, 1rem) * var(--body-scale));
      line-height: 1.3;
      font-weight: 700;
      color: var(--text-primary);
      text-wrap: balance;
    }}

    .bmc-partners {{
      grid-column: 1;
      grid-row: 1 / span 2;
      background: linear-gradient(180deg, rgba(254, 243, 199, 0.96), rgba(255, 251, 235, 0.92));
    }}

    .bmc-activities {{
      grid-column: 2;
      grid-row: 1;
    }}

    .bmc-resources {{
      grid-column: 2;
      grid-row: 2;
    }}

    .bmc-value {{
      grid-column: 3;
      grid-row: 1 / span 2;
      background: linear-gradient(180deg, rgba(255, 237, 213, 0.98), rgba(255, 248, 240, 0.94));
      border-color: rgba(194, 65, 12, 0.12);
    }}

    .bmc-relationships {{
      grid-column: 4;
      grid-row: 1;
    }}

    .bmc-channels {{
      grid-column: 4;
      grid-row: 2;
    }}

    .bmc-segments {{
      grid-column: 5;
      grid-row: 1 / span 2;
      background: linear-gradient(180deg, rgba(236, 253, 245, 0.98), rgba(249, 255, 251, 0.92));
      border-color: rgba(101, 163, 13, 0.16);
    }}

    .bmc-cost {{
      grid-column: 1 / span 3;
      grid-row: 3;
      background: linear-gradient(180deg, rgba(250, 250, 249, 0.98), rgba(255, 255, 255, 0.9));
    }}

    .bmc-revenue {{
      grid-column: 4 / span 2;
      grid-row: 3;
      background: linear-gradient(180deg, rgba(255, 247, 237, 0.98), rgba(255, 255, 255, 0.9));
    }}

    .bullet-card-side {{
      width: 100%;
      max-height: min(52vh, 34rem);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }}

    .image-shell,
    .image-tile {{
      width: 100%;
      border-radius: 0;
      border: none;
      background: transparent;
      box-shadow: none;
      overflow: visible;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .image-shell-large {{
      max-width: min(72rem, 100%);
      max-height: 100%;
      margin: 0 auto;
    }}

    .image-shell img,
    .image-tile img {{
      width: 100%;
      max-width: 100%;
      max-height: min(58vh, 34rem);
      object-fit: contain;
      border-radius: 0;
    }}

    .image-grid {{
      width: min(72rem, 100%);
      margin: 0 auto;
      display: grid;
      gap: clamp(0.8rem, 1.6vw, 1.2rem);
      align-items: stretch;
    }}

    .image-grid-2 {{
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }}

    .image-grid-3 {{
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }}

    .image-grid-4 {{
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }}

    .image-grid-5 {{
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }}

    .split-layout {{
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(15rem, 24rem) minmax(0, 1fr);
      gap: clamp(1rem, 2.2vw, 2rem);
      align-items: center;
    }}

    .split-copy {{
      display: flex;
      flex-direction: column;
      gap: clamp(0.7rem, 1.4vh, 0.95rem);
      max-width: 24rem;
    }}

    .divider {{
      width: clamp(3rem, 7vw, 5.5rem);
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--amber), rgba(217, 119, 6, 0.15));
    }}

    .split-media {{
      min-width: 0;
    }}

    .image-only-panel {{
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .image-only-slide .image-shell-large {{
      width: min(86rem, 100%);
      background: transparent;
    }}

    .image-only-slide .image-shell-large img {{
      max-height: min(72vh, 48rem);
    }}

    .slide-line {{
      position: absolute;
      left: clamp(1.1rem, 4vw, 4rem);
      right: clamp(1.1rem, 4vw, 4rem);
      bottom: clamp(2.75rem, 5.5vh, 4rem);
      height: 1px;
      background: rgba(120, 113, 108, 0.22);
    }}

    .brand,
    .slide-number {{
      position: absolute;
      bottom: clamp(1rem, 2.2vh, 1.4rem);
      font-size: clamp(0.64rem, 0.82vw, 0.82rem);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-light);
      font-weight: 600;
    }}

    .brand {{
      left: clamp(1.1rem, 4vw, 4rem);
      display: flex;
      align-items: center;
      gap: 0.45rem;
      letter-spacing: 0.12em;
      text-transform: none;
    }}

    .brand-text {{
      white-space: pre;
    }}

    .brand-logo {{
      display: block;
      height: clamp(0.8rem, 1.2vh, 1rem);
      width: auto;
      object-fit: contain;
      opacity: 0.85;
    }}

    .slide-number {{
      right: clamp(1.1rem, 4vw, 4rem);
      font-family: 'Playfair Display', serif;
      letter-spacing: 0.08em;
    }}

    /* === PRESENTATION CONTROLS === */
    .progress-track {{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(28, 25, 23, 0.05);
      z-index: 999;
    }}

    .progress-bar {{
      width: 0;
      height: 100%;
      background: linear-gradient(90deg, var(--amber), var(--terracotta));
      box-shadow: 0 0 20px rgba(217, 119, 6, 0.25);
      transition: width 0.35s ease;
    }}

    .nav-dots {{
      position: fixed;
      right: clamp(0.45rem, 1vw, 0.8rem);
      top: 50%;
      transform: translateY(-50%);
      display: grid;
      gap: 0.35rem;
      z-index: 999;
      padding: 0.55rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(217, 119, 6, 0.08);
    }}

    .nav-dot {{
      width: 0.42rem;
      height: 0.42rem;
      border-radius: 999px;
      border: none;
      background: rgba(120, 113, 108, 0.25);
      cursor: pointer;
      transition: transform 0.24s ease, background 0.24s ease;
      padding: 0;
    }}

    .nav-dot.active {{
      background: var(--amber);
      transform: scale(1.6);
    }}

    .keyboard-hint {{
      position: fixed;
      left: 50%;
      bottom: clamp(0.55rem, 1.6vh, 1rem);
      transform: translateX(-50%);
      z-index: 999;
      font-size: clamp(0.64rem, 0.85vw, 0.82rem);
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.58);
      border: 1px solid rgba(217, 119, 6, 0.08);
      border-radius: 999px;
      padding: 0.4rem 0.75rem;
      backdrop-filter: blur(10px);
    }}

    /* === ANIMATIONS === */
    .reveal,
    .reveal-scale {{
      opacity: 0;
      will-change: transform, opacity;
      transition:
        opacity 0.7s var(--ease-out-expo),
        transform 0.7s var(--ease-out-expo),
        filter 0.7s var(--ease-out-expo);
    }}

    .reveal {{
      transform: translateY(26px);
      filter: blur(10px);
    }}

    .reveal-scale {{
      transform: scale(0.96);
    }}

    .slide.visible .reveal,
    .slide.visible .reveal-scale {{
      opacity: 1;
      transform: none;
      filter: blur(0);
    }}

    .slide.visible .reveal:nth-child(1),
    .slide.visible .reveal-scale:nth-child(1) {{ transition-delay: 0.08s; }}
    .slide.visible .reveal:nth-child(2),
    .slide.visible .reveal-scale:nth-child(2) {{ transition-delay: 0.16s; }}
    .slide.visible .reveal:nth-child(3),
    .slide.visible .reveal-scale:nth-child(3) {{ transition-delay: 0.24s; }}
    .slide.visible .reveal:nth-child(4),
    .slide.visible .reveal-scale:nth-child(4) {{ transition-delay: 0.32s; }}
    .slide.visible .reveal:nth-child(5),
    .slide.visible .reveal-scale:nth-child(5) {{ transition-delay: 0.4s; }}
    .slide.visible .bullet-list li:nth-child(1) {{ transition-delay: 0.14s; }}
    .slide.visible .bullet-list li:nth-child(2) {{ transition-delay: 0.22s; }}
    .slide.visible .bullet-list li:nth-child(3) {{ transition-delay: 0.3s; }}
    .slide.visible .bullet-list li:nth-child(4) {{ transition-delay: 0.38s; }}
    .slide.visible .bullet-list li:nth-child(5) {{ transition-delay: 0.46s; }}
    .slide.visible .bullet-list li:nth-child(6) {{ transition-delay: 0.54s; }}

    /* === RESPONSIVE ADJUSTMENTS === */
    @media (max-width: 980px) {{
      .split-layout {{
        grid-template-columns: 1fr;
      }}

      .content-split-layout {{
        grid-template-columns: 1fr;
      }}

      .business-canvas-layout {{
        grid-template-columns: 1fr;
      }}

      .diagram-flow {{
        justify-content: flex-start;
      }}

      .flow-arrow {{
        display: none;
      }}

      .split-copy {{
        max-width: none;
      }}

      .business-canvas-diagram {{
        max-height: min(50vh, 30rem);
      }}

      .image-grid-2 {{
        grid-template-columns: 1fr;
      }}

      .image-grid-3 {{
        grid-template-columns: 1fr;
      }}

      .image-grid-4 {{
        grid-template-columns: 1fr;
      }}

      .image-grid-5 {{
        grid-template-columns: 1fr;
      }}

      .nav-dots {{
        right: 0.25rem;
      }}
    }}

    @media (min-width: 981px) {{
      .bullet-list-columns {{
        columns: 2;
        column-gap: clamp(1.8rem, 3vw, 3rem);
      }}

      .bullet-list-columns li {{
        break-inside: avoid;
      }}
    }}

    @media print {{
      html {{
        scroll-snap-type: none;
      }}

      body {{
        background: white;
      }}

      .slide {{
        page-break-after: always;
      }}

      .progress-track,
      .nav-dots,
      .keyboard-hint {{
        display: none;
      }}
    }}
  </style>
</head>
<body>
  <div class="progress-track" aria-hidden="true">
    <div class="progress-bar" id="progressBar"></div>
  </div>
  <nav class="nav-dots" id="navDots" aria-label="Slide navigation"></nav>
{sections}
  <script>
    class SlidePresentation {{
      constructor() {{
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.currentSlide = 0;
        this.progressBar = document.getElementById('progressBar');
        this.navDots = document.getElementById('navDots');
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.buildDots();
        this.setupIntersectionObserver();
        this.setupKeyboardNav();
        this.setupTouchNav();
        this.updateActiveState(0);
        this.goToHash();
        window.addEventListener('hashchange', () => this.goToHash());
        window.addEventListener('scroll', () => this.updateProgress(), {{ passive: true }});
        window.addEventListener('resize', () => this.updateProgress(), {{ passive: true }});
      }}

      buildDots() {{
        this.slides.forEach((slide, index) => {{
          const button = document.createElement('button');
          button.className = 'nav-dot';
          button.type = 'button';
          button.setAttribute('aria-label', `Go to slide ${{index + 1}}`);
          button.addEventListener('click', () => this.goToSlide(index));
          this.navDots.appendChild(button);
        }});
        this.dots = Array.from(this.navDots.querySelectorAll('.nav-dot'));
      }}

      setupIntersectionObserver() {{
        const observer = new IntersectionObserver((entries) => {{
          entries.forEach((entry) => {{
            if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {{
              const index = this.slides.indexOf(entry.target);
              entry.target.classList.add('visible');
              this.updateActiveState(index);
            }}
          }});
        }}, {{
          threshold: [0.55, 0.75]
        }});

        this.slides.forEach((slide) => observer.observe(slide));
      }}

      setupKeyboardNav() {{
        document.addEventListener('keydown', (event) => {{
          if (event.target && /input|textarea|select/i.test(event.target.tagName)) {{
            return;
          }}

          if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {{
            event.preventDefault();
            this.goToSlide(Math.min(this.currentSlide + 1, this.slides.length - 1));
          }}

          if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {{
            event.preventDefault();
            this.goToSlide(Math.max(this.currentSlide - 1, 0));
          }}

          if (event.key === 'Home') {{
            event.preventDefault();
            this.goToSlide(0);
          }}

          if (event.key === 'End') {{
            event.preventDefault();
            this.goToSlide(this.slides.length - 1);
          }}
        }});
      }}

      setupTouchNav() {{
        document.addEventListener('touchstart', (event) => {{
          this.touchStartY = event.changedTouches[0].screenY;
        }}, {{ passive: true }});

        document.addEventListener('touchend', (event) => {{
          this.touchEndY = event.changedTouches[0].screenY;
          const delta = this.touchStartY - this.touchEndY;
          if (Math.abs(delta) < 60) {{
            return;
          }}
          if (delta > 0) {{
            this.goToSlide(Math.min(this.currentSlide + 1, this.slides.length - 1));
          }} else {{
            this.goToSlide(Math.max(this.currentSlide - 1, 0));
          }}
        }}, {{ passive: true }});
      }}

      goToSlide(index, smooth = true) {{
        this.slides[index].scrollIntoView({{ behavior: smooth ? 'smooth' : 'auto', block: 'start' }});
        this.updateActiveState(index);
      }}

      updateActiveState(index) {{
        this.currentSlide = index;
        this.slides.forEach((slide, slideIndex) => {{
          slide.classList.toggle('is-active', slideIndex === index);
        }});
        if (this.dots) {{
          this.dots.forEach((dot, dotIndex) => {{
            dot.classList.toggle('active', dotIndex === index);
          }});
        }}
        const hash = `#slide-${{String(index + 1).padStart(2, '0')}}`;
        if (window.location.hash !== hash) {{
          history.replaceState(null, '', hash);
        }}
        this.updateProgress();
      }}

      goToHash() {{
        const match = window.location.hash.match(/#slide-(\\d+)/);
        if (!match) {{
          return;
        }}
        const index = Number.parseInt(match[1], 10) - 1;
        if (index >= 0 && index < this.slides.length) {{
          requestAnimationFrame(() => this.goToSlide(index, false));
        }}
      }}

      updateProgress() {{
        const denominator = Math.max(this.slides.length - 1, 1);
        const progress = (this.currentSlide / denominator) * 100;
        this.progressBar.style.width = `${{progress}}%`;
      }}
    }}

    new SlidePresentation();
  </script>
</body>
</html>
"""


def main() -> None:
    args = parse_args()
    source = args.source.expanduser().resolve()
    output_dir = args.output.expanduser().resolve()

    slides = parse_note(source)
    output_dir.mkdir(parents=True, exist_ok=True)
    asset_map = copy_assets(source, slides, output_dir)
    html_content = build_html(slides, asset_map, args.brand)
    (output_dir / "index.html").write_text(html_content, encoding="utf-8")

    print(f"Rendered {len(slides)} slides to {output_dir / 'index.html'}")
    print(f"Copied {len(asset_map)} image assets into {output_dir / 'assets'}")


if __name__ == "__main__":
    main()
