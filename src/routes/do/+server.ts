import { error } from '@sveltejs/kit';

export const GET = async ({ platform }) => {

    if (!platform) {
        return error(500, "Platform object undefined");
    }

    console.log(platform.env);

    if (!platform.env.MY_DURABLE_OBJECT) {
        return error(500, "Durable Object namespace not found");
    }

    const id = platform.env.MY_DURABLE_OBJECT.idFromName("foo");
    const stub = platform.env.MY_DURABLE_OBJECT.get(id);

    const response = await stub.fetch("https://foo.bar"); //FIXME: This is not working - see: https://github.com/cloudflare/workers-sdk/pull/7292
    const text = await response.text();

    return new Response(text);
};
