import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
    /**
     * @param {any} state
     * @param {any} env
     */
    constructor(state, env) {
        super(state, env);
    }

    async sayHello() {
        return "Hello, World!";
    }
}

export default {
    /**
     * @param {any} event
     * @param {any} env
     * @param {any} ctx
     */
    async scheduled(event, env, ctx) {
        console.log("Scheduled trigger!");
    },
    // additional handlers go here
}