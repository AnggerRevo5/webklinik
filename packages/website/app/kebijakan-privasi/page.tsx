import type { Metadata } from "next";
import KebijakanPrivasi from "@/src/components/kebijakan_privasi";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — KRI Ampelgading Medical Centre",
  description:
    "Penjelasan data yang dikumpulkan KRI Ampelgading Medical Centre dari pengunjung situs dan pasien, serta hak Anda sesuai UU PDP No. 27 Tahun 2022.",
};

export default function KebijakanPrivasiPage() {
  return <KebijakanPrivasi />;
}
