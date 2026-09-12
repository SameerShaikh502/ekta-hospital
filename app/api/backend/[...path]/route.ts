import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured." },
      { status: 500 }
    );
  }

  const upstreamUrl =
    `${backendUrl.replace(/\/$/, "")}/${path.join("/")}` +
    request.nextUrl.search;

  const headers = new Headers();

  // Forward content type
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  // IMPORTANT:
  // Forward browser cookies to ASP.NET
  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  // Forward accept header
  const accept = request.headers.get("accept");
  if (accept) {
    headers.set("accept", accept);
  }

  const method = request.method;

  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  try {
    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();

    // Forward content type
    const responseContentType =
      upstream.headers.get("content-type");

    if (responseContentType) {
      responseHeaders.set(
        "content-type",
        responseContentType
      );
    }

    // IMPORTANT:
    // Forward ASP.NET session/auth cookies back to browser
    const getSetCookie = (
      upstream.headers as Headers & {
        getSetCookie?: () => string[];
      }
    ).getSetCookie;

    let setCookies: string[] = [];

    if (getSetCookie) {
      setCookies = getSetCookie.call(upstream.headers);
    } else {
      const setCookie = upstream.headers.get("set-cookie");

      if (setCookie) {
        setCookies = [setCookie];
      }
    }

    for (const setCookie of setCookies) {
      // Remove backend Domain if it exists.
      // Browser is communicating with localhost:3000,
      // so the cookie should belong to the Next.js host.
      const fixedCookie = setCookie.replace(
        /;\s*Domain=[^;]+/gi,
        ""
      );

      responseHeaders.append(
        "set-cookie",
        fixedCookie
      );
    }

   const response = new NextResponse(upstream.body, {
  status: upstream.status,
  headers: responseHeaders,
});

if (path.join("/") === "logout") {
  response.cookies.set("ASP.NET_SessionId", "", {
    expires: new Date(0),
    path: "/",
  });
}

return response;
  } catch (error) {
    console.error(
      "ASP.NET backend proxy error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Could not connect to the existing ASP.NET backend.",
      },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;