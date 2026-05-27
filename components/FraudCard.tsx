import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { FraudCase } from "@/lib/supabase";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

export default function FraudCard({ c }: { c: FraudCase }) {
  const isNew = Date.now() - new Date(c.created_at).getTime() < 86400000 * 3;

  return (
    <Link href={`/fraud/${c.slug}`} className="group block">
      <article className="border border-border hover:border-primary/40 transition-colors duration-200 overflow-hidden">
        {/* 썸네일 */}
        <div className="aspect-[16/9] bg-muted overflow-hidden relative">
          {c.thumbnail_url ? (
            <Image
              src={c.thumbnail_url}
              alt={c.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <span className="font-heading text-4xl text-primary/30">⚠</span>
            </div>
          )}
          {isNew && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-widest px-2 py-0.5 rounded-none">
              NEW
            </Badge>
          )}
        </div>

        {/* 내용 */}
        <div className="p-5">
          <h2 className="font-heading text-xl font-medium leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {c.title}
          </h2>
          <div className="divider-editorial mb-3" />
          <div className="flex items-center">
            <span className="label-editorial text-muted-foreground">{timeAgo(c.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
