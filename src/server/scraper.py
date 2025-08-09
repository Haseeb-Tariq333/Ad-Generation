import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import asyncio
from playwright.async_api import async_playwright

def extract_social_links(soup, base_url):
    socials = {}
    social_patterns = {
        "facebook": "facebook.com",
        "instagram": "instagram.com",
        "twitter": "twitter.com",
        "linkedin": "linkedin.com",
        "youtube": "youtube.com"
    }
    for link in soup.find_all("a", href=True):
        href = link["href"]
        for platform, domain in social_patterns.items():
            if domain in href:
                socials[platform] = urljoin(base_url, href)
    return socials

def extract_metadata(soup, base_url):
    data = {
        "brand_name": None,
        "slogan": None,
        "logo_url": None,
        "socials": {}
    }

    # Brand name
    title_tag = soup.find("title")
    og_site_name = soup.find("meta", property="og:site_name")
    h1_tag = soup.find("h1")
    data["brand_name"] = (
        og_site_name["content"] if og_site_name else
        title_tag.text.strip() if title_tag else
        h1_tag.text.strip() if h1_tag else
        None
    )

    # Slogan
    desc = soup.find("meta", attrs={"name": "description"})
    og_desc = soup.find("meta", property="og:description")
    data["slogan"] = (
        desc["content"].strip() if desc else
        og_desc["content"].strip() if og_desc else
        None
    )

    # Logo
    og_image = soup.find("meta", property="og:image")
    favicon = soup.find("link", rel=lambda v: v and "icon" in v.lower())
    data["logo_url"] = (
        urljoin(base_url, og_image["content"]) if og_image and og_image.get("content") else
        urljoin(base_url, favicon["href"]) if favicon and favicon.get("href") else
        None
    )

    # Social links
    data["socials"] = extract_social_links(soup, base_url)

    return data

def scrape_with_requests(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=10)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        return extract_metadata(soup, url)
    except Exception as e:
        print("Requests scraper failed:", e)
        return None

async def scrape_with_playwright(url):
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, timeout=20000)
            html = await page.content()
            await browser.close()
            soup = BeautifulSoup(html, "html.parser")
            return extract_metadata(soup, url)
    except Exception as e:
        print("Playwright scraper failed:", e)
        return None

def scrape_website(url):
    """Main function to scrape a website for brand data."""
    data = scrape_with_requests(url)
    if data and data.get("brand_name"):
        return data
    return asyncio.run(scrape_with_playwright(url))
