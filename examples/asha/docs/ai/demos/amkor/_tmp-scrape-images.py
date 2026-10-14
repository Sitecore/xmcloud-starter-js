import re
import urllib.request

url = "https://amkor.com/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
pattern = r"https?://[^\"'\s>]+\.(?:jpg|jpeg|png|webp|svg)(?:\?[^\"'\s>]*)?"
urls = sorted(set(re.findall(pattern, html, re.I)))
print("COUNT", len(urls))
for u in urls:
    print(u)
