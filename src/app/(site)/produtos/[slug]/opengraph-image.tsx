import { ImageResponse } from "next/og";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const alt = "Luperfumes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ProductOg = {
  name: string;
  price_cents: number;
  product_images: { url: string; position: number }[] | null;
};

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("name, price_cents, product_images(url, position)")
    .eq("slug", params.slug)
    .eq("status", "active")
    .single<ProductOg>();

  const cover = data?.product_images
    ? [...data.product_images].sort((a, b) => a.position - b.position)[0]?.url
    : undefined;

  const name = data?.name ?? "Luperfumes";
  const price = data?.price_cents
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        data.price_cents / 100
      )
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#f5ecdc",
          color: "#2d2924",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#faf4e9",
          }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              width={520}
              height={520}
              style={{ objectFit: "cover", borderRadius: 24 }}
            />
          ) : (
            <div
              style={{
                width: 520,
                height: 520,
                borderRadius: 24,
                backgroundColor: "#efa89c",
              }}
            />
          )}
        </div>
        <div
          style={{
            width: "50%",
            padding: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: 6,
              color: "#87b1a4",
              marginBottom: 16,
            }}
          >
            Luperfumes
          </div>
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.1,
              color: "#2d2924",
              marginBottom: 28,
              display: "flex",
            }}
          >
            {name}
          </div>
          {price && (
            <div style={{ fontSize: 64, color: "#e48b7d", display: "flex" }}>
              {price}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
