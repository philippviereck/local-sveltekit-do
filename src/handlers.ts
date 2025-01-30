import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
    constructor(state: DurableObjectState, env: Env) {
        super(state, env);
    }

    async fetch(request: Request) {
        return new Response("Hello SvelteKit from your co-located DurableObject!");
    }


    async sayHello() {
        return "Hello, World!";
    }
}

export default {

    // async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //     console.log("Scheduled trigger!");
    // },

}
