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
    <div className="min-h-screen w-screen bg-emerald-800 flex justify-center items-center">
      <div className="bg-white shadow-lg p-4 w-screen max-w-3xl flex flex-col">
        <div className="mb-4 border-b-slate-100 border-b-2 pb-3">
          <span className="text-5xl text-slate-700">Pigly</span>
          <span>Link Shortener</span>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              className="w-full bg-slate-100 p-3 hover:bg-slate-200"
              type="text"
              placeholder="Original Link"
              ref={fullLinkInputRef}
              required
            />
            <div className="flex items-center mt-3">
              <span>{process.env.NEXT_PUBLIC_URL?.split("://")[1]}</span>
              <input
                className="w-full bg-slate-100 p-3 hover:bg-slate-200"
                type="text"
                placeholder="Short Link"
                ref={shortLinkInputRef}
                required
              />
            </div>
            <button
              type="submit"
              className="flex flex-col py-3 px-6 self-center mt-3 items-center font-bold bg-slate-100 hover:bg-slate-200"
            >
              <Image
                src="/pig.png"
                alt="submit button"
                width="100"
                height="100"
                layout="fixed"
              />
              Create Link
            </button>
          </form>
        </div>
      </div>
      <a
        href="https://www.flaticon.com/free-icons/pig"
        title="pig icons"
        className="absolute right-1 bottom-1 text-slate-300"
      >
        Pig icons created by Freepik - Flaticon
      </a>
    </div>
  );
};

export default Home;
