"use strict";(()=>{var L=class{constructor(t){this.value=t}toString(){return this.value}},xe={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function ve(e){return String(e??"").replace(/[&<>"']/g,t=>xe[t])}var z=e=>new L(e);function D(e){return e instanceof L?e.value:Array.isArray(e)?e.map(D).join(""):e==null||e===!1?"":ve(e)}function a(e,...t){let s=e[0];return t.forEach((i,r)=>{s+=D(i)+e[r+1]}),new L(s)}function l(e,t){e.innerHTML=t.value}function m(e){return e&&/^(https?:|mailto:|tel:|\/)/i.test(e)?e:"#"}function G(e,t){let s;return(...i)=>{window.clearTimeout(s),s=window.setTimeout(()=>e(...i),t)}}function H(e){if(!e)return"";let[t,s]=e.split("-").map(Number);return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][(s||1)-1]} ${t}`}function W(e){return"tel:"+e.replace(/[^\d+]/g,"")}var J={calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',tasks:'<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',brain:'<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M12 18V5"/>',shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',workflow:'<rect x="3" y="3" width="8" height="8" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect x="13" y="13" width="8" height="8" rx="2"/>',code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',chart:'<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',check:'<path d="M20 6 9 17l-5-5"/>',star:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>',api:'<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>',layers:'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',award:'<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',message:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',pen:'<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',arrowRight:'<path d="M5 12h14M12 5l7 7-7 7"/>',arrowLeft:'<path d="M19 12H5M12 19l-7-7 7-7"/>',arrowUp:'<path d="m18 15-6-6-6 6"/>',arrowDown:'<path d="m6 9 6 6 6-6"/>',download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',external:'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',plus:'<path d="M12 5v14M5 12h14"/>',trash:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',eyeOff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>',home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',key:'<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>',dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',mapPin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',grip:'<circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/>'},I={github:'<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.19.7.8.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>',linkedin:'<path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>'};function n(e,t="h-5 w-5"){let s=e&&(J[e]||I[e])?e:"sparkle";return I[s]?z(`<svg class="${t}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${I[s]}</svg>`):z(`<svg class="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${J[s]}</svg>`)}function g(e=3,t="h-56"){return a`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
    <span class="sr-only">Loading…</span>
    ${Array.from({length:e},()=>a`<div class="skeleton ${t}"></div>`)}
  </div>`}function f(e){return a`<div class="card mx-auto max-w-lg p-8 text-center" role="alert">
    <span class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-700">${n("alert")}</span>
    <h2 class="mt-4 text-lg font-semibold">Something went wrong</h2>
    <p class="mt-2 text-sm text-muted">${e}</p>
    <button type="button" class="btn-dark mt-5" data-retry>Try again</button>
  </div>`}function u(e,t){return a`<div class="card mx-auto max-w-lg border-dashed p-8 text-center">
    <span class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-mist text-muted">${n("folder")}</span>
    <h3 class="mt-4 text-base font-semibold">${e}</h3>
    <p class="mt-2 text-sm text-muted">${t}</p>
  </div>`}function x(e,t,s="",i=!1){return a`<div class="${i?"mx-auto text-center":""} max-w-2xl">
    <p class="eyebrow">${e}</p>
    <h2 class="section-title">${t}</h2>
    ${s?a`<p class="lead mt-3">${s}</p>`:""}
  </div>`}function E(e,t,s){return a`<section class="border-b border-line bg-white">
    <div class="wrap py-12 sm:py-16">
      <p class="eyebrow">${e}</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">${t}</h1>
      ${s?a`<p class="lead mt-4 max-w-2xl">${s}</p>`:""}
    </div>
  </section>`}function _(e,t="text-muted leading-relaxed"){return a`${e.split(/\n{2,}/).map(s=>s.trim()).filter(Boolean).map(s=>a`<p class="${t}">${s}</p>`)}`}function Z(e,t="h-5 w-5"){return e.icon_image?a`<img src="${e.icon_image}" alt="${e.icon_alt}" class="${t} object-contain" loading="lazy" decoding="async">`:n(e.icon,t)}function Y(e,t=3){let s=e.features.slice(0,t);return a`<article class="card card-hover flex flex-col p-6">
    <span class="icon-tile">${Z(e)}</span>
    <h3 class="mt-5 text-lg font-semibold">${e.title}</h3>
    <p class="mt-2 text-sm leading-relaxed text-muted">${e.description}</p>
    ${s.length?a`<ul class="check-list mt-4 space-y-2">${s.map(i=>a`<li>${n("check")}<span>${i}</span></li>`)}</ul>`:""}
  </article>`}function K(e,t){return a`<article id="service-${e.id}" class="card scroll-mt-24 overflow-hidden">
    <div class="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <span class="icon-tile h-12 w-12">${Z(e,"h-6 w-6")}</span>
        <p class="eyebrow mt-5">${String(t+1).padStart(2,"0")}</p>
        <h2 class="mt-1 text-2xl font-bold">${e.title}</h2>
        <p class="mt-3 leading-relaxed text-muted">${e.description}</p>
      </div>
      ${e.features.length?a`<ul class="check-list grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            ${e.features.map(s=>a`<li class="rounded-xl bg-canvas p-3.5">${n("check")}<span>${s}</span></li>`)}
          </ul>`:""}
    </div>
  </article>`}function j(e){let t=e.thumbnail?a`<img src="${e.thumbnail}" alt="${e.thumbnail_alt||e.title}" width="640" height="400"
        class="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" loading="lazy" decoding="async">`:a`<div class="flex h-full w-full items-center justify-center bg-ink text-accent">${n("layers","h-10 w-10 opacity-80")}</div>`;return a`<article class="card card-hover group relative flex flex-col overflow-hidden">
    <a href="/portfolio/${e.slug}/" class="block aspect-[16/10] overflow-hidden bg-mist" tabindex="-1" aria-hidden="true">${t}</a>
    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <span class="chip-soft">${e.category_label}</span>
        ${e.period?a`<span class="text-xs text-muted">${e.period}</span>`:""}
      </div>
      <h3 class="mt-3 text-lg font-semibold leading-snug">
        <a href="/portfolio/${e.slug}/" class="after:absolute after:inset-0 hover:underline">${e.title}</a>
      </h3>
      <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">${e.summary}</p>
      ${e.technologies.length?a`<ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            ${e.technologies.slice(0,4).map(s=>a`<li class="chip">${s}</li>`)}
            ${e.technologies.length>4?a`<li class="chip text-muted">+${e.technologies.length-4}</li>`:""}
          </ul>`:""}
      <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">Read case study ${n("arrowRight","h-4 w-4")}</span>
    </div>
  </article>`}function X(e){return a`<section class="card p-5 sm:p-6" aria-labelledby="skills-${e.slug}">
    <div class="flex items-center gap-3">
      <span class="icon-tile h-10 w-10">${n(e.icon||"sparkle","h-5 w-5")}</span>
      <h3 id="skills-${e.slug}" class="text-base font-semibold">${e.name}</h3>
    </div>
    ${e.description?a`<p class="mt-3 text-sm text-muted">${e.description}</p>`:""}
    <ul class="mt-4 flex flex-wrap gap-2">
      ${e.skills.map(t=>a`<li class="rounded-md border border-line bg-canvas px-2.5 py-1.5 text-[13px] font-medium" title="${t.description}">${t.name}</li>`)}
    </ul>
  </section>`}function Q(e){return a`<ol class="relative space-y-6 border-l-2 border-line pl-6 sm:pl-8">
    ${e.map(t=>{let s=t.is_current?"Present":H(t.end_date);return a`<li class="relative">
        <span class="absolute -left-[calc(1.5rem+7px)] top-1.5 h-3 w-3 rounded-full border-2 border-ink bg-accent sm:-left-[calc(2rem+7px)]"></span>
        <div class="card p-5 sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div>
              <h3 class="text-lg font-semibold">${t.job_title}</h3>
              <p class="text-sm font-medium text-muted">${t.organization}${t.arrangement?` \xB7 ${t.arrangement}`:""}</p>
            </div>
            <p class="chip-soft">${H(t.start_date)} – ${s}</p>
          </div>
          ${t.description?a`<p class="mt-3 text-sm leading-relaxed text-muted">${t.description}</p>`:""}
          ${t.responsibilities.length?a`<ul class="check-list mt-4 space-y-2">${t.responsibilities.map(i=>a`<li>${n("check")}<span>${i}</span></li>`)}</ul>`:""}
        </div>
      </li>`})}
  </ol>`}function be(e){if(e.status==="in_progress")return"Currently pursuing";let t=H(e.date);return e.status==="expected"?`Expected ${t}`:t?`Completed ${t}`:"Completed"}function ee(e){let t=e.certificate_file;return a`<article class="card flex gap-4 p-5">
    <span class="icon-tile">${n(e.kind==="degree"?"book":e.kind==="development"?"users":"award")}</span>
    <div class="min-w-0">
      <h3 class="text-base font-semibold leading-snug">${e.qualification}</h3>
      <p class="text-sm text-muted">${e.institution}</p>
      <p class="mt-2"><span class="chip-soft">${be(e)}</span></p>
      ${e.description?a`<p class="mt-3 text-sm text-muted">${e.description}</p>`:""}
      ${t?a`<a class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline" href="${m(e.certificate_file)}" target="_blank" rel="noopener noreferrer">View certificate ${n("external","h-4 w-4")}<span class="sr-only"> (opens in a new tab)</span></a>`:""}
    </div>
  </article>`}function te(e){return a`<figure class="card flex h-full flex-col p-6">
    <blockquote class="flex-1 text-base leading-relaxed">“${e.text}”</blockquote>
    <figcaption class="mt-5 flex items-center gap-3">
      ${e.image?a`<img src="${e.image}" alt="${e.image_alt||e.name}" class="h-11 w-11 rounded-full object-cover" loading="lazy" decoding="async" width="44" height="44">`:""}
      <div>
        <p class="text-sm font-semibold">${e.name}</p>
        <p class="text-xs text-muted">${[e.role,e.organization].filter(Boolean).join(", ")}</p>
      </div>
    </figcaption>
  </figure>`}function $(e,t,s,i=""){return a`<li class="flex items-start gap-4 p-4 sm:p-5">
    <span class="icon-tile h-10 w-10">${n(e,"h-5 w-5")}</span>
    <div class="min-w-0">
      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">${t}</p>
      <div class="mt-0.5 break-words text-base font-medium">${s}</div>
      ${i?a`<p class="mt-0.5 text-xs text-muted">${i}</p>`:""}
    </div>
  </li>`}var R=e=>e.replace(/^https?:\/\/(www\.)?/,"").replace(/\/$/,"");function ae(e,t){let s=(o,d)=>a`<a class="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="${m(o)}" target="_blank" rel="noopener noreferrer">${d}<span class="sr-only"> (opens in a new tab)</span></a>`,i=[$("user","Name",a`${e.full_name}`)];e.location&&i.push($("mapPin","Location",a`${e.location}`));let r=[e.phone_primary,e.phone_secondary].filter(Boolean);return r.length&&i.push($("phone",r.length>1?"Phone numbers":"Phone",a`${r.map((o,d)=>a`${d?" / ":""}<a class="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="${W(o)}">${o}</a>`)}`)),e.email&&i.push($("mail","Email",a`<a class="underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="mailto:${e.email}">${e.email}</a>`)),e.linkedin_url&&i.push($("linkedin","LinkedIn",s(e.linkedin_url,R(e.linkedin_url)))),e.github_url&&i.push($("github","GitHub",s(e.github_url,R(e.github_url)))),t.forEach(o=>i.push($(o.icon||"link",o.label,s(o.url,R(o.url))))),a`<ul class="card divide-y divide-line overflow-hidden">${i}</ul>`}var we=".card, figure, article, section h2, .eyebrow, ol > li, .check-list li";function se(e){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver"in window))return;let t=new IntersectionObserver(r=>{r.forEach(o=>{if(o.isIntersecting){let d=o.target;d.classList.add("in-view"),t.unobserve(d),window.setTimeout(()=>{d.classList.remove("anim","in-view"),d.style.removeProperty("--d")},1300)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"}),s=new WeakSet,i=()=>{e.querySelectorAll(we).forEach(r=>{if(s.has(r)||r.closest(".reveal, [role='status']")||r.classList.contains("hero-photo"))return;s.add(r);let o=Array.from(r.parentElement?.children??[]).indexOf(r);r.style.setProperty("--d",`${Math.min(o,5)*70}ms`),r.classList.add("anim"),t.observe(r)})};i(),new MutationObserver(i).observe(e,{childList:!0,subtree:!0})}function ie(){let e=document.querySelector("header");if(!e)return;let t=()=>e.classList.toggle("scrolled",window.scrollY>8);t(),window.addEventListener("scroll",t,{passive:!0})}var v=class extends Error{constructor(s,i,r={}){super(i);this.status=s;this.errors=r}};function ye(e){let t=document.cookie.split("; ").find(s=>s.startsWith(e+"="));return t?decodeURIComponent(t.split("=")[1]):""}async function $e(e){if(e.status===204)return null;let t=await e.text();try{return t?JSON.parse(t):null}catch{return null}}async function T(e,t,s){let i={Accept:"application/json"},r;s instanceof FormData?r=s:s!==void 0&&(i["Content-Type"]="application/json",r=JSON.stringify(s)),e!=="GET"&&(i["X-CSRFToken"]=ye("csrftoken"));let o;try{o=await fetch(t,{method:e,headers:i,body:r,credentials:"same-origin"})}catch{throw new v(0,"Could not reach the server. Check your connection and try again.")}let d=await $e(o);if(!o.ok){let w=d&&d.detail||`Request failed (${o.status}).`;throw new v(o.status,w,d&&d.errors||{})}return d}var V={get:e=>T("GET",e),post:(e,t)=>T("POST",e,t),put:(e,t)=>T("PUT",e,t),patch:(e,t)=>T("PATCH",e,t),delete:e=>T("DELETE",e)};var F=new Map;function h(e){let t=F.get(e);return t||(t=V.get(e),F.set(e,t),t.catch(()=>F.delete(e))),t}var b=()=>h("/api/public/site/"),C=()=>h("/api/public/services/"),re=()=>h("/api/public/skills/"),A=()=>h("/api/public/experience/"),q=()=>h("/api/public/education/"),ne=()=>h("/api/public/testimonials/"),oe=()=>h("/api/public/projects/facets/"),le=()=>h("/api/public/projects/?featured=true"),ce=e=>h(`/api/public/projects/${encodeURIComponent(e)}/`),de=e=>V.get(`/api/public/projects/?${e.toString()}`);function k(e){return e instanceof v?e.message:"We couldn't load this content. Please try again in a moment."}async function p(e,t){try{l(e,await t())}catch(s){l(e,f(k(s))),e.querySelector("[data-retry]")?.addEventListener("click",()=>void p(e,t))}}function ke(e){let t=[{icon:"briefcase",title:"How I support executives",text:e.about_executive_support},{icon:"message",title:"Organization & communication",text:e.about_strengths},{icon:"shield",title:"AI verification & responsible data handling",text:e.about_ai_responsibility},{icon:"code",title:"Technical background as a supporting advantage",text:e.about_technical}].filter(s=>s.text.trim());return t.length?a`<section class="border-y border-line bg-white"><div class="wrap section">
    ${x("My approach","How I work")}
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      ${t.map(s=>a`<article class="card p-6">
        <span class="icon-tile">${n(s.icon)}</span>
        <h3 class="mt-4 text-lg font-semibold">${s.title}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">${s.text}</p>
      </article>`)}
    </div>
  </div></section>`:a``}async function pe(e){let{profile:t}=await b(),s=t.photo?a`<img src="${t.photo}" alt="${t.photo_alt}" width="480" height="600" loading="eager" decoding="async"
        class="aspect-[4/5] w-full rounded-3xl object-cover object-[46%_22%] shadow-lift">`:"";l(e,a`<section class="border-b border-line bg-white">
        <div class="wrap grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div class="mx-auto w-full max-w-xs lg:max-w-none">${s}</div>
          <div class="reveal">
            <p class="eyebrow">About me</p>
            <h1 class="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-5xl">${t.full_name}</h1>
            <p class="mt-2 text-lg font-medium text-muted">${t.professional_title}</p>
            <div class="mt-6 max-w-2xl space-y-4">${t.long_bio?_(t.long_bio):_(t.short_bio)}</div>
            <div class="mt-8 flex flex-wrap gap-3">
              ${t.cv_file?a`<a href="${m(t.cv_file)}" class="btn-primary" target="_blank" rel="noopener noreferrer" download>${n("download","h-4 w-4")} Download my CV<span class="sr-only"> (PDF, opens in a new tab)</span></a>`:""}
              <a href="/contact/" class="btn-secondary">Get in touch</a>
            </div>
          </div>
        </div>
      </section>
      ${ke(t)}
      <section class="wrap section" aria-labelledby="skills-title">
        ${x("Skills overview","What I bring","Skills grouped by the kind of support they provide.")}
        <div id="about-skills" class="mt-8">${g(3,"h-40")}</div>
      </section>
      <div id="about-experience"></div>
      <section class="wrap section pt-0" aria-labelledby="education-title">
        ${x("Education","Education, certifications & development")}
        <div id="about-education" class="mt-8">${g(3,"h-36")}</div>
      </section>`);let i=r=>e.querySelector(`#${r}`);p(i("about-skills"),async()=>{let r=await re();return r.length?a`<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${r.map(X)}</div>`:u("Skills coming soon","My skills overview is being updated.")}),p(i("about-experience"),async()=>{let r=await A();return r.length?a`<section class="border-y border-line bg-white"><div class="wrap section">
      ${x("Experience","Where I\u2019m working")}
      <div class="mt-8 max-w-3xl">${Q(r)}</div>
    </div></section>`:a``}),p(i("about-education"),async()=>{let r=await q();if(!r.length)return u("Nothing to show yet","Education details will appear here.");let o=(d,w)=>{let M=r.filter(P=>w.includes(P.kind));return M.length?a`<div><h3 class="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted">${d}</h3>
            <div class="grid gap-4 md:grid-cols-2">${M.map(ee)}</div></div>`:a``};return a`<div class="space-y-8">
      ${o("Education & certifications",["degree","certification"])}
      ${o("Professional development",["development"])}
    </div>`})}async function me(e){let{profile:t,links:s}=await b();l(e,a`${E("Contact","Let\u2019s Work Together","I\u2019d be glad to discuss virtual assistance, administrative support and AI operations for you or your team. Reach out using any of the details below.")}
      <section class="wrap section">
        <div class="grid items-start gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          ${ae(t,s)}
          <aside class="space-y-5">
            <div class="on-dark rounded-2xl bg-ink p-6 text-white">
              <h2 class="text-lg font-semibold !text-white">How to reach me</h2>
              <p class="mt-2 text-sm leading-relaxed text-white/75">Email or call with a short description of what you need support with. I’ll reply to discuss next steps.</p>
              ${t.availability_statement?a`<p class="mt-4 rounded-lg bg-white/10 p-3 text-sm text-accent">${t.availability_statement}</p>`:""}
              ${t.email?a`<a class="btn-primary mt-5 w-full" href="mailto:${t.email}">${n("mail","h-4 w-4")} Send an email</a>`:""}
            </div>
            ${t.cv_file?a`<a href="${m(t.cv_file)}" target="_blank" rel="noopener noreferrer" download class="card card-hover flex items-center gap-4 p-5">
                  <span class="icon-tile">${n("file")}</span>
                  <span><span class="block text-sm font-semibold">Download my CV</span><span class="text-xs text-muted">PDF</span></span>
                </a>`:""}
          </aside>
        </div>
      </section>`)}function Me(e,t){let s=t.photo?a`<img src="${t.photo}" alt="${t.photo_alt}" width="640" height="800" fetchpriority="high" decoding="async"
        class="hero-photo relative aspect-[4/5] w-full rounded-3xl object-cover object-[46%_22%] shadow-lift">`:a`<div class="relative flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-ink text-6xl font-bold text-accent shadow-lift" role="img" aria-label="${t.full_name}">${e.monogram}</div>`;return a`<section class="wrap pb-14 pt-10 sm:pb-20 sm:pt-16">
    <div class="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div class="reveal">
        <h1 class="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.35rem]">${e.hero_heading}</h1>
        <p class="lead mt-5 max-w-xl">${e.hero_statement}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/contact/" class="btn-primary">${e.hero_primary_cta_label} ${n("arrowRight","h-4 w-4")}</a>
          <a href="/services/" class="btn-secondary">${e.hero_secondary_cta_label}</a>
        </div>
        ${e.hero_highlights.length?a`<ul class="check-list mt-9 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
              ${e.hero_highlights.map(i=>a`<li>${n("check")}<span>${i}</span></li>`)}
            </ul>`:""}
      </div>
      <div class="reveal mx-auto w-full max-w-sm lg:max-w-none">
        <div class="relative mb-3 mr-3 sm:mb-4 sm:mr-4">
          <div class="hero-blob absolute left-3 top-3 h-full w-full rounded-3xl bg-accent/70 sm:left-4 sm:top-4" aria-hidden="true"></div>
          ${s}
          <div class="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur sm:inset-x-4 sm:bottom-4">
            <p class="text-sm font-semibold">${t.full_name}</p>
            <p class="text-xs text-muted">${t.location||t.professional_title}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`}function Se(e,t){let s=e.find(r=>r.is_current)||e[0],i=[];return s&&i.push({icon:"briefcase",title:`${s.is_current?"Currently":"Previously"}: ${s.job_title}`,text:`${s.organization}${s.arrangement?` \xB7 ${s.arrangement}`:""}`}),t.slice(0,3).forEach(r=>i.push({icon:r.kind==="degree"?"book":"award",title:r.qualification,text:r.institution})),i.length?a`<section class="border-y border-line bg-white">
    <div class="wrap section">
      ${x("Professional highlights","Training and experience behind the work")}
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${i.map(r=>a`<li class="flex gap-4 rounded-2xl bg-canvas p-5">
          <span class="icon-tile">${n(r.icon)}</span>
          <div><p class="text-sm font-semibold leading-snug">${r.title}</p><p class="mt-1 text-sm text-muted">${r.text}</p></div>
        </li>`)}
      </ul>
      <p class="mt-6"><a href="/about/" class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">More about me ${n("arrowRight","h-4 w-4")}</a></p>
    </div>
  </section>`:a``}async function ue(e){let{site:t,profile:s}=await b();l(e,a`${Me(t,s)}
      <section class="wrap section pt-0 sm:pt-4" aria-labelledby="services-title">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="max-w-2xl">
            <p class="eyebrow">Services</p>
            <h2 id="services-title" class="section-title">How I can help</h2>
          </div>
          <a href="/services/" class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">All services ${n("arrowRight","h-4 w-4")}</a>
        </div>
        <div id="home-services" class="mt-8">${g(4,"h-64")}</div>
      </section>
      <div id="home-credentials"></div>
      <section class="wrap section" aria-labelledby="projects-title">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="max-w-2xl">
            <p class="eyebrow">Selected work</p>
            <h2 id="projects-title" class="section-title">Projects that show how I work</h2>
            <p class="lead mt-3">Technical projects are supporting evidence of my problem-solving and digital systems knowledge.</p>
          </div>
          <a href="/portfolio/" class="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">Full portfolio ${n("arrowRight","h-4 w-4")}</a>
        </div>
        <div id="home-projects" class="mt-8">${g(3)}</div>
      </section>
      <div id="home-testimonials"></div>
      <section class="wrap pb-16 sm:pb-24">
        <div class="on-dark relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-2xl" aria-hidden="true"></div>
          <h2 class="relative mx-auto max-w-2xl text-3xl font-bold !text-white sm:text-4xl">${t.closing_heading}</h2>
          <p class="relative mx-auto mt-4 max-w-xl text-white/75">${t.closing_text}</p>
          <div class="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href="/contact/" class="btn-primary">${t.nav_cta_label} ${n("arrowRight","h-4 w-4")}</a>
            ${s.email?a`<a href="mailto:${s.email}" class="btn-ghost-light">${n("mail","h-4 w-4")} ${s.email}</a>`:""}
          </div>
          ${s.availability_statement?a`<p class="relative mt-6 text-sm text-white/60">${s.availability_statement}</p>`:""}
        </div>
      </section>`);let i=r=>e.querySelector(`#${r}`);p(i("home-services"),async()=>{let r=await C();return r.length?a`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">${r.map(o=>Y(o,3))}</div>`:u("Services coming soon","My service list is being updated. Please check back shortly.")}),p(i("home-projects"),async()=>{let r=(await le()).slice(0,3);return r.length?a`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${r.map(j)}</div>`:u("Projects coming soon","Case studies will appear here once they are published.")}),p(i("home-credentials"),async()=>{let[r,o]=await Promise.all([A(),q()]);return Se(r,o)}),p(i("home-testimonials"),async()=>{let r=await ne();return r.length?a`<section class="border-y border-line bg-white"><div class="wrap section">
      ${x("Kind words","What people say")}
      <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">${r.slice(0,3).map(te)}</div>
    </div></section>`:a``})}function Ee(){let e=new URLSearchParams(window.location.search);return{q:e.get("q")||"",category:e.get("category")||"",tag:e.get("tag")||""}}function _e(e){let t=new URLSearchParams;e.q&&t.set("q",e.q),e.category&&t.set("category",e.category),e.tag&&t.set("tag",e.tag);let s=t.toString();history.replaceState(null,"",window.location.pathname+(s?`?${s}`:""))}async function he(e){let t=Ee();l(e,a`${E("Portfolio & case studies","Projects and experience","Each case study covers the need, my role, the work completed, the tools used and what I learned. Technical projects are included as supporting evidence of my problem-solving and digital systems knowledge.")}
      <section class="wrap section pt-10">
        <div id="portfolio-filters" class="space-y-4"></div>
        <p id="portfolio-count" class="mt-6 text-sm text-muted" role="status" aria-live="polite"></p>
        <div id="portfolio-results" class="mt-4">${g(3)}</div>
      </section>`);let s=e.querySelector("#portfolio-filters"),i=e.querySelector("#portfolio-results"),r=e.querySelector("#portfolio-count"),o={categories:[],tags:[]};try{o=await oe()}catch{}let d=()=>{l(s,a`<div class="relative max-w-xl">
          <label for="project-search" class="sr-only">Search projects</label>
          <span class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">${n("search","h-4 w-4")}</span>
          <input id="project-search" type="search" class="input !pl-10" placeholder="Search by title, technology or tag…" value="${t.q}" autocomplete="off">
        </div>
        ${o.categories.length?a`<div class="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              <button type="button" class="filter-pill" data-category="" aria-pressed="${t.category===""}">All</button>
              ${o.categories.map(c=>a`<button type="button" class="filter-pill" data-category="${c.value}" aria-pressed="${t.category===c.value}">${c.label} <span class="text-xs opacity-60">${c.count}</span></button>`)}
            </div>`:""}
        ${o.tags.length?a`<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tags</span>
              ${o.tags.map(c=>a`<button type="button" class="filter-pill !py-1 !text-xs" data-tag="${c.slug}" aria-pressed="${t.tag===c.slug}">${c.name}</button>`)}
            </div>`:""}`);let y=s.querySelector("#project-search");y.addEventListener("input",G(()=>{t.q=y.value.trim(),P(!1)},250)),s.querySelectorAll("[data-category]").forEach(c=>c.addEventListener("click",()=>{t.category=c.dataset.category||"",P(!0)})),s.querySelectorAll("[data-tag]").forEach(c=>c.addEventListener("click",()=>{t.tag=t.tag===c.dataset.tag?"":c.dataset.tag||"",P(!0)}))},w=0,M=async()=>{let y=++w,c=new URLSearchParams;t.q&&c.set("search",t.q),t.category&&c.set("category",t.category),t.tag&&c.set("tag",t.tag);try{let S=await de(c);if(y!==w)return;let N=!!(t.q||t.category||t.tag);r.textContent=`${S.length} ${S.length===1?"project":"projects"}`,l(i,S.length?a`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${S.map(j)}</div>`:u(N?"No projects match these filters":"No projects published yet",N?"Try a different search term or clear the filters.":"Case studies will appear here once they are published."))}catch(S){if(y!==w)return;r.textContent="",l(i,f(k(S))),i.querySelector("[data-retry]")?.addEventListener("click",()=>void M())}};function P(y){_e(t),y&&d(),M()}d(),await M()}function Pe(e,t,s){return s?a`<section class="card p-6 sm:p-8" aria-labelledby="cs-${e}">
    <div class="flex items-center gap-3">
      <span class="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-accent">${e}</span>
      <h2 id="cs-${e}" class="text-xl font-bold">${t}</h2>
    </div>
    <div class="mt-4 space-y-3">${s}</div>
  </section>`:a``}var B=e=>e.length?a`<ul class="check-list space-y-2.5">${e.map(t=>a`<li>${n("check")}<span>${t}</span></li>`)}</ul>`:null,O=e=>e.trim()?_(e):null;function Le(e){let t=[["Project or experience overview",O(e.overview)],["Problem or need addressed",O(e.problem)],["My role and responsibilities",e.role_description.trim()||e.responsibilities.length?a`${e.role_description?_(e.role_description):""}${B(e.responsibilities)||""}`:null],["Work completed",B(e.work_completed)],["Tools and technologies used",e.technologies.length?a`<ul class="flex flex-wrap gap-2">${e.technologies.map(i=>a`<li class="chip">${i}</li>`)}</ul>`:null],["Challenges and lessons learned",O(e.challenges_lessons)],["Verified outcomes",e.outcomes.length?a`${B(e.outcomes)}${e.outcomes_evidence?a`<p class="text-sm text-muted"><span class="font-semibold text-ink">Evidence:</span> ${e.outcomes_evidence}</p>`:""}`:null]],s=0;return a`${t.map(([i,r])=>r?Pe(++s,i,r):a``)}`}function Te(e){let t=[e.organization,e.period,e.role_title].filter(Boolean);return a`<section class="border-b border-line bg-white">
      <div class="wrap py-10 sm:py-14">
        <a href="/portfolio/" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">${n("arrowLeft","h-4 w-4")} All projects</a>
        <div class="mt-5 flex flex-wrap items-center gap-2">
          <span class="chip-soft">${e.category_label}</span>
          ${e.tags.map(s=>a`<span class="chip">${s}</span>`)}
        </div>
        <h1 class="mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">${e.title}</h1>
        <p class="lead mt-4 max-w-2xl">${e.summary}</p>
        ${t.length?a`<p class="mt-4 text-sm font-medium text-muted">${t.join(" \xB7 ")}</p>`:""}
        <div class="mt-6 flex flex-wrap gap-3">
          ${e.live_url?a`<a class="btn-primary" href="${m(e.live_url)}" target="_blank" rel="noopener noreferrer">${n("external","h-4 w-4")} View live project<span class="sr-only"> (opens in a new tab)</span></a>`:""}
          ${e.source_url?a`<a class="btn-secondary" href="${m(e.source_url)}" target="_blank" rel="noopener noreferrer">${n("github","h-4 w-4")} Source code<span class="sr-only"> (opens in a new tab)</span></a>`:""}
        </div>
      </div>
    </section>
    <section class="wrap section pt-10">
      <div class="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div class="space-y-6">${Le(e)}</div>
        <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
          ${e.thumbnail?a`<img src="${e.thumbnail}" alt="${e.thumbnail_alt||e.title}" class="w-full rounded-2xl border border-line object-cover shadow-card" loading="lazy" decoding="async">`:""}
          <div class="card p-5">
            <p class="text-sm font-semibold">Interested in working together?</p>
            <p class="mt-1 text-sm text-muted">Let’s talk about how I can support you.</p>
            <a href="/contact/" class="btn-primary mt-4 w-full">Get in touch</a>
          </div>
        </aside>
      </div>
      ${e.images.length?a`<div class="mt-10"><h2 class="text-xl font-bold">Gallery</h2>
            <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              ${e.images.map(s=>a`<li><figure>
                <img src="${s.image}" alt="${s.alt_text||e.title}" class="aspect-[16/10] w-full rounded-xl border border-line object-cover" loading="lazy" decoding="async">
                ${s.caption?a`<figcaption class="mt-2 text-xs text-muted">${s.caption}</figcaption>`:""}
              </figure></li>`)}
            </ul></div>`:""}
    </section>`}async function U(e){let t=e.dataset.slug||"";try{l(e,Te(await ce(t)))}catch(s){if(s instanceof v&&s.status===404){l(e,a`<section class="wrap section text-center"><h1 class="text-3xl font-bold">Project not found</h1>
        <p class="lead mt-3">It may have been unpublished.</p><a href="/portfolio/" class="btn-primary mt-6">Back to portfolio</a></section>`);return}l(e,a`<section class="wrap section">${f(k(s))}</section>`),e.querySelector("[data-retry]")?.addEventListener("click",()=>void U(e))}}async function ge(e){let{profile:t,site:s}=await b();l(e,a`${E("Services","Support that keeps work moving","Executive assistance, administrative operations, careful AI use and technical help, each backed by my CV and training.")}
      <section class="wrap section"><div id="services-list" class="space-y-6">
        <div class="skeleton h-64"></div><div class="skeleton h-64"></div>
      </div></section>
      <section class="wrap pb-16 sm:pb-24">
        <div class="card flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 class="text-xl font-bold">Not sure which service fits?</h2>
            <p class="mt-1 text-sm text-muted">Tell me what is taking up your time and we can work out the right support.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="/contact/" class="btn-primary">${s.nav_cta_label} ${n("arrowRight","h-4 w-4")}</a>
            ${t.email?a`<a href="mailto:${t.email}" class="btn-secondary">${n("mail","h-4 w-4")} Email me</a>`:""}
          </div>
        </div>
      </section>`),p(e.querySelector("#services-list"),async()=>{let i=await C();return i.length?a`${i.map(K)}`:u("Services coming soon","My service list is being updated. Please check back shortly.")})}var fe={home:ue,about:pe,services:ge,portfolio:he,project:U,contact:me};function He(){let e=document.getElementById("menu-toggle"),t=document.getElementById("mobile-menu");if(!e||!t)return;let s=i=>{t.classList.toggle("hidden",!i),e.setAttribute("aria-expanded",String(i)),e.setAttribute("aria-label",i?"Close menu":"Open menu")};e.addEventListener("click",()=>s(t.classList.contains("hidden"))),document.addEventListener("keydown",i=>{i.key==="Escape"&&s(!1)}),window.matchMedia("(min-width: 768px)").addEventListener("change",i=>i.matches&&s(!1))}async function je(){He(),ie();let e=document.getElementById("main"),t=e?.dataset.page;if(!e||!t||!fe[t])return;let s=async()=>{try{await fe[t](e)}catch(i){l(e,a`<section class="wrap section">${f(k(i))}</section>`),e.querySelector("[data-retry]")?.addEventListener("click",()=>void s())}};se(e),await s()}je();})();
