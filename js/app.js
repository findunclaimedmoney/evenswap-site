const PRODUCTS = [
  {
    slug: "stack-royale",
    title: "The Uzzle: Stack Royale",
    badge: "Flagship",
    price: 46.62,
    image: "/img/stack-hq.jpg",
    video: "/video/uzzle-swap-the-scroll.mp4",
    buyUrl: "https://buy.stripe.com/28E9AS524dc9gUZ5E44c80m",
    blurb: "Fast-paced block-stacking frenzy. 32 coloured wooden blocks, 160 challenge cards. Race friends or the clock.",
    box: ["32 coloured wooden blocks", "160 challenge cards", "4 difficulty tiers", "1 to 16 players", "Free shipping in Australia"],
    group: "flagship"
  },
  {
    slug: "expansion-pack-1",
    title: "The Uzzle: Expansion Pack 1",
    badge: "Expansion",
    price: 46.12,
    image: "/img/expansion-hq.png",
    buyUrl: "https://buy.stripe.com/4gM5kCgKMc856gl0jK4c80l",
    blurb: "50 extra high-difficulty challenge cards and extra coloured blocks per player. Needs a Uzzle base game.",
    box: ["50 master-tier cards", "Extra coloured blocks", "Requires Uzzle 3.0 or 4.0", "Free shipping in Australia"],
    group: "expansion"
  },
  {
    slug: "uzzle-3",
    title: "The Uzzle 3.0",
    badge: "Base game",
    price: 64.99,
    image: "/img/uzzle-hq.png",
    buyUrl: "https://buy.stripe.com/3cIcN4dyA1trgUZ6I84c80k",
    blurb: "Brand-new sealed Uzzle 3.0. The base game expansions plug into. Free shipping Australia-wide.",
    box: ["Sealed base game", "Rules learned in under a minute", "Expansions need this or 4.0", "Free shipping in Australia"],
    group: "base"
  }
];

const LISTINGS = [
  { id: "l1", title: "1984 VK Commodore Limited Edition", price: 15000, tag: "Swap", place: "Reservoir VIC", blurb: "Inspect, then pay. Cash, swap, or a mix." },
  { id: "l2", title: "2019 Sea-Doo GTI 130 + trailer", price: 8500, tag: "Swap", place: "Frankston VIC", blurb: "On the trailer. Meet at the ramp." },
  { id: "l3", title: "$200 Bunnings voucher", price: 150, tag: "Voucher", place: "Melbourne", blurb: "75% of face. Balance checked with both of you." },
  { id: "l4", title: "$100 Dan Murphy's voucher", price: 75, tag: "Voucher", place: "Melbourne", blurb: "75% of face. A photo is not the voucher." },
  { id: "l5", title: "Giant Trance mountain bike (M)", price: 900, tag: "Cash", place: "Brunswick VIC", blurb: "Serviced. Ride it before you pay." },
  { id: "l7", title: "40 boxes Italian porcelain 600×600", price: 1800, tag: "Clearance", place: "Campbellfield VIC", blurb: "Pickup only. Odd-lot stock." }
];

const MARQUEE = ["Stack Royale", "Expansion Pack 1", "Gift-wrap bundle", "Catan", "Codenames", "Ticket to Ride", "Azul", "Dobble"];

const money = (n) => new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(n);
const cartKey = "uzzle-cart";
const loadCart = () => { try { return JSON.parse(localStorage.getItem(cartKey) || "[]"); } catch { return []; } };
const saveCart = (items) => localStorage.setItem(cartKey, JSON.stringify(items));

let cartOpen = false;
let assistOpen = false;
let menuOpen = false;
let chat = [{ role: "assistant", content: "Ask me which game to pick." }];
let shopQ = "";
let shopFilter = "all";
let marketFilter = "all";

function product(slug) { return PRODUCTS.find((p) => p.slug === slug); }
function listing(id) { return LISTINGS.find((l) => l.id === id); }

function logo() {
  return `<a class="logo" href="/" data-link><span class="mark"></span>UZZLE.</a>`;
}

