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

    // Error: Cannot access `MyDurableObject#sayHello` as Durable Object RPC is not yet supported between multiple `wrangler dev` sessions.
    // const text = await stub.sayHello();

    const response = await stub.fetch("https://foo.bar");
    const text = await response.text();

    return new Response(text);
};
