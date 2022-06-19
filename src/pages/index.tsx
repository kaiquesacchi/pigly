import type { NextPage } from "next";
import Image from "next/image";
import { FormEventHandler, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import createLink from "@/utils/createLink";
import { ConflictError, InputError, UnexpectedError } from "@/errors";

const Home: NextPage = () => {
  const fullLinkInputRef = useRef<HTMLInputElement>(null);
  const shortLinkInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();
      const error = await createLink(
        fullLinkInputRef.current?.value,
        shortLinkInputRef.current?.value
      );
      console.log({ error });
      if (error instanceof ConflictError) toast.info(error.message, {});
      else if (error instanceof InputError) toast.error(error.message, {});
      else if (error instanceof UnexpectedError) toast.error(error.message, {});
      else toast.success("Link created!");
      fullLinkInputRef.current!.value = "";
      shortLinkInputRef.current!.value = "";
    },
    [fullLinkInputRef, shortLinkInputRef]
  );

  return (
    <div className="background-green centralize-content full-screen">
      <div className="background-white" id="center-card">
        <div>
          <span id="title">Pigly</span>
          <span>Link Shortener</span>
        </div>
        <div>
          <form onSubmit={handleSubmit} id="form">
            <input
              id="full-link"
              type="text"
              placeholder="Original Link"
              className="text-input"
              ref={fullLinkInputRef}
            />
            <div id="short-link-area">
              <span>{process.env.NEXT_PUBLIC_URL}</span>
              <input
                id="short-link"
                type="text"
                placeholder="Short Link"
                className="text-input"
                ref={shortLinkInputRef}
              />
            </div>
            <button type="submit" id="submit-button">
              <Image
                src="/pig.png"
                alt="submit button"
                width="100"
                height="100"
                layout="fixed"
              />
              Submit
            </button>
          </form>
        </div>
      </div>
      <a
        href="https://www.flaticon.com/free-icons/pig"
        title="pig icons"
        id="attribution"
      >
        Pig icons created by Freepik - Flaticon
      </a>
    </div>
  );
};

export default Home;
