import EmergencyCta from "@/src/components/emergency_cta";
import Footer from "@/src/components/footer";

// Bungkus tipis EmergencyCta + Footer — dipakai di akhir SEMUA halaman publik
// supaya urutannya tidak pernah lupa/beda antar halaman (dulu ini masalahnya:
// beberapa halaman cuma panggil Footer tanpa EmergencyCta). Kedua komponen
// tetap terpisah & bisa dipakai sendiri-sendiri kalau suatu saat ada halaman
// yang butuh kombinasi berbeda.
export default function PageFooter() {
  return (
    <>
      <EmergencyCta />
      <Footer />
    </>
  );
}
