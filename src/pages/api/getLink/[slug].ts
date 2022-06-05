import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";
import { withSentry } from "@sentry/nextjs";

type Data = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  fullLink: string;
};

type Error = {
  message: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const slug = req.query.slug;

  if (typeof slug !== "string") {
    res.status(400).json({ message: "only one slug allowed" });
    return;
  }

  const data = await prisma.link.findUnique({ where: { slug } });

  if (!data) {
    res.status(404).json({ message: "not found" });
    return;
  }

  res.status(200).json(data);
}

export default withSentry(handler);