function nav() {
  const path = location.pathname;
  const links = [
    ["/shop", "Shop"],
    ["/catalogue", "Catalogue"],
    ["/marketplace", "Marketplace"],
    ["/orders", "Orders"]
  ];
  const n = loadCart().reduce((s, i) => s + i.qty, 0);
  return `<header class="nav">
    ${logo()}
    <nav class="links">${links.map(([h, l]) => `<a href="${h}" data-link class="${path === h ? "on" : ""}">${l}</a>`).join("")}</nav>
    <div class="nav-right">
      <button class="menu-btn" id="menu" aria-label="Menu">Menu</button>
      <button class="cart-btn" id="openCart">Cart${n ? ` · ${n}` : ""}</button>
      <a class="amber-btn" href="/orders" data-link>Sign in</a>
    </div>
  </header>
  <div class="mobile-links ${menuOpen ? "open" : ""}">${links.map(([h, l]) => `<a href="${h}" data-link>${l}</a>`).join("")}</div>`;
}

function footer() {
  return `<footer class="foot"><div class="wrap foot-grid">
    <div>${logo()}<p>The official Uzzle shop — fast-paced wooden block games, plus the world's best board game catalogue and a used marketplace.</p></div>
    <div><h4>Shop</h4><a href="/shop" data-link>All games</a><a href="/catalogue" data-link>Board game catalogue</a><a href="/marketplace" data-link>Used marketplace</a></div>
    <div><h4>Account</h4><a href="/orders" data-link>Order history</a><a href="/orders" data-link>Sign in</a></div>
  </div><div class="wrap legal"><span>© ${new Date().getFullYear()} Uzzle — official shop & trade desk.</span><span>Cards by Stripe · Razorpay · Paystack</span></div></footer>`;
}

function card(p) {
  return `<article class="card">
    <a class="pic" href="/product/${p.slug}" data-link><img src="${p.image}" alt="${p.title}" /><span class="badge">${p.badge}</span></a>
    <div class="body">
      <a href="/product/${p.slug}" data-link><h3>${p.title}</h3></a>
      <p class="desc">${p.blurb}</p>
      <div class="buyline"><span class="price">${money(p.price)}</span><button class="add" data-add="${p.slug}">Add</button></div>
    </div>
  </article>`;
}

function marquee() {
  const row = MARQUEE.map((name) => `<span>${name}</span><span class="d">◆</span>`).join("");
  return `<div class="marquee"><div class="track">${row}${row}</div></div>`;
}

function home() {
  return `<main>
    <section class="hero"><div class="glow-a"></div><div class="glow-b"></div>
      <div class="wrap hero-grid">
        <div>
          <div class="eyebrow">The official Uzzle shop</div>
          <h1 class="display">Precision<span class="dot">.</span><br><span class="outline">Speed</span><span class="dot">.</span><br>Frenzy<span class="dot">.</span></h1>
          <p class="lede">The award-winning wooden block speed game played by 100,000+ families. Race cards, stack blueprints, and master the world's most thrilling game table.</p>
          <div class="row">
            <a class="amber-btn" href="/product/stack-royale" data-link>Shop Uzzle flagship →</a>
            <a class="ghost-btn" href="/catalogue" data-link>Explore catalogue</a>
          </div>
          <div class="stats">
            <div><b>100,000+</b><span>Families playing</span></div>
            <div><b>< 60s</b><span>Rules learned</span></div>
            <div><b>99.8%</b><span>Cards accepted</span></div>
          </div>
        </div>
        <div class="frame">
          <div class="brackets"><i></i><i></i><i></i><i></i></div>
          <div class="shot" id="heroShot">
            <img id="heroStill" src="/img/stack-hq.jpg" alt="The Uzzle Stack Royale" />
            <button class="play" id="playAd" type="button">Play ad</button>
            <div class="shade"></div>
            <div class="cap"><div class="eyebrow">Flagship bestseller</div><strong>The Uzzle: Stack Royale</strong></div>
          </div>
          <aside class="glass"><div class="k">✓ Fraud-screened checkout</div><p>Cards approved first time. Stripe, Razorpay & Paystack — fraud screening runs invisibly.</p></aside>
        </div>
      </div>
    </section>
    ${marquee()}
    <section class="section"><div class="wrap">
      <div class="head"><div><div class="eyebrow">The Uzzle collection</div><h2 class="h1">Flagship games</h2></div><a class="link-amber" href="/shop" data-link>Shop all →</a></div>
      <div class="grid">${PRODUCTS.map(card).join("")}</div>
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="eyebrow">Why Uzzle</div>
      <h2 class="h1">Built for game night</h2>
      <div class="why">
        <article><h3>60-second rules</h3><p>Learn in under a minute. First game in two.</p></article>
        <article><h3>4 difficulty tiers</h3><p>Beginner to extreme. Kids and adults play together.</p></article>
        <article><h3>1 to 16 players</h3><p>Solo race or full-table tournament.</p></article>
        <article><h3>Frictionless cards</h3><p>99.8% card acceptance, fraud-screened invisibly.</p></article>
      </div>
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap"><div class="cta"><div class="blob"></div>
      <h2>Ready to stack?</h2>
      <p>The Uzzle flagship ships free over $50. Add the Expansion Pack and take it to master level.</p>
      <div class="row">
        <a class="amber-btn" href="/product/stack-royale" data-link>Shop now</a>
        <a class="ghost-btn" href="/catalogue" data-link>Browse catalogue</a>
      </div>
    </div></div></section>
  </main>`;
}

