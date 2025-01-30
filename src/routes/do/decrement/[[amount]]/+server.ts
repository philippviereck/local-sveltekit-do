import { hc } from 'hono/client'
import { error, json } from '@sveltejs/kit';
import type { MyDurableObjectApp } from '../../../../handlers';



export const GET = async ({ platform, params }) => {

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

    const client = hc<MyDurableObjectApp>('https://foo.bar', {
        fetch: stub.fetch
    })

    const res = await client.decrement[':amount?'].$get({
        param: {
            amount: params.amount
        }
    });
    console.log(res);
    const jsonResponse = await res.json()

    return json(jsonResponse)

    const response = await stub.fetch("https://foo.bar");
    const text = await response.text();

    return new Response(text);
};
