import { sqliteTable, text, index, integer } from 'drizzle-orm/sqlite-core';
export const moments = sqliteTable('moments', {
 id:text('id').primaryKey(), userId:text('user_id').notNull(), kind:text('kind').notNull(), title:text('title').notNull(), body:text('body').notNull(), mood:text('mood').notNull(), drink:text('drink').notNull(), prompt:text('prompt').notNull(), photo:text('photo'), createdAt:text('created_at').notNull(),
}, t=>[index('idx_moments_user_created').on(t.userId,t.createdAt)]);
export const preferences=sqliteTable('preferences',{userId:text('user_id').primaryKey(),palette:text('palette').notNull().default('lavender'),companion:text('companion').notNull().default('bean'),plant:text('plant').notNull().default('yes'),note:text('note').notNull().default('')});
export const creatureProgress=sqliteTable('creature_progress',{userId:text('user_id').primaryKey(),coffees:integer('coffees').notNull().default(0)});