function shopPage(mode) {
  const eye = mode === "catalogue" ? "Catalogue" : "Shop";
  const heading = mode === "catalogue" ? "Board games" : "The catalogue";
  let items = PRODUCTS.filter((p) => {
    if (shopFilter !== "all" && p.group !== shopFilter) return false;
    const q = shopQ.trim().toLowerCase();
    return !q || (p.title + p.blurb).toLowerCase().includes(q);
  });
  return `<main class="page"><div class="wrap">
    <div class="eyebrow">${eye}</div>
    <h1>${heading}</h1>
    <div class="filters">
      <div class="search"><input id="q" placeholder="Search games" /></div>
      <div class="chips">
        ${[["all", "All"], ["flagship", "Flagship"], ["expansion", "Expansion"], ["base", "Base game"]].map(([id, label]) => `<button class="chip ${shopFilter === id ? "on" : ""}" data-filter="${id}">${label}</button>`).join("")}
      </div>
    </div>
    <div class="count">${items.length} game${items.length === 1 ? "" : "s"}</div>
    ${items.length ? `<div class="grid">${items.map(card).join("")}</div>` : `<div class="empty">Nothing matches</div>`}
  </div></main>`;
}

function marketPage() {
  let items = LISTINGS.filter((l) => marketFilter === "all" || l.tag.toLowerCase() === marketFilter);
  return `<main class="page"><div class="wrap">
    <div class="head"><div><div class="eyebrow">Used marketplace</div><h1>Trade desk</h1></div><a class="amber-btn" href="/post" data-link>List an item</a></div>
    <div class="chips" style="border:0;padding-top:22px">
      ${["all", "swap", "voucher", "clearance", "cash"].map((id) => `<button class="chip ${marketFilter === id ? "on" : ""}" data-mfilter="${id}">${id}</button>`).join("")}
    </div>
    <div class="grid">${items.map((l) => `<article class="card"><div class="body">
      <div class="eyebrow">${l.tag}</div>
      <a href="/listing/${l.id}" data-link><h3>${l.title}</h3></a>
      <p class="desc">${l.blurb}</p>
      <div class="buyline"><span class="price">${money(l.price)}</span><span class="desc">${l.place}</span></div>
    </div></article>`).join("")}</div>
  </div></main>`;
}

function productPage(slug) {
  const p = product(slug);
  if (!p) return `<main class="page"><div class="wrap" style="text-align:center;padding:80px 0"><h1>Game not found</h1><a class="amber-btn" href="/shop" data-link>Back to shop</a></div></main>`;
  const media = p.video
    ? `<video controls playsinline poster="${p.image}"><source src="${p.video}" type="video/mp4" /></video>`
    : `<img src="${p.image}" alt="${p.title}" />`;
  return `<main class="page"><div class="wrap">
    <a class="back" href="/shop" data-link>← Back to shop</a>
    <div class="detail">
      <div class="pic">${media}<span class="badge">${p.badge}</span></div>
      <div>
        <h1>${p.title}</h1>
        <p class="blurb">${p.blurb}</p>
        <div class="box"><div class="eyebrow">In the box</div><ul>${p.box.map((b) => `<li>${b}</li>`).join("")}</ul></div>
        <div class="row" style="align-items:center">
          <span class="bigprice">${money(p.price)}</span>
          <span class="chip on">Free shipping</span>
        </div>
        <div class="row">
          <a class="amber-btn" href="${p.buyUrl}" target="_blank" rel="noopener">Buy now</a>
          <button class="ghost-btn" data-add="${p.slug}">Add</button>
        </div>
        <p class="desc">Card checkout opens Stripe. No account needed.</p>
      </div>
    </div>
    <div class="section"><div class="eyebrow">You may also like</div><div class="grid">${PRODUCTS.filter((x) => x.slug !== p.slug).map(card).join("")}</div></div>
  </div></main>`;
}

