// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/* An intermediatory server, that we can build an API service from. Example here
`hello.ts` function is created for us by Next.js. */
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
