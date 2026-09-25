import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/admin-server";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, { t }] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    getDictionary(),
  ]);

  if (!post) notFound();

  return <EditPostForm t={t} post={post} />;
}
