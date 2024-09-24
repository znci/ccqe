import { PrismaClient } from '../prisma-old/generated/prisma-client-js/default.js'
import pg from 'pg'

const prisma = new PrismaClient()
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "old_cubedcache",
    password: "localdb123!",
    port: 5432
})

async function main() {
    const { rows } = await pool.query('SELECT * FROM cubed_perm_cache')
    console.log(`Found ${rows.length} rows to convert.`)
    for (const row of rows) {
        const data = row.data
        const user = await prisma.player.create({
            data: {
                uuid: data.uuid,
                username: data.username,
                points: data.points,
                exp: data.exp,
                level: data.level,
                guild: data.guild ? data.guild : "None",
                simple_uuid: data.simple_uuid,
            }
        })

        // Create the ranks
        for (const rank of data.ranks) {
            const existingRank = await prisma.rank.findFirst({
                where: {
                    name: rank.name
                }
            })
            if (!existingRank) {
                await prisma.rank.create({
                    data: {
                        name: rank.name,
                        color: rank.color,
                        group: rank.group,
                        visual: rank.visual,
                        is_bold: rank.is_bold,
                        color_code: rank.color_code
                    }
                })
            }
            await prisma.player.update({
                where: {
                    id: user.id
                },
                data: {
                    ranks: {
                        connect: {
                            id: existingRank ? existingRank.id : (await prisma.rank.findFirst({ where: { name: rank.name } })).id,
                            name: rank.name
                        }
                    }
                }
            })
        }

        // Create the activity
        await prisma.activity.create({
            data: {
                online: data.activity.online,
                first_join: new Date(data.activity.first_join),
                first_join_formatted: data.activity.first_join_formatted,
                last_join: new Date(data.activity.last_join),
                last_join_formatted: data.activity.last_join_formatted,
                current_server: data.activity.current_server ? data.activity.current_server : "None",
            }
        })

        await prisma.player.update({
            where: {
                id: user.id
            },
            data: {
                activity: {
                    connect: {
                        id: (await prisma.activity.findFirst({ where: { first_join: new Date(data.activity.first_join) } })).id
                    }
                }
            }
        })

        const existingVersion = await prisma.version.findFirst({
            where: {
                protocol: data.version.protocol
            }
        })
        if (!existingVersion) {
            await prisma.version.create({
                data: {
                    protocol: data.version.protocol
                }
            })
        }

        await prisma.player.update({
            where: {
                id: user.id
            },
            data: {
                version: {
                    connect: {
                        id: existingVersion ? existingVersion.id : (await prisma.version.findFirst({ where: { protocol: data.version.protocol } })).id
                    }
                }
            }
        })

        console.log(`Converted user ${data.username} (${data.uuid}). (${rows.indexOf(row) + 1}/${rows.length})`)

    }
}

await main()

