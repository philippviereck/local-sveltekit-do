import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'

//TODO: clean this up

export class MyDurableObject {
    value: number = 0
    ctx: DurableObjectState;
    app: Hono;

    constructor(ctx: DurableObjectState) {
        this.ctx = ctx
        this.ctx.blockConcurrencyWhile(async () => {
            const stored = await this.ctx.storage?.get<number>('value')
            this.value = stored || 0
        })

        this.app = this.buildRoutes()
    }

    buildRoutes() {
        return new Hono()
            .get('/', async (c) => {
                let value: number = (await this.ctx.storage.get("value")) || 0;

                return c.json({
                    value: value
                })
            }
            ).get('/increment/:amount?', zValidator('param', z.object({
                amount: z.number({ coerce: true }).optional().default(1).catch(1)
            }).optional()), async (c) => {

                const amount = c.req.valid('param')?.amount || 1
                let value: number = (await this.ctx.storage.get("value")) || 0;
                value += amount;
                await this.ctx.storage.put("value", value);
                return c.json({
                    value: value
                })
            })
            .get('/decrement/:amount?', zValidator('param', z.object({
                amount: z.number({ coerce: true }).optional().default(1).catch(1)
            }).optional()), async (c) => {

                const amount = c.req.valid('param')?.amount || 1

                let value: number = (await this.ctx.storage.get("value")) || 0;
                value -= amount;
                await this.ctx.storage.put("value", value);
                return c.json({
                    value: value
                })
            })

    }

    async fetch(request: Request) {
        return this.app.fetch(request)
    }

}

export type MyDurableObjectApp = ReturnType<typeof MyDurableObject.prototype.buildRoutes>

export default {

    // async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    //     console.log("Scheduled trigger!");
    // },

}
