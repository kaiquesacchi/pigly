// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import constants from "@/constants";
import prisma from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { withSentry } from "@sentry/nextjs";

type InputBody = {
  slug: string;
  fullLink: string;
};

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

/** Validates body format. Responds error to request if invalid */
function isBodyValid(body: any, response: NextApiResponse): body is InputBody {
  /* -------------------------------------- Validate `slug` ------------------------------------- */
  if (body.slug === undefined) {
    response.status(400).json({ message: "'slug' missing" });
    return false;
  }

  if (
    typeof body.slug !== "string" ||
    body.slug.length > constants.MAX_SLUG_LENGTH
  ) {
    response.status(400).json({
      message: `'slug' must be a string with ${constants.MAX_SLUG_LENGTH} at most`,
    });
    return false;
  }

  /* ------------------------------------ Validate `fullLink` ----------------------------------- */
  if (body.fullLink === undefined) {
    response.status(400).json({ message: "'fullLink' missing" });
    return false;
  }

  if (
    typeof body.fullLink !== "string" ||
    body.fullLink.length > constants.MAX_FULL_LINK_LENGTH
  ) {
    response.status(400).json({
      message: `'fullLink' must be a string with ${constants.MAX_FULL_LINK_LENGTH} at most`,
    });
    return false;
  }

  return true;
}

async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data | Error>
) {
  const { body } = request;
  if (!isBodyValid(body, response)) return;

  try {
    const result = await prisma?.link.create({
      data: {
        fullLink: body.fullLink,
        slug: body.slug,
      },
    });
    console.log(result);

    if (!result) {
      response.status(400).json({ message: "error" });
      return;
    }
    response.status(200).json(result);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          response.status(409).json({ message: "`slug` already in use" });
          return;
        default:
          throw error;
      }
    }
  }
}

export default withSentry(handler);
