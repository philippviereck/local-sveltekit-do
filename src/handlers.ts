import { DurableObject } from 'cloudflare:workers';
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

export class MyDurableObject extends DurableObject {
    value: number = 0
    app = new Hono()
        .get('/', async (c) => {
            return c.json({
                value: await this.getCounterValue()
            })
        })
        .get('/increment/:amount?', zValidator('param', z.object({
            amount: z.number({ coerce: true }).optional().default(1).catch(1)
        }).optional()), async (c) => {

            const amount = c.req.valid('param')?.amount || 1

            await this.increment(amount)
            return c.json({
                value: await this.getCounterValue()
            })
        })
        .get('/decrement/:amount?', zValidator('param', z.object({
            amount: z.number({ coerce: true }).optional().default(1).catch(1)
        }).optional()), async (c) => {

            const amount = c.req.valid('param')?.amount || 1

            await this.decrement(amount)
            return c.json({
                value: await this.getCounterValue()
            })
        })

    getApp() {
        return this.app
    }

    private async getCounterValue() {
        let value: number = (await this.ctx.storage.get("value")) || 0;
        return value;
    }

    private async increment(amount = 1) {
        let value: number = (await this.ctx.storage.get("value")) || 0;
        value += amount;
        // You do not have to worry about a concurrent request having modified the value in storage.
        // "input gates" will automatically protect against unwanted concurrency.
        // Read-modify-write is safe.
        await this.ctx.storage.put("value", value);
        return value;
    }

    private async decrement(amount = 1) {
        let value: number = (await this.ctx.storage.get("value")) || 0;
        value -= amount;
        await this.ctx.storage.put("value", value);
        return value;
    }

    async fetch(request: Request) {
        return this.app.fetch(request)
    }

}

export type MyDurableObjectApp = ReturnType<typeof MyDurableObject.prototype.getApp>

export default {

    // async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //     console.log("Scheduled trigger!");
    // },

}