function listingPage(id) {
  const l = listing(id);
  if (!l) return `<main class="page"><div class="wrap"><h1>Listing gone</h1></div></main>`;
  return `<main class="page"><div class="wrap">
    <a class="back" href="/marketplace" data-link>← Trade desk</a>
    <div class="eyebrow">${l.tag} · ${l.place}</div>
    <h1>${l.title}</h1>
    <p class="bigprice">${money(l.price)}</p>
    <p class="blurb">${l.blurb} Meet in public. A screenshot is not a payment.</p>
    <a class="amber-btn" href="/post" data-link>Make an offer</a>
  </div></main>`;
}

function ordersPage() {
  return `<main class="page"><div class="wrap">
    <div class="eyebrow">Account</div>
    <h1>Order history</h1>
    <p class="lede">Card payments are confirmed by Stripe. This desk does not store card numbers. Buy without an account.</p>
    <div class="row"><a class="amber-btn" href="/shop" data-link>Back to the shop</a></div>
  </div></main>`;
}

function postPage() {
  return `<main class="page"><div class="wrap" style="max-width:640px">
    <div class="eyebrow">Trade desk</div>
    <h1>List an item</h1>
    <form id="postForm" class="box field" style="display:grid;gap:12px">
      <input name="title" required placeholder="What is it?" />
      <input name="price" type="number" min="1" step="1" required placeholder="Asking price (AUD)" />
      <input name="place" required placeholder="Suburb" />
      <textarea name="blurb" rows="4" required placeholder="Condition, and whether you will swap"></textarea>
      <button class="amber-btn" type="submit">Publish on the desk</button>
    </form>
  </div></main>`;
}

function cartDrawer() {
  if (!cartOpen) return "";
  const items = loadCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return `<div class="drawer-back" id="closeCart"></div><aside class="drawer">
    <header><h2>Cart</h2><button class="ghost-btn" id="closeCart2">Close</button></header>
    <div style="flex:1;overflow:auto">
      ${items.length ? items.map((i) => `<div class="line"><img src="${i.image}" alt="" /><div><strong>${i.title}</strong><div class="price">${money(i.price)} × ${i.qty}</div><button class="ghost-btn" data-remove="${i.slug}" style="margin-top:8px">Remove</button></div></div>`).join("") : `<p class="desc">Cart is empty.</p>`}
    </div>
    <div>
      <div class="bigprice">${money(total)}</div>
      <p class="desc">Each game checks out on its own Stripe page.</p>
      ${items.map((i) => `<a class="amber-btn" style="margin-top:8px" href="${i.buyUrl}" target="_blank" rel="noopener">Pay ${i.title}</a>`).join("")}
    </div>
  </aside>`;
}

function assistant() {
  const panel = assistOpen ? `<section class="assist">
    <header><h2>Uzzle Assistant</h2><button class="ghost-btn" id="closeAssist">Close</button></header>
    <div class="log">${chat.map((m) => `<div class="bubble ${m.role === "user" ? "me" : "bot"}">${m.content}</div>`).join("")}</div>
    <form id="ask"><input name="q" placeholder="Which game should I get?" required /><button class="amber-btn" type="submit">Send</button></form>
  </section>` : "";
  return `${panel}<button class="fab" id="fab" aria-label="Ask Uzzle">Ask</button>`;
}

