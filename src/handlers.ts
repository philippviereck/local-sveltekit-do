import { DurableObject } from "cloudflare:workers";

export class MyDurableObjectLocal extends DurableObject {

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);
    }

    async sayHello() {
        return "Hello, World! RPC";
    }

    // async fetch(request: Request) {
    //     return new Response("Hello, World! Fetch");
    // }
}

export default {
    // async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //     console.log("Scheduled trigger!");
    // },
    // additional handlers go here
}