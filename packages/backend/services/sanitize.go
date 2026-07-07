package services

import (
	"sync"

	"github.com/microcosm-cc/bluemonday"
)

// artikelPolicy dibangun sekali (lazy) dan dipakai ulang — pembuatan policy
// bluemonday relatif mahal, jadi jangan bikin per-request.
var (
	artikelPolicy     *bluemonday.Policy
	artikelPolicyOnce sync.Once
)

// buildArtikelPolicy mengizinkan hanya tag/atribut yang dihasilkan editor Tiptap
// (starter-kit + link). Selain itu (mis. <script>, on* handler, style) di-strip.
func buildArtikelPolicy() *bluemonday.Policy {
	p := bluemonday.NewPolicy()

	// Blok & teks dasar
	p.AllowElements(
		"p", "br", "span", "hr",
		"h1", "h2", "h3", "h4", "h5", "h6",
		"ul", "ol", "li",
		"blockquote", "pre", "code",
		"strong", "b", "em", "i", "u", "s", "del",
	)

	// Link: hanya href http/https/mailto, plus rel & target aman.
	p.AllowAttrs("href").OnElements("a")
	p.AllowStandardURLs()                  // batasi skema URL ke yang aman
	p.RequireNoFollowOnLinks(true)         // tambahkan rel="nofollow"
	p.AddTargetBlankToFullyQualifiedLinks(true)
	p.AllowAttrs("target").OnElements("a")

	return p
}

// SanitizeArtikelHTML membersihkan HTML konten artikel dari elemen/atribut
// berbahaya (mencegah stored XSS) sambil mempertahankan format Tiptap.
func SanitizeArtikelHTML(html string) string {
	artikelPolicyOnce.Do(func() {
		artikelPolicy = buildArtikelPolicy()
	})
	return artikelPolicy.Sanitize(html)
}
