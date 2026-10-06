# manus.flckz website

Sports photography and video in Miami, Florida. Plain HTML, CSS and JavaScript with no build step, hosted on GitHub Pages.

## Put it on GitHub Pages

1. Sign in at github.com (or create an account).
2. Create a new repository, for example `manusflckz-site`. Set it to **Public** and leave every "Initialize" box unticked.
3. On the empty repository page, click **uploading an existing file**. Drag in everything from the site folder: all the `.html` files, `styles.css`, `script.js`, the icons, `robots.txt`, `sitemap.xml`, this README, and the `images`, `join`, `locations`, `faqs` and `cart` folders. Click **Commit changes**.
4. Go to **Settings > Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then **Save**.
5. After a minute or two the site is at `https://YOUR-USERNAME.github.io/manusflckz-site/`. Check every page there. This address is public but nobody knows it yet.

## Launch checklist

Do not switch the domain until every box is checked.

- [x] Favicon on every page
- [x] No "Made with AI" tag, badge or credit anywhere
- [x] Privacy Policy page (`privacy-policy.html`)
- [x] Terms and Conditions page (`terms-and-conditions.html`)
- [x] Old Squarespace links (`/join`, `/locations`, `/faqs`, `/cart`) send visitors to the right section
- [ ] A parent or guardian has read the Privacy Policy and Terms. No lawyer has reviewed them. They promise to take photos down on request, refund a confirmed game that gets missed, keep copyright with manus.flckz, and let clients post photos on social media and recruiting profiles.
- [ ] Booking tested on a real phone: "Send by email" and "Send by text" both arrive.
- [ ] Custom domain connected (below).

## Connect www.manusflckz.net

1. In the repository, go to **Settings > Pages > Custom domain**, type `www.manusflckz.net` and click **Save**.
2. Wherever manusflckz.net is registered (probably Squarespace, under Domains), open its DNS settings. Remove the old Squarespace records for `www` and `@`, then add:
   - A `CNAME` record: host `www`, value `YOUR-USERNAME.github.io`
   - Four `A` records: host `@`, values `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Wait for GitHub's DNS check to pass (it can take up to a day), then tick **Enforce HTTPS**.
4. Recommended: verify the domain under your GitHub profile's **Settings > Pages**, so no one else can use it on GitHub.
5. Only cancel the Squarespace website plan once https://www.manusflckz.net shows the new site. Keep paying for the domain itself.

## Rain photo

The #53 rain photo isn't in `images/` yet, so the huddle photo is in its spot. To add it, upload it as `images/rain-53.jpg`, then in `index.html` change the first photo in the gallery to:

```html
<img src="images/rain-53.jpg" width="2000" height="1333" alt="Football player wearing number 53 holds his mouthguard strap on the sideline as rain falls">
```
