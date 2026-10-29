"""Render the 15 free-trial Meta ad posters (1080x1350 and 1080x1080) and a contact sheet.

Usage (from this folder):  python generate.py
Needs Google Chrome (or Edge) and Pillow. Edit copy in creatives.json, then re-run.
"""
import json, re, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
BROWSERS = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            "google-chrome", "chromium"]
SIZES = {"portrait": (1080, 1350, "portrait-1080x1350"), "square": (1080, 1080, "square-1080x1080")}
LANDING = "https://brandmintai.io/meta-growth/?industry={slug}&utm_source=meta&utm_medium=paid_social&utm_campaign={campaign}"


def browser():
    for b in BROWSERS:
        if Path(b).exists() or "\\" not in b:
            return b
    sys.exit("Chrome or Edge not found")


def words(c):
    text = " ".join(["7 DAYS FREE", c["category"], re.sub("<[^>]+>", "", c["outcome"]), "Start Free Trial"])
    return len(text.split())


def main():
    creatives = json.loads((HERE / "creatives.json").read_text(encoding="utf-8"))
    (HERE / "creatives.js").write_text("window.CREATIVES = " + json.dumps(creatives, ensure_ascii=False) + ";\n", encoding="utf-8")
    exe, page = browser(), (HERE / "poster.html").as_uri()
    problems, rows = [], []
    for i, c in enumerate(creatives):
        n = words(c)
        if n >= 20:
            problems.append(f"{c['id']} has {n} words")
        name = f"{c['id']}-{c['slug']}"
        for size, (w, h, folder) in SIZES.items():
            url = f"{page}?i={i}&size={size}"
            common = [exe, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                      f"--window-size={w},{h}", "--virtual-time-budget=8000"]
            dom = subprocess.run(common + ["--dump-dom", url], capture_output=True, text=True, encoding="utf-8").stdout
            if "<title>ok</title>" not in dom:
                problems.append(f"{name} {size}: text does not fit")
            png = OUT / folder / f"qw-trial-{name}-{w}x{h}.png"
            subprocess.run(common + [f"--screenshot={png}", url], capture_output=True)
            with Image.open(png) as im:
                if im.size != (w, h):
                    problems.append(f"{png.name} is {im.size}")
        rows.append([c["id"], c["slug"], c["category"].title(), n,
                     LANDING.format(slug=c["slug"], campaign=c["slug"].replace("-", "_") + "_trial")])
    (OUT / "landing-urls.csv").write_text(
        "id,industry,category,words,landing_url\n" + "".join(",".join(map(str, r)) + "\n" for r in rows), encoding="utf-8")
    contact_sheet(creatives)
    print("\n".join(problems) if problems else f"All {len(creatives)} posters rendered, text fits, all under 20 words.")


def contact_sheet(creatives):
    cols, tw, th, pad, label = 5, 324, 405, 24, 34
    rows = (len(creatives) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + pad) + pad, rows * (th + label + pad) + pad + 60), "#111")
    d = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arialbd.ttf", 18); big = ImageFont.truetype("arialbd.ttf", 26)
    except OSError:
        font = big = ImageFont.load_default()
    d.text((pad, 18), "Quantum Weave AI · Free 7-day trial · Meta ad posters (1080x1350)", fill="#EFFF00", font=big)
    for k, c in enumerate(creatives):
        x, y = pad + (k % cols) * (tw + pad), 60 + pad + (k // cols) * (th + label + pad)
        with Image.open(OUT / "portrait-1080x1350" / f"qw-trial-{c['id']}-{c['slug']}-1080x1350.png") as im:
            sheet.paste(im.convert("RGB").resize((tw, th), Image.LANCZOS), (x, y))
        d.text((x, y + th + 6), f"{c['id']} · {c['category'].title()}", fill="#fff", font=font)
    sheet.save(OUT / "contact-sheet.png", optimize=True)


if __name__ == "__main__":
    main()