function view() {
  const path = location.pathname.replace(/\/$/, "") || "/";
  let main = home();
  if (path === "/shop") main = shopPage("shop");
  else if (path === "/catalogue") main = shopPage("catalogue");
  else if (path === "/marketplace") main = marketPage();
  else if (path === "/orders") main = ordersPage();
  else if (path === "/post") main = postPage();
  else if (path.startsWith("/product/")) main = productPage(decodeURIComponent(path.split("/")[2] || ""));
  else if (path.startsWith("/listing/")) main = listingPage(decodeURIComponent(path.split("/")[2] || ""));
  document.getElementById("app").innerHTML = `<div class="grain">${nav()}${main}${footer()}${cartDrawer()}${assistant()}</div>`;
  bind();
}

function bind() {
  document.querySelectorAll("[data-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || a.target === "_blank") return;
      e.preventDefault();
      menuOpen = false;
      history.pushState({}, "", a.getAttribute("href"));
      window.scrollTo(0, 0);
      view();
    });
  });
  const menu = document.getElementById("menu");
  if (menu) menu.onclick = () => { menuOpen = !menuOpen; view(); };
  document.getElementById("openCart").onclick = () => { cartOpen = true; view(); };
  const c1 = document.getElementById("closeCart");
  const c2 = document.getElementById("closeCart2");
  if (c1) c1.onclick = () => { cartOpen = false; view(); };
  if (c2) c2.onclick = () => { cartOpen = false; view(); };
  document.querySelectorAll("[data-add]").forEach((b) => b.onclick = () => {
    const p = product(b.dataset.add);
    const items = loadCart();
    const hit = items.find((i) => i.slug === p.slug);
    if (hit) hit.qty += 1;
    else items.push({ slug: p.slug, title: p.title, price: p.price, image: p.image, buyUrl: p.buyUrl, qty: 1 });
    saveCart(items);
    cartOpen = true;
    view();
  });
  document.querySelectorAll("[data-remove]").forEach((b) => b.onclick = () => {
    saveCart(loadCart().filter((i) => i.slug !== b.dataset.remove));
    view();
  });
  document.querySelectorAll("[data-filter]").forEach((b) => b.onclick = () => { shopFilter = b.dataset.filter; view(); });
  document.querySelectorAll("[data-mfilter]").forEach((b) => b.onclick = () => { marketFilter = b.dataset.mfilter; view(); });
  const q = document.getElementById("q");
  if (q) {
    q.value = shopQ;
    q.oninput = () => {
      shopQ = q.value;
      const pos = q.selectionStart;
      view();
      const n = document.getElementById("q");
      if (n) { n.focus(); n.selectionStart = n.selectionEnd = pos; }
    };
  }
  const play = document.getElementById("playAd");
  if (play) play.onclick = () => {
    const shot = document.getElementById("heroShot");
    shot.querySelector("#heroStill")?.remove();
    play.remove();
    const v = document.createElement("video");
    v.src = "/video/uzzle-swap-the-scroll.mp4";
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    shot.prepend(v);
  };
  const fab = document.getElementById("fab");
  if (fab) fab.onclick = () => { assistOpen = !assistOpen; view(); };
  const closeA = document.getElementById("closeAssist");
  if (closeA) closeA.onclick = () => { assistOpen = false; view(); };
  const ask = document.getElementById("ask");
  if (ask) ask.onsubmit = async (e) => {
    e.preventDefault();
    const text = new FormData(ask).get("q").toString().trim();
    if (!text) return;
    chat.push({ role: "user", content: text });
    chat.push({ role: "assistant", content: "…" });
    view();
    try {
      const res = await fetch("/api/grok", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: chat.filter((m) => m.content !== "…") }) });
      const data = await res.json();
      chat = chat.filter((m) => m.content !== "…");
      chat.push({ role: "assistant", content: data.reply || data.error || "I could not answer that." });
    } catch {
      chat = chat.filter((m) => m.content !== "…");
      chat.push({ role: "assistant", content: "Stack Royale is the flagship at $46.62. Expansion Pack is $46.12 and needs a base game. Uzzle 3.0 is $64.99." });
    }
    view();
  };
  const post = document.getElementById("postForm");
  if (post) post.onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(post);
    LISTINGS.unshift({ id: "l" + Date.now(), title: f.get("title"), price: Number(f.get("price")), tag: "Cash", place: f.get("place"), blurb: f.get("blurb") });
    history.pushState({}, "", "/marketplace");
    view();
  };
}

window.addEventListener("popstate", view);
view();
