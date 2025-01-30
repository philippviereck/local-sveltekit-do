import { hc } from 'hono/client'
import { error, json } from '@sveltejs/kit';
import type { MyDurableObjectApp } from '../../handlers';



export const GET = async ({ platform, url }) => {

    if (!platform) {
        return error(500, "Platform object undefined");
    }

    console.log(platform.env);

    if (!platform.env.MY_DURABLE_OBJECT) {
        return error(500, "Durable Object namespace not found");
    }

    const name = url.searchParams.get('name') || 'bar'
    const id = platform.env.MY_DURABLE_OBJECT.idFromName(name);
    const stub = platform.env.MY_DURABLE_OBJECT.get(id);

    // Error: Cannot access `MyDurableObject#sayHello` as Durable Object RPC is not yet supported between multiple `wrangler dev` sessions.
    // const text = await stub.sayHello();

    const client = hc<MyDurableObjectApp>('http://foo.bar', {
        fetch: stub.fetch.bind(stub)
    })

    const res = await client.index.$get()
    // const res = await stub.fetch("http://foo.bar");
    console.log(res);
    const jsonResponse = await res.json()

    return json(jsonResponse)

    const response = await stub.fetch("http://foo.bar");
    const text = await response.text();

    return new Response(text);
};
