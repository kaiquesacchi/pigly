import constants from "@/constants";
import ConflictError from "@/errors/ConflictError";
import InputError from "@/errors/InputError";
import UnexpectedError from "@/errors/UnexpectedError";

export default async function createLink(
  fullLink?: string,
  slug?: string
): Promise<void | ConflictError | InputError | UnexpectedError> {
  console.log({ fullLink, slug });
  if (!fullLink) return new InputError("Please, provide the Original Link");
  if (!slug) return new InputError("Please, provide the Short Link");

  if (fullLink.length > constants.MAX_FULL_LINK_LENGTH)
    return new InputError(
      `The full link should have ${constants.MAX_FULL_LINK_LENGTH} at most`
    );
  if (slug.length > constants.MAX_SLUG_LENGTH)
    return new InputError(
      `The short link should have ${constants.MAX_SLUG_LENGTH} at most`
    );

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/createLink`,
      {
        headers: new Headers([["Content-Type", "application/json"]]),
        method: "POST",
        body: JSON.stringify({
          fullLink,
          slug,
        }),
      }
    );
    console.log({ response });
    if (response.ok) return;
    if (response.status === 409)
      return new ConflictError("This short link is already in use");
  } catch (error) {
    return new UnexpectedError("Please, try again later");
  }
}
